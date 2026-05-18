import { useEffect, useMemo, useState } from 'react';
import { AlertCircle, CheckCircle2, LoaderCircle, LogIn, RotateCcw } from 'lucide-react';
import ProgressBar from './quiz/ProgressBar';
import QuestionCard from './quiz/QuestionCard';
import QuizNavigation from './quiz/QuizNavigation';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

const QUESTIONS_PER_PAGE = 10;
const QUIZ_DURATION_SECONDS = 25 * 60;
const GUEST_QUIZ_TOKENS_STORAGE_KEY = 'tech-quiz-pending-session-tokens';
const GUEST_QUIZ_RESULT_STORAGE_KEY = 'tech-quiz-pending-result';

type QuizQuestion = {
  id: number;
  question_text: string;
  options: string[];
  category: string;
};

type QuizReviewItem = {
  id: number;
  question_text: string;
  options: string[];
  category: string;
  explanation: string;
  selected_option_index: number | null;
  correct_option_index: number;
};

type QuizSubmissionResult = {
  score: number;
  total_questions: number;
  answered_questions: number;
  completed_at: string;
  missed_questions: QuizReviewItem[];
  session_token: string;
  requires_auth_to_view: boolean;
};

type StartedQuizSession = {
  questions: QuizQuestion[];
  sessionToken: string;
};

function formatStartedQuizSession(data: unknown): StartedQuizSession | null {
  if (!Array.isArray(data)) {
    return null;
  }

  let sessionToken = '';

  const questions = data.flatMap((row) => {
    if (
      !row ||
      typeof row !== 'object' ||
      !('session_token' in row) ||
      !('id' in row) ||
      !('question_text' in row) ||
      !('options' in row) ||
      !('category' in row)
    ) {
      return [];
    }

    const record = row as {
      session_token: string;
      id: number;
      question_text: string;
      options: unknown;
      category: string;
    };

    if (!sessionToken && typeof record.session_token === 'string') {
      sessionToken = record.session_token;
    }

    return [
      {
        id: record.id,
        question_text: record.question_text,
        options: Array.isArray(record.options)
          ? record.options.map((option) => String(option))
          : [],
        category: record.category,
      },
    ];
  });

  if (!sessionToken || questions.length === 0) {
    return null;
  }

  return {
    questions,
    sessionToken,
  };
}

function formatSubmissionResult(data: unknown): QuizSubmissionResult | null {
  if (!data || typeof data !== 'object') {
    return null;
  }

  const result = data as Partial<QuizSubmissionResult>;

  return {
    score: Number(result.score ?? 0),
    total_questions: Number(result.total_questions ?? 0),
    answered_questions: Number(result.answered_questions ?? 0),
    completed_at: String(result.completed_at ?? ''),
    missed_questions: Array.isArray(result.missed_questions)
      ? result.missed_questions.map((item) => ({
          id: Number((item as QuizReviewItem).id),
          question_text: String((item as QuizReviewItem).question_text),
          options: Array.isArray((item as QuizReviewItem).options)
            ? (item as QuizReviewItem).options.map((option) => String(option))
            : [],
          category: String((item as QuizReviewItem).category),
          explanation: String((item as QuizReviewItem).explanation),
          selected_option_index:
            (item as QuizReviewItem).selected_option_index === null
              ? null
              : Number((item as QuizReviewItem).selected_option_index),
          correct_option_index: Number((item as QuizReviewItem).correct_option_index),
        }))
      : [],
    session_token: String(result.session_token ?? ''),
    requires_auth_to_view: Boolean(result.requires_auth_to_view),
  };
}

function isMissingRpc(errorMessage: string) {
  return (
    errorMessage.includes('Could not find the function public.start_tech_quiz_session') ||
    errorMessage.includes('Could not find the function public.submit_tech_quiz_attempt') ||
    errorMessage.includes('Could not find the function public.claim_quiz_attempts') ||
    errorMessage.includes('schema cache')
  );
}

function readPendingGuestQuizTokens() {
  if (typeof window === 'undefined') {
    return [] as string[];
  }

  try {
    const rawValue = window.localStorage.getItem(GUEST_QUIZ_TOKENS_STORAGE_KEY);

    if (!rawValue) {
      return [];
    }

    const parsedValue = JSON.parse(rawValue);

    return Array.isArray(parsedValue)
      ? parsedValue.filter((value): value is string => typeof value === 'string')
      : [];
  } catch {
    return [];
  }
}

function writePendingGuestQuizTokens(tokens: string[]) {
  if (typeof window === 'undefined') {
    return;
  }

  if (tokens.length === 0) {
    window.localStorage.removeItem(GUEST_QUIZ_TOKENS_STORAGE_KEY);
    return;
  }

  window.localStorage.setItem(GUEST_QUIZ_TOKENS_STORAGE_KEY, JSON.stringify(tokens));
}

function readPendingGuestQuizResult() {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const rawValue = window.localStorage.getItem(GUEST_QUIZ_RESULT_STORAGE_KEY);

    if (!rawValue) {
      return null;
    }

    return formatSubmissionResult(JSON.parse(rawValue));
  } catch {
    return null;
  }
}

function writePendingGuestQuizResult(result: QuizSubmissionResult | null) {
  if (typeof window === 'undefined') {
    return;
  }

  if (!result) {
    window.localStorage.removeItem(GUEST_QUIZ_RESULT_STORAGE_KEY);
    return;
  }

  window.localStorage.setItem(GUEST_QUIZ_RESULT_STORAGE_KEY, JSON.stringify(result));
}

export default function TechQuiz({ onRequireAuth }: { onRequireAuth?: () => void }) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [quizSessionToken, setQuizSessionToken] = useState('');
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthStateReady, setIsAuthStateReady] = useState(false);
  const [isClaimingGuestAttempts, setIsClaimingGuestAttempts] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [submissionWarnings, setSubmissionWarnings] = useState<number[]>([]);
  const [result, setResult] = useState<QuizSubmissionResult | null>(null);
  const [timeLeftInSeconds, setTimeLeftInSeconds] = useState(QUIZ_DURATION_SECONDS);

  const answeredQuestions = Object.keys(userAnswers).length;
  const totalSteps = Math.max(1, Math.ceil(questions.length / QUESTIONS_PER_PAGE));
  const unansweredQuestionNumbers = useMemo(
    () =>
      questions.flatMap((question, index) =>
        userAnswers[question.id] === undefined ? [index + 1] : [],
      ),
    [questions, userAnswers],
  );
  const currentPageQuestions = useMemo(() => {
    const start = (currentStep - 1) * QUESTIONS_PER_PAGE;

    return questions.slice(start, start + QUESTIONS_PER_PAGE);
  }, [currentStep, questions]);
  const formattedTimeLeft = useMemo(() => {
    const minutes = Math.floor(timeLeftInSeconds / 60)
      .toString()
      .padStart(2, '0');
    const seconds = (timeLeftInSeconds % 60).toString().padStart(2, '0');

    return `${minutes}:${seconds}`;
  }, [timeLeftInSeconds]);

  async function submitQuiz({ allowUnanswered = false }: { allowUnanswered?: boolean } = {}) {
    if (!supabase) {
      setErrorMessage('Supabase is not configured for submissions yet.');
      return;
    }

    if (!quizSessionToken) {
      setErrorMessage('Quiz session is missing. Restart the quiz to generate a fresh attempt.');
      return;
    }

    if (!allowUnanswered && unansweredQuestionNumbers.length > 0) {
      setSubmissionWarnings(unansweredQuestionNumbers);
      setErrorMessage(
        unansweredQuestionNumbers.length === 1
          ? `Question ${unansweredQuestionNumbers[0]} is not answered.`
          : `${unansweredQuestionNumbers.length} questions are not answered yet.`,
      );
      setCurrentStep(Math.ceil(unansweredQuestionNumbers[0] / QUESTIONS_PER_PAGE));
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');
    setSubmissionWarnings([]);

    const answerPayload = questions.map((question) => ({
      question_id: question.id,
      selected_option_index: userAnswers[question.id] ?? null,
    }));

    const { data, error } = await supabase.rpc('submit_tech_quiz_attempt', {
      session_token: quizSessionToken,
      answer_payload: answerPayload,
      auto_submitted: allowUnanswered,
    });

    if (error) {
      setErrorMessage(
        isMissingRpc(error.message)
          ? 'Quiz submission failed because the guest quiz session SQL has not been added to this Supabase project yet. Run the latest migration, then try again.'
          : error.message,
      );
      setIsSubmitting(false);
      return;
    }

    const submissionResult = formatSubmissionResult(data);

    if (!submissionResult) {
      setErrorMessage('The quiz was submitted, but the result payload was not in the expected format.');
      setIsSubmitting(false);
      return;
    }

    if (!isAuthenticated && submissionResult.session_token) {
      writePendingGuestQuizTokens(
        Array.from(new Set([...readPendingGuestQuizTokens(), submissionResult.session_token])),
      );
      writePendingGuestQuizResult(submissionResult);
    } else {
      writePendingGuestQuizResult(null);
    }

    setResult(submissionResult);
    setIsSubmitting(false);
  }

  async function loadQuiz() {
    setIsLoading(true);
    setErrorMessage('');

    if (!supabase || !isSupabaseConfigured) {
      setErrorMessage('Add your Supabase URL and anon key to load the tech quiz.');
      setQuestions([]);
      setIsLoading(false);
      return;
    }

    const { data, error } = await supabase.rpc('start_tech_quiz_session');

    if (error) {
      setQuestions([]);
      setErrorMessage(
        isMissingRpc(error.message)
          ? 'Quiz loading failed because public.start_tech_quiz_session() is missing in this Supabase project. Run the latest guest quiz migration SQL, then try again.'
          : error.message,
      );
      setIsLoading(false);
      return;
    }

    const startedSession = formatStartedQuizSession(data);

    if (!startedSession) {
      setQuestions([]);
      setErrorMessage('No quiz questions are available yet. Seed the questions table and try again.');
      setSubmissionWarnings([]);
      setIsLoading(false);
      return;
    }

    setQuestions(startedSession.questions);
    setQuizSessionToken(startedSession.sessionToken);
    setCurrentStep(1);
    setUserAnswers({});
    setResult(null);
    setSubmissionWarnings([]);
    setTimeLeftInSeconds(QUIZ_DURATION_SECONDS);
    setIsLoading(false);
  }

  useEffect(() => {
    if (!supabase) {
      setIsAuthStateReady(true);
      return;
    }

    let isMounted = true;

    void supabase.auth.getSession().then(({ data }) => {
      if (isMounted) {
        setIsAuthenticated(Boolean(data.session?.user));
        setIsAuthStateReady(true);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(Boolean(session?.user));
      setIsAuthStateReady(true);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!isAuthStateReady) {
      return;
    }

    const storedResult = isAuthenticated ? readPendingGuestQuizResult() : null;

    if (storedResult) {
      setQuestions([]);
      setQuizSessionToken(storedResult.session_token);
      setResult(storedResult);
      setErrorMessage('');
      setSubmissionWarnings([]);
      setIsLoading(false);
      return;
    }

    if (questions.length > 0 || result) {
      return;
    }

    void loadQuiz();
  }, [isAuthStateReady, isAuthenticated]);

  useEffect(() => {
    if (!supabase || !isAuthenticated) {
      return;
    }

    const client = supabase;
    const pendingTokens = readPendingGuestQuizTokens();

    if (pendingTokens.length === 0) {
      return;
    }

    let isCancelled = false;

    async function claimGuestAttempts() {
      setIsClaimingGuestAttempts(true);

      const { error } = await client.rpc('claim_quiz_attempts', {
        session_tokens: pendingTokens,
      });

      if (!isCancelled) {
        if (!error) {
          writePendingGuestQuizTokens([]);
          const storedResult = readPendingGuestQuizResult();
          if (storedResult) {
            writePendingGuestQuizResult({
              ...storedResult,
              requires_auth_to_view: false,
            });
            setResult((currentResult) =>
              currentResult && currentResult.session_token === storedResult.session_token
                ? { ...currentResult, requires_auth_to_view: false }
                : currentResult,
            );
          }
        }

        setIsClaimingGuestAttempts(false);
      }
    }

    void claimGuestAttempts();

    return () => {
      isCancelled = true;
    };
  }, [isAuthenticated]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentStep, result]);

  useEffect(() => {
    if (isLoading || isSubmitting || result || questions.length === 0) {
      return;
    }

    if (timeLeftInSeconds <= 0) {
      void submitQuiz({ allowUnanswered: true });
      return;
    }

    const timerId = window.setTimeout(() => {
      setTimeLeftInSeconds((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [isLoading, isSubmitting, questions.length, result, timeLeftInSeconds]);

  const handleAnswerSelect = (questionId: number, optionIndex: number) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
    setSubmissionWarnings((prev) =>
      prev.length === 0
        ? prev
        : prev.filter((questionNumber) => {
            const question = questions[questionNumber - 1];
            return question ? question.id !== questionId : true;
          }),
    );
  };

  const handleRestart = async () => {
    writePendingGuestQuizResult(null);
    await loadQuiz();
  };

  const handleRequireAuth = () => {
    if (onRequireAuth) {
      onRequireAuth();
    }
  };

  const handleSubmit = async () => {
    await submitQuiz();
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex items-center gap-3 rounded-[2rem] bg-white px-6 py-5 editorial-shadow">
          <LoaderCircle className="animate-spin text-primary" size={20} />
          <p className="text-sm text-secondary">Preparing a fresh 50-question quiz session...</p>
        </div>
      </div>
    );
  }

  if (errorMessage && questions.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="rounded-[2rem] border border-red-200 bg-red-50 p-6 text-red-700">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5" size={18} />
            <div>
              <h2 className="font-headline text-xl font-bold">Quiz unavailable</h2>
              <p className="mt-2 text-sm leading-relaxed">{errorMessage}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (result) {
    const percentage =
      result.total_questions === 0 ? 0 : Math.round((result.score / result.total_questions) * 100);
    const showLoginPrompt = result.requires_auth_to_view && !isAuthenticated;

    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-12 space-y-8">
        <section className="rounded-[2.5rem] bg-white p-6 md:p-10 editorial-shadow border border-zinc-100">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="min-w-0">
              <p className="font-label text-[10px] uppercase tracking-[0.24em] text-tertiary mb-3">
                Quiz Submitted
              </p>
              <h1 className="font-headline text-3xl md:text-4xl font-bold tracking-tight text-on-surface">
                Tech Quiz Results
              </h1>
              <p className="mt-3 max-w-2xl text-secondary">
                This attempt is now attached to your account and can feed your leaderboard standing and profile stats.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4 w-full md:w-auto">
              {showLoginPrompt ? (
                <div className="rounded-[1.75rem] bg-amber-50 px-5 py-6 text-center text-amber-700">
                  <p className="font-label text-[10px] uppercase tracking-[0.2em] text-amber-600">
                    Sign in to view your score
                  </p>
                  <p className="mt-3 text-sm text-amber-700">
                    This quiz attempt is ready to be claimed. Log in or register so your score is attached to your profile, and your full result details become available.
                  </p>
                  <button
                    type="button"
                    onClick={handleRequireAuth}
                    disabled={!onRequireAuth}
                    className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-bold text-white transition-all hover:bg-primary-container disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    View your scores
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="rounded-[1.75rem] bg-zinc-50 px-5 py-4">
                    <p className="font-label text-[10px] uppercase tracking-[0.2em] text-zinc-400">Score</p>
                    <p className="mt-2 font-headline text-3xl font-bold text-primary">
                      {result.score}/{result.total_questions}
                    </p>
                  </div>
                  <div className="rounded-[1.75rem] bg-zinc-50 px-5 py-4">
                    <p className="font-label text-[10px] uppercase tracking-[0.2em] text-zinc-400">Percentage</p>
                    <p className="mt-2 font-headline text-3xl font-bold text-zinc-900">{percentage}%</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {showLoginPrompt ? (
          <section className="rounded-[2rem] bg-amber-50 p-6 md:p-8 editorial-shadow border border-amber-100">
            <div className="flex flex-col gap-5">
              <div>
                <h2 className="font-headline text-2xl font-bold tracking-tight text-amber-900">
                  Claim your result securely
                </h2>
                <p className="mt-2 text-sm text-amber-800">
                  Sign in or register to save this attempt on your profile, unlock the detailed score breakdown, and appear on the leaderboard.
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={handleRequireAuth}
                  disabled={!onRequireAuth}
                  className="inline-flex w-full items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-bold text-white transition-all hover:bg-primary-container disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Log in or register
                </button>
                <button
                  type="button"
                  onClick={handleRestart}
                  className="inline-flex w-full items-center justify-center rounded-full border border-amber-200 bg-white px-5 py-3 text-sm font-bold text-amber-900 transition-all hover:bg-amber-100"
                >
                  Start another quiz
                </button>
              </div>
            </div>
          </section>
        ) : (
          <section className="rounded-[2rem] bg-white p-6 md:p-8 editorial-shadow border border-zinc-100">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <h2 className="font-headline text-2xl font-bold tracking-tight text-on-surface">
                  Review Section
                </h2>
                <p className="mt-2 text-sm text-secondary">
                  {result.missed_questions.length === 0
                    ? 'Excellent work. You answered every question correctly.'
                    : `You missed ${result.missed_questions.length} question${result.missed_questions.length === 1 ? '' : 's'}.`}
                </p>
              </div>
              <button
                type="button"
                onClick={handleRestart}
                className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full border border-zinc-200 px-5 py-3 text-sm font-bold text-zinc-700 transition-colors hover:border-zinc-300 hover:text-zinc-900"
              >
                <RotateCcw size={16} />
                Restart Quiz
              </button>
            </div>

            <div className="mt-8 space-y-5">
              {result.missed_questions.length === 0 ? (
                <div className="rounded-[1.75rem] bg-emerald-50 px-5 py-4 text-emerald-700">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 size={18} />
                    <p className="text-sm font-medium">No review items this round.</p>
                  </div>
                </div>
              ) : (
                result.missed_questions.map((item, index) => (
                  <article
                    key={`${item.id}-${index}`}
                    className="rounded-[1.75rem] border border-zinc-100 bg-zinc-50 p-5"
                  >
                    <p className="font-label text-[10px] uppercase tracking-[0.22em] text-zinc-400">
                      {item.category}
                    </p>
                    <h3 className="mt-2 font-headline text-xl font-bold tracking-tight text-on-surface">
                      {item.question_text}
                    </h3>
                    <div className="mt-4 grid gap-2 text-sm text-secondary">
                      <p>
                        Your answer:{' '}
                        <span className="font-semibold text-zinc-800">
                          {item.selected_option_index === null
                            ? 'Not answered'
                            : item.options[item.selected_option_index] ?? 'Not answered'}
                        </span>
                      </p>
                      <p>
                        Correct answer:{' '}
                        <span className="font-semibold text-primary">
                          {item.options[item.correct_option_index] ?? 'Unavailable'}
                        </span>
                      </p>
                      <p className="leading-relaxed">
                        Explanation:{' '}
                        <span className="text-zinc-700">{item.explanation}</span>
                      </p>
                    </div>
                  </article>
                ))
              )}
            </div>
          </section>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-12">
      <div className="space-y-8">
        <section className="rounded-[2.5rem] bg-[radial-gradient(circle_at_top_left,_rgba(43,55,166,0.12),_transparent_50%),linear-gradient(135deg,_#ffffff_0%,_#f6f8ff_100%)] p-6 md:p-10 editorial-shadow border border-zinc-100">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0">
              <p className="font-label text-[10px] uppercase tracking-[0.24em] text-tertiary mb-3">
                Supabase Quiz Engine
              </p>
              <h1 className="font-headline text-3xl md:text-5xl font-bold tracking-tight text-on-surface">
                Tech Quiz Wizard
              </h1>
              <p className="mt-4 max-w-3xl text-base md:text-lg leading-relaxed text-secondary">
                Each attempt now starts its own stored quiz session, pulls 50 random questions from the pool, and paginates them across five screens.
              </p>
            </div>

            <div
              className={`w-full lg:w-auto rounded-[1.75rem] border px-5 py-4 lg:min-w-52 ${
                timeLeftInSeconds <= 300
                  ? 'border-red-200 bg-red-50 text-red-700'
                  : 'border-zinc-100 bg-white text-zinc-900'
              }`}
            >
              <p className="font-label text-[10px] uppercase tracking-[0.22em] text-current/70">
                Time Left
              </p>
              <p className="mt-2 font-headline text-3xl font-bold tracking-tight">
                {formattedTimeLeft}
              </p>
              <p className="mt-2 text-sm text-current/80">
                This attempt auto-submits after 25 minutes.
              </p>
            </div>
          </div>
        </section>

        <ProgressBar
          currentStep={currentStep}
          totalSteps={totalSteps}
          answeredQuestions={answeredQuestions}
          totalQuestions={questions.length}
        />

        {errorMessage ? (
          <div className="rounded-[1.75rem] border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-700">
            {errorMessage}
          </div>
        ) : null}

        {submissionWarnings.length > 0 ? (
          <section className="rounded-[1.75rem] border border-red-200 bg-red-50 px-5 py-5 text-red-700">
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 shrink-0" size={18} />
              <div className="space-y-3">
                <div>
                  <h2 className="font-headline text-lg font-bold">Unanswered Questions</h2>
                  <p className="mt-1 text-sm text-red-600">
                    Answer every question before submitting this quiz.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {submissionWarnings.map((questionNumber) => (
                    <span
                      key={questionNumber}
                      className="rounded-full border border-red-300 bg-white px-3 py-1 text-xs font-bold uppercase tracking-wide text-red-700"
                    >
                      Question {questionNumber} is not answered
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>
        ) : null}

        <section className="space-y-5">
          {currentPageQuestions.map((question, index) => (
            <QuestionCard
              key={question.id}
              questionNumber={(currentStep - 1) * QUESTIONS_PER_PAGE + index + 1}
              questionText={question.question_text}
              category={question.category}
              options={question.options}
              selectedOptionIndex={userAnswers[question.id]}
              showUnansweredWarning={submissionWarnings.includes(
                (currentStep - 1) * QUESTIONS_PER_PAGE + index + 1,
              )}
              onSelect={(optionIndex) => handleAnswerSelect(question.id, optionIndex)}
            />
          ))}
        </section>

        <QuizNavigation
          currentStep={currentStep}
          totalSteps={totalSteps}
          onPrevious={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
          onNext={() => setCurrentStep((prev) => Math.min(totalSteps, prev + 1))}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
}
