import { useCallback, useEffect, useState } from 'react';
import Dashboard from './components/Dashboard';
import SignUp from './components/SignUp';
import TechQuiz from './components/TechQuiz';
import { isSupabaseConfigured, supabase } from './lib/supabase';
import { type AuthUser, type LeaderboardEntry, type QuizAttempt } from './lib/scholar';
import scholarlyLogo from '../logo-content.png';

const GUEST_QUIZ_TOKENS_STORAGE_KEY = 'tech-quiz-pending-session-tokens';
const GUEST_QUIZ_RESULT_STORAGE_KEY = 'tech-quiz-pending-result';

function getPendingGuestQuizTokens() {
  try {
    const value = window.localStorage.getItem(GUEST_QUIZ_TOKENS_STORAGE_KEY);
    const tokens = value ? JSON.parse(value) : [];
    return Array.isArray(tokens) ? tokens.filter((token): token is string => typeof token === 'string') : [];
  } catch {
    return [];
  }
}

function toAuthUser(user: { id: string; email?: string | null; user_metadata?: Record<string, unknown> } | null): AuthUser {
  return user ? { id: user.id, email: user.email ?? null, user_metadata: user.user_metadata } : null;
}

export default function App() {
  const [authUser, setAuthUser] = useState<AuthUser>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [view, setView] = useState<'quiz' | 'dashboard'>(() =>
    typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('auth') === 'complete'
      ? 'dashboard'
      : 'quiz',
  );
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const [leaderboardEntries, setLeaderboardEntries] = useState<LeaderboardEntry[]>([]);
  const [isDashboardLoading, setIsDashboardLoading] = useState(false);

  const loadDashboard = useCallback(async () => {
    if (!supabase || !authUser) {
      setAttempts([]);
      setLeaderboardEntries([]);
      return;
    }

    setIsDashboardLoading(true);
    const [attemptsResponse, leaderboardResponse] = await Promise.all([
      supabase.rpc('get_my_quiz_attempts'),
      supabase.from('quiz_leaderboard').select('*').order('total_points', { ascending: false }),
    ]);

    if (!attemptsResponse.error && Array.isArray(attemptsResponse.data)) {
      setAttempts(
        attemptsResponse.data.map((attempt) => ({
          session_token: String((attempt as QuizAttempt).session_token),
          score: Number((attempt as QuizAttempt).score ?? 0),
          total_questions: Number((attempt as QuizAttempt).total_questions ?? 0),
          answered_questions: Number((attempt as QuizAttempt).answered_questions ?? 0),
          completed_at: String((attempt as QuizAttempt).completed_at ?? ''),
          auto_submitted: Boolean((attempt as QuizAttempt).auto_submitted),
        })),
      );
    }

    if (!leaderboardResponse.error && Array.isArray(leaderboardResponse.data)) {
      setLeaderboardEntries(leaderboardResponse.data as LeaderboardEntry[]);
    }

    setIsDashboardLoading(false);
  }, [authUser]);

  useEffect(() => {
    if (!supabase || !isSupabaseConfigured) return;

    let isMounted = true;
    void supabase.auth.getSession().then(({ data }) => {
      if (isMounted) {
        setAuthUser(toAuthUser(data.session?.user ?? null));
        if (data.session?.user && new URLSearchParams(window.location.search).get('auth') === 'complete') {
          setView('dashboard');
        }
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthUser(toAuthUser(session?.user ?? null));
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!authUser || !supabase) return;

    let cancelled = false;
    async function claimAndLoadDashboard() {
      const pendingTokens = getPendingGuestQuizTokens();
      if (pendingTokens.length > 0) {
        const { error } = await supabase!.rpc('claim_quiz_attempts', { session_tokens: pendingTokens });
        if (!error) {
          window.localStorage.removeItem(GUEST_QUIZ_TOKENS_STORAGE_KEY);
          window.localStorage.removeItem(GUEST_QUIZ_RESULT_STORAGE_KEY);
        }
      }
      if (!cancelled) await loadDashboard();
    }

    void claimAndLoadDashboard();
    return () => { cancelled = true; };
  }, [authUser, loadDashboard]);

  const openAuthModal = () => setIsAuthModalOpen(true);
  const openDashboard = () => {
    setView('dashboard');
    void loadDashboard();
  };

  return (
    <div className="min-h-screen bg-surface">
      <nav className="fixed top-0 z-50 w-full bg-white/80 shadow-sm backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex h-16 items-center justify-between gap-3">
            <img src={scholarlyLogo} alt="Scholarly" className="h-14 w-auto object-contain" />
            <div className="flex items-center justify-end gap-2 sm:gap-3">
              <a href="https://scholarlys.ijeshadigitalhub.com" target="_blank" rel="noreferrer" className="rounded-full border border-primary px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-primary transition-colors hover:bg-primary hover:text-white sm:px-4 sm:text-xs">
                Competition Portal
              </a>
              {authUser ? (
                <button type="button" onClick={openDashboard} className="rounded-full bg-primary px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-white transition-all hover:bg-primary-container sm:px-4 sm:text-xs">
                  Dashboard
                </button>
              ) : (
                <button type="button" onClick={openAuthModal} className="rounded-full border border-primary bg-primary px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-white transition-all hover:bg-primary-container sm:px-4 sm:text-xs">
                  Login / Register
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-16">
        {authUser && view === 'dashboard' ? (
          <Dashboard user={authUser} attempts={attempts} leaderboardEntries={leaderboardEntries} isLoading={isDashboardLoading} onTakeAnotherTest={() => setView('quiz')} />
        ) : (
          <TechQuiz onRequireAuth={openAuthModal} />
        )}
      </main>

      <footer className="border-t border-zinc-100 bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-8">
          <div className="mb-2 text-xl font-bold font-headline text-zinc-900">Scholarly Quiz Hub</div>
          <p className="font-label text-[10px] uppercase tracking-widest text-zinc-500">© 2026 Scholarly Quiz Hub. All rights reserved.</p>
        </div>
      </footer>

      {isAuthModalOpen ? (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 p-4 sm:p-6">
          <div className="w-full max-w-6xl max-h-[calc(100vh-2rem)] overflow-y-auto">
            <SignUp onAuthenticated={() => { setIsAuthModalOpen(false); setView('dashboard'); }} onCancel={() => setIsAuthModalOpen(false)} />
          </div>
        </div>
      ) : null}
    </div>
  );
}
