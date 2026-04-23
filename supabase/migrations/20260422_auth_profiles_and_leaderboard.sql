create table if not exists public.user_profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  full_name text,
  school_name text,
  grade_level text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.user_profiles enable row level security;

create or replace function public.handle_user_profile_sync()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.user_profiles (
    id,
    email,
    full_name,
    school_name,
    grade_level,
    created_at,
    updated_at
  )
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    coalesce(new.raw_user_meta_data ->> 'school_name', ''),
    coalesce(new.raw_user_meta_data ->> 'grade_level', ''),
    coalesce(new.created_at, timezone('utc', now())),
    timezone('utc', now())
  )
  on conflict (id) do update
  set
    email = excluded.email,
    full_name = excluded.full_name,
    school_name = excluded.school_name,
    grade_level = excluded.grade_level,
    updated_at = timezone('utc', now());

  return new;
end;
$$;

drop trigger if exists sync_user_profile_on_auth_user_change on auth.users;

create trigger sync_user_profile_on_auth_user_change
after insert or update on auth.users
for each row
execute function public.handle_user_profile_sync();

insert into public.user_profiles (
  id,
  email,
  full_name,
  school_name,
  grade_level,
  created_at,
  updated_at
)
select
  users.id,
  users.email,
  coalesce(users.raw_user_meta_data ->> 'full_name', ''),
  coalesce(users.raw_user_meta_data ->> 'school_name', ''),
  coalesce(users.raw_user_meta_data ->> 'grade_level', ''),
  coalesce(users.created_at, timezone('utc', now())),
  timezone('utc', now())
from auth.users as users
on conflict (id) do update
set
  email = excluded.email,
  full_name = excluded.full_name,
  school_name = excluded.school_name,
  grade_level = excluded.grade_level,
  updated_at = timezone('utc', now());

grant select on public.user_profiles to anon, authenticated;

drop policy if exists "public profiles are viewable" on public.user_profiles;
create policy "public profiles are viewable"
  on public.user_profiles
  for select
  to anon, authenticated
  using (true);

drop policy if exists "users can update own profile" on public.user_profiles;
create policy "users can update own profile"
  on public.user_profiles
  for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

drop view if exists public.quiz_leaderboard;

create view public.quiz_leaderboard as
select
  qa.user_id,
  coalesce(nullif(trim(profile.full_name), ''), split_part(coalesce(profile.email, ''), '@', 1), 'Scholar') as full_name,
  nullif(trim(profile.school_name), '') as school_name,
  nullif(trim(profile.grade_level), '') as grade_level,
  count(*)::integer as attempts_count,
  coalesce(sum(qa.score), 0)::integer as total_points,
  round(avg((qa.score::numeric / nullif(qa.total_questions, 0)) * 100), 2) as average_percentage,
  max(qa.score)::integer as best_score,
  max(qa.completed_at) as last_completed_at
from public.quiz_attempts qa
left join public.user_profiles profile on profile.id = qa.user_id
where qa.user_id is not null
  and qa.status = 'submitted'
group by qa.user_id, profile.full_name, profile.email, profile.school_name, profile.grade_level;

grant select on public.quiz_leaderboard to anon, authenticated;
