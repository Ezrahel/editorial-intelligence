create extension if not exists pgcrypto;

alter table if exists public.quiz_attempts
  alter column user_id drop not null;

alter table if exists public.quiz_attempts
  alter column score drop not null;

alter table if exists public.quiz_attempts
  alter column completed_at drop not null;

alter table if exists public.quiz_attempts
  alter column completed_at drop default;

alter table if exists public.quiz_attempts
  alter column total_questions set default 50;

alter table if exists public.quiz_attempts
  drop constraint if exists quiz_attempts_score_check;

alter table if exists public.quiz_attempts
  add constraint quiz_attempts_score_check
    check (score is null or score >= 0);

alter table if exists public.quiz_attempts
  add column if not exists session_token uuid,
  add column if not exists question_ids bigint[] not null default '{}'::bigint[],
  add column if not exists answer_payload jsonb not null default '[]'::jsonb,
  add column if not exists answered_questions integer not null default 0,
  add column if not exists missed_questions jsonb not null default '[]'::jsonb,
  add column if not exists status text not null default 'in_progress',
  add column if not exists auto_submitted boolean not null default false,
  add column if not exists started_at timestamptz not null default timezone('utc', now()),
  add column if not exists claimed_at timestamptz;

update public.quiz_attempts
set
  session_token = coalesce(session_token, gen_random_uuid()),
  answer_payload = coalesce(answer_payload, '[]'::jsonb),
  missed_questions = coalesce(missed_questions, '[]'::jsonb),
  answered_questions = coalesce(answered_questions, total_questions, 0),
  status = coalesce(status, 'submitted'),
  started_at = coalesce(started_at, completed_at, timezone('utc', now()))
where
  session_token is null
  or answer_payload is null
  or missed_questions is null
  or answered_questions is null
  or status is null
  or started_at is null;

alter table if exists public.quiz_attempts
  alter column session_token set default gen_random_uuid();

alter table if exists public.quiz_attempts
  alter column session_token set not null;

alter table if exists public.quiz_attempts
  drop constraint if exists quiz_attempts_status_check;

alter table if exists public.quiz_attempts
  add constraint quiz_attempts_status_check
    check (status in ('in_progress', 'submitted'));

alter table if exists public.quiz_attempts
  drop constraint if exists quiz_attempts_answered_questions_check;

alter table if exists public.quiz_attempts
  add constraint quiz_attempts_answered_questions_check
    check (answered_questions >= 0 and answered_questions <= total_questions);

create unique index if not exists quiz_attempts_session_token_idx
  on public.quiz_attempts (session_token);

create index if not exists quiz_attempts_status_completed_at_idx
  on public.quiz_attempts (status, completed_at desc);

create index if not exists quiz_attempts_user_id_status_completed_at_idx
  on public.quiz_attempts (user_id, status, completed_at desc);

revoke all on table public.quiz_attempts from anon, authenticated;

grant select on table public.quiz_attempts to authenticated;

drop policy if exists "students can insert their own quiz attempts" on public.quiz_attempts;
drop policy if exists "students can read their own quiz attempts" on public.quiz_attempts;
drop policy if exists "authenticated users can read their claimed quiz attempts" on public.quiz_attempts;

create policy "authenticated users can read their claimed quiz attempts"
  on public.quiz_attempts
  for select
  to authenticated
  using (auth.uid() = user_id);

drop function if exists public.get_random_tech_quiz();
drop function if exists public.submit_tech_quiz_attempt(jsonb);

create or replace function public.start_tech_quiz_session()
returns table (
  session_token uuid,
  id bigint,
  question_text text,
  options jsonb,
  category text
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_session_token uuid := gen_random_uuid();
  v_user_id uuid := auth.uid();
  v_question_ids bigint[];
begin
  select coalesce(array_agg(picked.id order by picked.question_order), '{}'::bigint[])
  into v_question_ids
  from (
    select
      randomized.id,
      row_number() over () as question_order
    from (
      select q.id
      from public.questions q
      order by random()
      limit 50
    ) randomized
  ) picked;

  if coalesce(array_length(v_question_ids, 1), 0) = 0 then
    raise exception 'No quiz questions are available yet.';
  end if;

  insert into public.quiz_attempts (
    session_token,
    user_id,
    question_ids,
    total_questions,
    started_at,
    status
  )
  values (
    v_session_token,
    v_user_id,
    v_question_ids,
    coalesce(array_length(v_question_ids, 1), 0),
    timezone('utc', now()),
    'in_progress'
  );

  return query
  select
    v_session_token,
    q.id,
    q.question_text,
    q.options,
    q.category
  from unnest(v_question_ids) with ordinality as picked(question_id, question_order)
  join public.questions q on q.id = picked.question_id
  order by picked.question_order;
end;
$$;

grant execute on function public.start_tech_quiz_session() to anon, authenticated;

create or replace function public.submit_tech_quiz_attempt(
  session_token uuid,
  answer_payload jsonb,
  auto_submitted boolean default false
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_attempt public.quiz_attempts%rowtype;
  v_user_id uuid := auth.uid();
  v_total_questions integer;
  v_answered_questions integer;
  v_score integer;
  v_completed_at timestamptz := timezone('utc', now());
  v_missed_questions jsonb;
begin
  select *
  into v_attempt
  from public.quiz_attempts qa
  where qa.session_token = submit_tech_quiz_attempt.session_token
  for update;

  if not found then
    raise exception 'Quiz session not found.';
  end if;

  if v_attempt.status = 'submitted' and v_attempt.completed_at is not null then
    return jsonb_build_object(
      'score', coalesce(v_attempt.score, 0),
      'total_questions', v_attempt.total_questions,
      'answered_questions', v_attempt.answered_questions,
      'completed_at', v_attempt.completed_at,
      'missed_questions', v_attempt.missed_questions,
      'session_token', v_attempt.session_token,
      'requires_auth_to_view', coalesce(v_attempt.user_id, v_user_id) is null
    );
  end if;

  with expected_questions as (
    select
      q.id,
      q.question_text,
      q.options,
      q.category,
      q.explanation,
      q.correct_option_index,
      ordinality as question_order
    from unnest(v_attempt.question_ids) with ordinality as picked(question_id, ordinality)
    join public.questions q on q.id = picked.question_id
  ),
  submitted_answers as (
    select
      (item ->> 'question_id')::bigint as question_id,
      case
        when item ? 'selected_option_index'
          and item ->> 'selected_option_index' <> ''
        then (item ->> 'selected_option_index')::integer
        else null
      end as selected_option_index
    from jsonb_array_elements(coalesce(submit_tech_quiz_attempt.answer_payload, '[]'::jsonb)) item
  ),
  matched_questions as (
    select
      q.id,
      q.question_text,
      q.options,
      q.category,
      q.explanation,
      q.correct_option_index,
      a.selected_option_index,
      q.question_order
    from expected_questions q
    left join submitted_answers a on a.question_id = q.id
  )
  select
    count(*),
    count(*) filter (where selected_option_index is not null),
    count(*) filter (where selected_option_index = correct_option_index),
    coalesce(
      jsonb_agg(
        jsonb_build_object(
          'id', id,
          'question_text', question_text,
          'options', options,
          'category', category,
          'explanation', explanation,
          'selected_option_index', selected_option_index,
          'correct_option_index', correct_option_index
        )
        order by question_order
      ) filter (where coalesce(selected_option_index, -1) <> correct_option_index),
      '[]'::jsonb
    )
  into v_total_questions, v_answered_questions, v_score, v_missed_questions
  from matched_questions;

  if coalesce(v_total_questions, 0) = 0 then
    raise exception 'No valid quiz answers were submitted.';
  end if;

  update public.quiz_attempts
  set
    user_id = coalesce(public.quiz_attempts.user_id, v_user_id),
    answer_payload = coalesce(submit_tech_quiz_attempt.answer_payload, '[]'::jsonb),
    answered_questions = v_answered_questions,
    score = v_score,
    total_questions = v_total_questions,
    missed_questions = v_missed_questions,
    completed_at = v_completed_at,
    auto_submitted = coalesce(submit_tech_quiz_attempt.auto_submitted, false),
    status = 'submitted',
    claimed_at = case
      when public.quiz_attempts.user_id is null and v_user_id is not null then v_completed_at
      else public.quiz_attempts.claimed_at
    end
  where public.quiz_attempts.id = v_attempt.id;

  return jsonb_build_object(
    'score', v_score,
    'total_questions', v_total_questions,
    'answered_questions', v_answered_questions,
    'completed_at', v_completed_at,
    'missed_questions', v_missed_questions,
    'session_token', v_attempt.session_token,
    'requires_auth_to_view', coalesce(v_attempt.user_id, v_user_id) is null
  );
end;
$$;

grant execute on function public.submit_tech_quiz_attempt(uuid, jsonb, boolean) to anon, authenticated;

create or replace function public.claim_quiz_attempts(session_tokens uuid[])
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_claimed_count integer := 0;
  v_requested_count integer := coalesce(array_length(session_tokens, 1), 0);
begin
  if v_user_id is null then
    raise exception 'Authentication required to claim quiz attempts.';
  end if;

  if v_requested_count = 0 then
    return jsonb_build_object(
      'claimed_count', 0,
      'requested_count', 0
    );
  end if;

  update public.quiz_attempts
  set
    user_id = v_user_id,
    claimed_at = timezone('utc', now())
  where public.quiz_attempts.session_token = any(session_tokens)
    and public.quiz_attempts.user_id is null;

  get diagnostics v_claimed_count = row_count;

  return jsonb_build_object(
    'claimed_count', v_claimed_count,
    'requested_count', v_requested_count
  );
end;
$$;

grant execute on function public.claim_quiz_attempts(uuid[]) to authenticated;

create or replace function public.get_my_quiz_attempts()
returns table (
  session_token uuid,
  score integer,
  total_questions integer,
  answered_questions integer,
  completed_at timestamptz,
  auto_submitted boolean
)
language sql
security definer
set search_path = public
as $$
  select
    qa.session_token,
    qa.score,
    qa.total_questions,
    qa.answered_questions,
    qa.completed_at,
    qa.auto_submitted
  from public.quiz_attempts qa
  where qa.user_id = auth.uid()
    and qa.status = 'submitted'
  order by qa.completed_at desc;
$$;

grant execute on function public.get_my_quiz_attempts() to authenticated;

drop view if exists public.quiz_leaderboard;

create view public.quiz_leaderboard as
select
  qa.user_id,
  count(*)::integer as attempts_count,
  coalesce(sum(qa.score), 0)::integer as total_points,
  round(avg((qa.score::numeric / nullif(qa.total_questions, 0)) * 100), 2) as average_percentage,
  max(qa.score)::integer as best_score,
  max(qa.completed_at) as last_completed_at
from public.quiz_attempts qa
where qa.user_id is not null
  and qa.status = 'submitted'
group by qa.user_id;

grant select on public.quiz_leaderboard to anon, authenticated;
