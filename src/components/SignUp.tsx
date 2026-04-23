import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
  KeyRound,
  LoaderCircle,
  LockKeyhole,
  Mail,
  ShieldCheck,
  UserPlus,
} from 'lucide-react';
import Avatar from './Avatar';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

interface SignUpProps {
  onAuthenticated: () => void;
  onCancel: () => void;
}

type AuthScreen = 'welcome' | 'signup' | 'login' | 'forgot' | 'check-email' | 'reset';

const gradeLevels = ['JSS1', 'JSS2', 'JSS3', 'SS1', 'SS2', 'SS3'];

function getHashParams() {
  if (typeof window === 'undefined') {
    return new URLSearchParams();
  }

  const rawHash = window.location.hash.startsWith('#') ? window.location.hash.slice(1) : window.location.hash;
  return new URLSearchParams(rawHash);
}

function getBackTarget(screen: AuthScreen): AuthScreen | null {
  switch (screen) {
    case 'signup':
    case 'login':
    case 'check-email':
      return 'welcome';
    case 'forgot':
      return 'login';
    case 'reset':
      return 'welcome';
    case 'welcome':
    default:
      return null;
  }
}

export default function SignUp({ onAuthenticated, onCancel }: SignUpProps) {
  const [screen, setScreen] = useState<AuthScreen>('welcome');
  const [fullName, setFullName] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [gradeLevel, setGradeLevel] = useState('SS1');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetPassword, setResetPassword] = useState('');
  const [confirmResetPassword, setConfirmResetPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [infoMessage, setInfoMessage] = useState('');
  const [checkEmailContext, setCheckEmailContext] = useState<'signup' | 'recovery'>('signup');
  const [isRecoveryReady, setIsRecoveryReady] = useState(false);
  const [isGradeLevelOpen, setIsGradeLevelOpen] = useState(false);
  const gradeLevelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent | TouchEvent) {
      if (!gradeLevelRef.current?.contains(event.target as Node)) {
        setIsGradeLevelOpen(false);
      }
    }

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
    };
  }, []);

  useEffect(() => {
    const hashParams = getHashParams();
    if (hashParams.get('type') === 'recovery') {
      setScreen('reset');
    }

    if (!supabase) {
      return;
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setScreen('reset');
        setInfoMessage('Create a strong new password for your scholar account.');
        setErrorMessage('');
        setIsRecoveryReady(true);
      }

      if (event === 'SIGNED_IN') {
        setIsRecoveryReady(true);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!supabase || screen !== 'reset') {
      return;
    }

    let isCancelled = false;

    void supabase.auth.getSession().then(({ data }) => {
      if (!isCancelled) {
        setIsRecoveryReady(Boolean(data.session?.user));
      }
    });

    return () => {
      isCancelled = true;
    };
  }, [screen]);

  const helperCopy = useMemo(() => {
    if (screen === 'signup') {
      return {
        kicker: 'Create a scholar account',
        title: 'Get your profile ready for every quiz season.',
        body: 'Your quiz sessions, results, and leaderboard identity stay safely attached to a real account.',
      };
    }

    if (screen === 'login') {
      return {
        kicker: 'Welcome back',
        title: 'Claim saved guest attempts and continue where you stopped.',
        body: 'Login unlocks protected results, your profile history, and leaderboard sync.',
      };
    }

    if (screen === 'forgot' || screen === 'check-email' || screen === 'reset') {
      return {
        kicker: 'Account recovery',
        title: 'Keep access to your scholar journey secure.',
        body: 'Password recovery is built into the same secure Supabase auth flow powering quiz claims and profile access.',
      };
    }

    return {
      kicker: 'Scholar access',
      title: 'Choose how you want to enter the arena.',
      body: 'Start with a fresh account, sign back in, or recover your access without losing mapped quiz history.',
    };
  }, [screen]);

  function resetFeedback() {
    setErrorMessage('');
    setInfoMessage('');
  }

  function changeScreen(nextScreen: AuthScreen) {
    resetFeedback();
    setIsGradeLevelOpen(false);
    setScreen(nextScreen);
  }

  async function handleCreateAccount(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!supabase || !isSupabaseConfigured) {
      setErrorMessage('Supabase auth is not configured yet. Add your project URL and anon key first.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Password confirmation does not match.');
      return;
    }

    setIsSubmitting(true);
    resetFeedback();

    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          full_name: fullName.trim(),
          school_name: schoolName.trim(),
          grade_level: gradeLevel,
        },
        emailRedirectTo: typeof window !== 'undefined' ? window.location.origin : undefined,
      },
    });

    if (error) {
      setErrorMessage(error.message);
      setIsSubmitting(false);
      return;
    }

    if (data.session?.user) {
      setIsSubmitting(false);
      onAuthenticated();
      return;
    }

    setCheckEmailContext('signup');
    setInfoMessage(`We sent a confirmation link to ${email.trim()}. Confirm your email, then log in to continue.`);
    setPassword('');
    setConfirmPassword('');
    setIsSubmitting(false);
    setScreen('check-email');
  }

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!supabase || !isSupabaseConfigured) {
      setErrorMessage('Supabase auth is not configured yet. Add your project URL and anon key first.');
      return;
    }

    setIsSubmitting(true);
    resetFeedback();

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      setErrorMessage(error.message);
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(false);
    onAuthenticated();
  }

  async function handleForgotPassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!supabase || !isSupabaseConfigured) {
      setErrorMessage('Supabase auth is not configured yet. Add your project URL and anon key first.');
      return;
    }

    setIsSubmitting(true);
    resetFeedback();

    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: typeof window !== 'undefined' ? window.location.origin : undefined,
    });

    if (error) {
      setErrorMessage(error.message);
      setIsSubmitting(false);
      return;
    }

    setCheckEmailContext('recovery');
    setInfoMessage(`A recovery link has been sent to ${email.trim()}. Open it to set a new password.`);
    setIsSubmitting(false);
    setScreen('check-email');
  }

  async function handleResetPassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!supabase || !isSupabaseConfigured) {
      setErrorMessage('Supabase auth is not configured yet. Add your project URL and anon key first.');
      return;
    }

    if (!isRecoveryReady) {
      setErrorMessage('Open the password recovery link from your email first so this reset screen can verify your session.');
      return;
    }

    if (resetPassword !== confirmResetPassword) {
      setErrorMessage('New password confirmation does not match.');
      return;
    }

    setIsSubmitting(true);
    resetFeedback();

    const { error } = await supabase.auth.updateUser({
      password: resetPassword,
    });

    if (error) {
      setErrorMessage(error.message);
      setIsSubmitting(false);
      return;
    }

    setInfoMessage('Password updated successfully. You can continue into your account now.');
    setIsSubmitting(false);
    onAuthenticated();
  }

  function renderWelcomeScreen() {
    return (
      <div className="space-y-5">
        <button
          type="button"
          onClick={() => changeScreen('signup')}
          className="w-full rounded-[1.75rem] border border-zinc-100 bg-white px-5 py-5 text-left editorial-shadow transition-all hover:-translate-y-0.5 hover:border-primary/20"
        >
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-white">
              <UserPlus size={22} />
            </div>
            <div>
              <h3 className="font-headline text-2xl font-bold text-zinc-900">Create account</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-500">
                Start a full scholar account for quiz history, leaderboard identity, and protected results.
              </p>
            </div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => changeScreen('login')}
          className="w-full rounded-[1.75rem] border border-zinc-100 bg-white px-5 py-5 text-left editorial-shadow transition-all hover:-translate-y-0.5 hover:border-primary/20"
        >
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-zinc-900 text-white">
              <LockKeyhole size={22} />
            </div>
            <div>
              <h3 className="font-headline text-2xl font-bold text-zinc-900">Log in</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-500">
                Return to your saved account, claim guest attempts, and continue from your last verified session.
              </p>
            </div>
          </div>
        </button>
      </div>
    );
  }

  function renderPrimaryFormHeader(title: string, description: string, backTarget: AuthScreen = 'welcome') {
    return (
      <div className="mb-8">
        <h2 className="text-2xl font-bold font-headline text-zinc-900 mb-2">{title}</h2>
        <p className="text-zinc-500">{description}</p>
      </div>
    );
  }

  function renderFeedback() {
    return (
      <>
        {errorMessage ? (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {errorMessage}
          </motion.div>
        ) : null}

        {infoMessage ? (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
          >
            {infoMessage}
          </motion.div>
        ) : null}
      </>
    );
  }

  function renderSubmitButton(label: string) {
    return (
      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex w-full items-center justify-center gap-2 bg-primary hover:bg-primary-container disabled:cursor-not-allowed disabled:opacity-70 text-white font-bold py-4 rounded-lg transition-all editorial-shadow"
      >
        {isSubmitting ? <LoaderCircle size={18} className="animate-spin" /> : null}
        {label}
      </button>
    );
  }

  function renderSignupScreen() {
    return (
      <>
        {renderPrimaryFormHeader(
          'Create your account',
          'Create a real account so quiz attempts can sync to your profile and leaderboard standing.',
        )}
        <form className="space-y-5" onSubmit={handleCreateAccount}>
          <div>
            <label className="block font-label text-[10px] uppercase tracking-widest font-bold text-primary mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              placeholder="Chidi Adekunle"
              required
              className="w-full px-4 py-4 bg-zinc-50 border-none rounded-lg focus:ring-2 focus:ring-primary/20 transition-all outline-none"
            />
          </div>

          <div>
            <label className="block font-label text-[10px] uppercase tracking-widest font-bold text-primary mb-2">
              School Name
            </label>
            <input
              type="text"
              value={schoolName}
              onChange={(event) => setSchoolName(event.target.value)}
              placeholder="Olashore International School"
              required
              className="w-full px-4 py-4 bg-zinc-50 border-none rounded-lg focus:ring-2 focus:ring-primary/20 transition-all outline-none"
            />
          </div>

          <div>
            <label className="block font-label text-[10px] uppercase tracking-widest font-bold text-primary mb-2">
              Grade Level
            </label>
            <div ref={gradeLevelRef} className="relative">
              <button
                type="button"
                onClick={() => setIsGradeLevelOpen((prev) => !prev)}
                className={`flex w-full items-center justify-between gap-3 rounded-lg bg-zinc-50 px-4 py-4 text-left transition-all outline-none ${
                  isGradeLevelOpen ? 'ring-2 ring-primary/20' : ''
                }`}
                aria-expanded={isGradeLevelOpen}
                aria-haspopup="listbox"
              >
                <span className="text-zinc-900">{gradeLevel}</span>
                <ChevronDown
                  size={18}
                  className={`shrink-0 text-zinc-400 transition-transform ${isGradeLevelOpen ? 'rotate-180' : ''}`}
                />
              </button>

              <AnimatePresence>
                {isGradeLevelOpen ? (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.18 }}
                    className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-30 overflow-hidden rounded-[1.25rem] border border-zinc-100 bg-white editorial-shadow"
                    role="listbox"
                    aria-label="Grade level"
                  >
                    <div className="max-h-64 overflow-y-auto py-2">
                      {gradeLevels.map((level) => (
                        <button
                          key={level}
                          type="button"
                          onClick={() => {
                            setGradeLevel(level);
                            setIsGradeLevelOpen(false);
                          }}
                          className={`flex w-full items-center px-4 py-3 text-left text-sm transition-colors ${
                            level === gradeLevel ? 'bg-primary/8 font-bold text-primary' : 'text-zinc-700 hover:bg-zinc-50'
                          }`}
                          role="option"
                          aria-selected={level === gradeLevel}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          </div>

          <div>
            <label className="block font-label text-[10px] uppercase tracking-widest font-bold text-primary mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="scholar@example.com"
              required
              className="w-full px-4 py-4 bg-zinc-50 border-none rounded-lg focus:ring-2 focus:ring-primary/20 transition-all outline-none"
            />
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className="block font-label text-[10px] uppercase tracking-widest font-bold text-primary mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
                minLength={8}
                required
                className="w-full px-4 py-4 bg-zinc-50 border-none rounded-lg focus:ring-2 focus:ring-primary/20 transition-all outline-none"
              />
            </div>

            <div>
              <label className="block font-label text-[10px] uppercase tracking-widest font-bold text-primary mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="••••••••"
                minLength={8}
                required
                className="w-full px-4 py-4 bg-zinc-50 border-none rounded-lg focus:ring-2 focus:ring-primary/20 transition-all outline-none"
              />
            </div>
          </div>

          {renderFeedback()}
          {renderSubmitButton('Create Account')}
        </form>

        <p className="mt-8 text-center text-zinc-500 text-sm">
          Already an elite member?{' '}
          <button type="button" onClick={() => changeScreen('login')} className="text-primary font-bold hover:underline">
            Log in here
          </button>
        </p>
      </>
    );
  }

  function renderLoginScreen() {
    return (
      <>
        {renderPrimaryFormHeader(
          'Welcome back',
          'Sign in to claim guest quiz attempts and unlock your saved result.',
        )}
        <form className="space-y-5" onSubmit={handleLogin}>
          <div>
            <label className="block font-label text-[10px] uppercase tracking-widest font-bold text-primary mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="scholar@example.com"
              required
              className="w-full px-4 py-4 bg-zinc-50 border-none rounded-lg focus:ring-2 focus:ring-primary/20 transition-all outline-none"
            />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between gap-3">
              <label className="block font-label text-[10px] uppercase tracking-widest font-bold text-primary">
                Password
              </label>
              <button
                type="button"
                onClick={() => changeScreen('forgot')}
                className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 transition-colors hover:text-primary"
              >
                Forgot password
              </button>
            </div>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              minLength={8}
              required
              className="w-full px-4 py-4 bg-zinc-50 border-none rounded-lg focus:ring-2 focus:ring-primary/20 transition-all outline-none"
            />
          </div>

          {renderFeedback()}
          {renderSubmitButton('Log In')}
        </form>

        <p className="mt-8 text-center text-zinc-500 text-sm">
          Need a new account?{' '}
          <button type="button" onClick={() => changeScreen('signup')} className="text-primary font-bold hover:underline">
            Create one here
          </button>
        </p>
        <p className="mt-3 text-center text-zinc-500 text-sm">
          Forgotten password?{' '}
          <button type="button" onClick={() => changeScreen('forgot')} className="text-primary font-bold hover:underline">
            Recover access
          </button>
        </p>
      </>
    );
  }

  function renderForgotScreen() {
    return (
      <>
        {renderPrimaryFormHeader(
          'Recover your password',
          'Enter the email tied to your scholar account and we will send a reset link.',
        )}
        <form className="space-y-5" onSubmit={handleForgotPassword}>
          <div>
            <label className="block font-label text-[10px] uppercase tracking-widest font-bold text-primary mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="scholar@example.com"
              required
              className="w-full px-4 py-4 bg-zinc-50 border-none rounded-lg focus:ring-2 focus:ring-primary/20 transition-all outline-none"
            />
          </div>

          {renderFeedback()}
          {renderSubmitButton('Send Recovery Link')}
        </form>
      </>
    );
  }

  function renderCheckEmailScreen() {
    return (
      <div className="rounded-[2rem] border border-zinc-100 bg-white p-6 editorial-shadow">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
          <Mail size={26} />
        </div>
        <h2 className="mt-6 font-headline text-3xl font-bold text-zinc-900">Check your email</h2>
        <p className="mt-3 text-sm leading-relaxed text-zinc-500">
          {checkEmailContext === 'signup'
            ? 'Your account is almost ready. Confirm your email first, then come back to login and unlock your saved quiz records.'
            : 'Your recovery email is on the way. Open the link from your inbox to return here and create a new password.'}
        </p>
        {renderFeedback()}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => changeScreen(checkEmailContext === 'signup' ? 'login' : 'forgot')}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-primary-container"
          >
            {checkEmailContext === 'signup' ? 'Go To Login' : 'Resend Recovery'}
          </button>
          <button
            type="button"
            onClick={() => changeScreen('welcome')}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-zinc-200 px-5 py-3 text-sm font-bold text-zinc-700 transition-colors hover:border-zinc-300 hover:text-zinc-900"
          >
            Back To Auth Home
          </button>
        </div>
      </div>
    );
  }

  function renderResetScreen() {
    return (
      <>
        {renderPrimaryFormHeader(
          'Set a new password',
          'Finish the recovery flow by choosing a new password for your scholar account.',
        )}
        <form className="space-y-5" onSubmit={handleResetPassword}>
          <div className="rounded-2xl border border-zinc-100 bg-zinc-50 p-4 text-sm text-zinc-600">
            {isRecoveryReady
              ? 'Recovery session verified. You can safely update your password now.'
              : 'Waiting for a verified recovery session from your email link.'}
          </div>

          <div>
            <label className="block font-label text-[10px] uppercase tracking-widest font-bold text-primary mb-2">
              New Password
            </label>
            <input
              type="password"
              value={resetPassword}
              onChange={(event) => setResetPassword(event.target.value)}
              placeholder="••••••••"
              minLength={8}
              required
              className="w-full px-4 py-4 bg-zinc-50 border-none rounded-lg focus:ring-2 focus:ring-primary/20 transition-all outline-none"
            />
          </div>

          <div>
            <label className="block font-label text-[10px] uppercase tracking-widest font-bold text-primary mb-2">
              Confirm New Password
            </label>
            <input
              type="password"
              value={confirmResetPassword}
              onChange={(event) => setConfirmResetPassword(event.target.value)}
              placeholder="••••••••"
              minLength={8}
              required
              className="w-full px-4 py-4 bg-zinc-50 border-none rounded-lg focus:ring-2 focus:ring-primary/20 transition-all outline-none"
            />
          </div>

          {renderFeedback()}
          {renderSubmitButton('Update Password')}
        </form>
      </>
    );
  }

  return (
    <div className="min-h-screen flex font-sans bg-zinc-50">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-primary">
        <img
          src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop"
          alt="Digital Scholar"
          className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/70 to-primary-container/60" />

        <div className="relative z-10 flex h-full flex-col justify-between p-16 text-white">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex w-fit items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-widest transition-colors hover:bg-white/20"
          >
            <ArrowLeft size={16} />
            Back
          </button>

          <div>
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.25em]">
              <ShieldCheck size={14} />
              {helperCopy.kicker}
            </div>
            <h2 className="text-4xl font-bold font-headline mb-4 leading-tight">{helperCopy.title}</h2>
            <p className="text-xl text-white/80 mb-12 max-w-xl">{helperCopy.body}</p>

            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { label: 'Stored quiz sessions', value: 'Guest + account safe' },
                { label: 'Recovery flow', value: 'Email-based reset' },
                { label: 'Leaderboard identity', value: 'Claimed on login' },
              ].map((item) => (
                <div key={item.label} className="rounded-[1.5rem] border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60">{item.label}</p>
                  <p className="mt-2 text-sm font-semibold text-white">{item.value}</p>
                </div>
              ))}
            </div>

            <div className="mt-10 flex items-center gap-4">
              <div className="flex -space-x-2">
                {[
                  { name: 'Chidi Adekunle', variant: 'emerald' as const },
                  { name: 'Zainab Bello', variant: 'coral' as const },
                  { name: 'Tolu Akinola', variant: 'blue' as const },
                ].map((person) => (
                  <Avatar
                    key={person.name}
                    name={person.name}
                    variant={person.variant}
                    className="w-10 h-10 rounded-full border-2 border-white text-xs"
                  />
                ))}
                <div className="w-10 h-10 rounded-full border-2 border-white bg-primary-container flex items-center justify-center text-[10px] font-bold">
                  500+
                </div>
              </div>
              <span className="font-label text-xs uppercase tracking-widest font-bold">
                Quiz Records Preserved
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 bg-white flex flex-col justify-start lg:justify-center px-4 sm:px-8 md:px-24 pt-6 pb-8 sm:py-12">
        <div className="max-w-lg w-full mx-auto">
          <div className="mb-9 sm:mb-12">
            {screen === 'welcome' ? (
              <button
                type="button"
                onClick={onCancel}
                className="mb-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-400 transition-colors hover:text-primary lg:hidden"
              >
                <ArrowLeft size={16} />
                Back
              </button>
            ) : getBackTarget(screen) ? (
              <button
                type="button"
                onClick={() => changeScreen(getBackTarget(screen) as AuthScreen)}
                className="mb-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-400 transition-colors hover:text-primary lg:hidden"
              >
                <ArrowLeft size={16} />
                Back
              </button>
            ) : null}
            <h1 className="text-primary font-bold italic tracking-tighter text-xl mb-1">THE DIGITAL SCHOLAR</h1>
            <p className="text-zinc-400 font-label text-[10px] uppercase tracking-[0.2em]">
              Nigeria&apos;s Academic Frontier
            </p>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={screen}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.22 }}
            >
              {screen === 'welcome' ? renderWelcomeScreen() : null}
              {screen === 'signup' ? renderSignupScreen() : null}
              {screen === 'login' ? renderLoginScreen() : null}
              {screen === 'forgot' ? renderForgotScreen() : null}
              {screen === 'check-email' ? renderCheckEmailScreen() : null}
              {screen === 'reset' ? renderResetScreen() : null}
            </motion.div>
          </AnimatePresence>

          <div className="mt-12 rounded-[1.75rem] border border-zinc-100 bg-zinc-50 px-5 py-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">Auth coverage</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {[
                'Welcome',
                'Sign up',
                'Log in',
                'Forgot password',
                'Check email',
                'Reset password',
              ].map((item) => (
                <span
                  key={item}
                  className="rounded-full bg-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-zinc-500 shadow-sm"
                >
                  {item}
                </span>
              ))}
            </div>
            {screen === 'reset' ? (
              <div className="mt-4 flex items-start gap-2 text-sm text-zinc-500">
                <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-primary" />
                <p>
                  Recovery links from Supabase will reopen this auth suite and land the user directly inside the password reset flow.
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
