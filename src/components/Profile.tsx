import { motion, AnimatePresence } from 'motion/react';
import {
  User,
  Settings,
  Shield,
  Bell,
  Camera,
  Mail,
  GraduationCap,
  Code2,
  LogOut,
  ChevronRight,
  Smartphone,
  Globe,
  Eye,
  Trash2,
  LoaderCircle,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useEffect, useMemo, useState, ReactNode } from 'react';
import Avatar from './Avatar';
import { supabase } from '../lib/supabase';
import {
  formatAttemptTimestamp,
  getScholarIdentity,
  derivePerformance,
  type AuthUser,
  type QuizAttempt,
} from '../lib/scholar';

export default function Profile({
  user,
  attemptsOverride,
  isLoadingAttemptsOverride,
  onSignOut,
}: {
  user: AuthUser;
  attemptsOverride?: QuizAttempt[];
  isLoadingAttemptsOverride?: boolean;
  onSignOut: () => Promise<void> | void;
}) {
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'settings' | 'security' | 'notifications'>('overview');
  const [settings, setSettings] = useState({
    publicProfile: true,
    twoFactor: false,
    upcomingQuizzes: true,
    quizResults: true,
    securityAlerts: true,
    productUpdates: false,
  });
  const [attempts, setAttempts] = useState<QuizAttempt[]>(attemptsOverride ?? []);
  const [isLoadingAttempts, setIsLoadingAttempts] = useState(
    typeof isLoadingAttemptsOverride === 'boolean' ? isLoadingAttemptsOverride : Boolean(user),
  );

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  useEffect(() => {
    if (attemptsOverride) {
      setAttempts(attemptsOverride);
    }
  }, [attemptsOverride]);

  useEffect(() => {
    if (typeof isLoadingAttemptsOverride === 'boolean') {
      setIsLoadingAttempts(isLoadingAttemptsOverride);
    }
  }, [isLoadingAttemptsOverride]);

  useEffect(() => {
    if (attemptsOverride || typeof isLoadingAttemptsOverride === 'boolean') {
      return;
    }

    if (!user || !supabase) {
      setAttempts([]);
      setIsLoadingAttempts(false);
      return;
    }

    let isCancelled = false;

    async function loadAttempts() {
      setIsLoadingAttempts(true);

      const { data, error } = await supabase.rpc('get_my_quiz_attempts');

      if (!isCancelled) {
        if (!error && Array.isArray(data)) {
          setAttempts(
            data.map((attempt) => ({
              session_token: String((attempt as QuizAttempt).session_token),
              score: Number((attempt as QuizAttempt).score ?? 0),
              total_questions: Number((attempt as QuizAttempt).total_questions ?? 0),
              answered_questions: Number((attempt as QuizAttempt).answered_questions ?? 0),
              completed_at: String((attempt as QuizAttempt).completed_at ?? ''),
              auto_submitted: Boolean((attempt as QuizAttempt).auto_submitted),
            })),
          );
        } else {
          setAttempts([]);
        }

        setIsLoadingAttempts(false);
      }
    }

    void loadAttempts();

    return () => {
      isCancelled = true;
    };
  }, [isLoadingAttemptsOverride, attemptsOverride, user]);

  const { fullName, schoolName, gradeLevel } = useMemo(() => getScholarIdentity(user), [user]);
  const { completedCount, averageAccuracy, bestScore, latestAttemptAt } = useMemo(
    () => derivePerformance(attempts),
    [attempts],
  );
  const latestAttempt = formatAttemptTimestamp(latestAttemptAt);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ];

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <div className="rounded-[2rem] border border-zinc-200 bg-white p-8 editorial-shadow">
          <h1 className="font-headline text-3xl font-bold text-zinc-900">Profile unavailable</h1>
          <p className="mt-3 text-secondary">
            Sign in first so your quiz attempts, leaderboard standing, and scholar profile can load.
          </p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-5xl mx-auto px-4 sm:px-6 py-8 md:py-12"
    >
      <div className="relative mb-12">
        <div className="h-36 sm:h-48 w-full bg-gradient-to-r from-primary to-primary-container rounded-[2rem] overflow-hidden relative">
          <img
            src="https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2029&auto=format&fit=crop"
            className="w-full h-full object-cover opacity-30 mix-blend-overlay"
            alt="Cover"
          />
          <button className="absolute bottom-4 right-4 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white p-2 rounded-full transition-all">
            <Camera size={20} />
          </button>
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-end gap-4 sm:gap-6 px-4 sm:px-8 -mt-12 sm:-mt-16 relative z-10">
          <div className="relative">
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-[2rem] border-4 border-white overflow-hidden bg-zinc-100 editorial-shadow">
              <Avatar name={fullName} variant="coral" className="w-full h-full rounded-[2rem] text-4xl" />
            </div>
            <button className="absolute bottom-2 right-2 bg-primary text-white p-2 rounded-xl border-2 border-white shadow-lg hover:scale-110 transition-all">
              <Camera size={16} />
            </button>
          </div>

          <div className="flex-grow pt-2 sm:pt-3 md:pt-0 pb-2 md:pb-4 min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold font-headline text-zinc-900">{fullName}</h1>
            <p className="text-zinc-500 font-medium">
              {schoolName} • {gradeLevel}
            </p>
          </div>

          <div className="pb-0 md:pb-4 w-full md:w-auto">
            <button
              type="button"
              onClick={() => void onSignOut()}
              className="w-full md:w-auto bg-zinc-900 text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-zinc-800 transition-all flex items-center justify-center gap-2"
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      <div className="flex gap-2 bg-zinc-100 p-1.5 rounded-2xl mb-12 w-full overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id as 'overview' | 'settings' | 'security' | 'notifications')}
            className={`shrink-0 flex items-center gap-2 px-4 sm:px-6 py-3 rounded-xl text-sm font-bold transition-all ${
              activeSubTab === tab.id ? 'bg-white text-primary shadow-sm' : 'text-zinc-500 hover:text-zinc-700'
            }`}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeSubTab === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <div className="md:col-span-2 space-y-8">
              <div className="bg-white p-8 rounded-[2rem] editorial-shadow border border-zinc-50">
                <h3 className="text-xl font-bold mb-6">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InfoItem icon={User} label="Full Name" value={fullName} />
                  <InfoItem icon={Mail} label="Email Address" value={user.email ?? 'No email on file'} />
                  <InfoItem icon={GraduationCap} label="School Name" value={schoolName} />
                  <InfoItem icon={Code2} label="Grade Level" value={gradeLevel} />
                </div>
              </div>

              <div className="bg-white p-8 rounded-[2rem] editorial-shadow border border-zinc-50">
                <h3 className="text-xl font-bold mb-6">Quiz Performance</h3>
                {isLoadingAttempts ? (
                  <div className="flex items-center gap-3 text-zinc-500">
                    <LoaderCircle size={18} className="animate-spin text-primary" />
                    <span className="text-sm">Loading your claimed quiz history...</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InfoItem icon={Shield} label="Submitted Attempts" value={String(completedCount)} />
                    <InfoItem icon={Eye} label="Average Accuracy" value={`${averageAccuracy}%`} />
                    <InfoItem icon={Smartphone} label="Best Score" value={`${bestScore}/50`} />
                    <InfoItem icon={Bell} label="Latest Attempt" value={latestAttempt} />
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-8">
              <div className="bg-primary p-8 rounded-[2rem] text-white editorial-shadow">
                <h3 className="font-bold mb-4">Account Status</h3>
                <p className="text-white/70 text-sm mb-6">
                  Your authenticated scholar account is now eligible to claim guest quiz attempts and appear on the public leaderboard.
                </p>
                <button className="w-full bg-white text-primary py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-zinc-50 transition-all">
                  Account Active
                </button>
              </div>

              <div className="bg-zinc-900 p-8 rounded-[2rem] text-white editorial-shadow">
                <h3 className="font-bold mb-4">Quick Stats</h3>
                <div className="space-y-4">
                  <StatItem label="Quizzes Completed" value={String(completedCount)} />
                  <StatItem label="Avg. Accuracy" value={`${averageAccuracy}%`} />
                  <StatItem label="Best Score" value={`${bestScore}/50`} />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeSubTab === 'settings' && (
          <motion.div
            key="settings"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white p-6 sm:p-10 rounded-[2rem] editorial-shadow border border-zinc-50 space-y-10"
          >
            <h3 className="text-2xl font-bold">General Settings</h3>

            <div className="space-y-6">
              <SettingToggle
                icon={Eye}
                title="Public Profile"
                desc="Allow your leaderboard identity and school to be visible."
                enabled={settings.publicProfile}
                onToggle={() => toggleSetting('publicProfile')}
              />
              <SettingToggle icon={Globe} title="Language" desc="English (UK)" isSelect />
              <SettingToggle
                icon={Smartphone}
                title="Two-Factor Authentication"
                desc="Turn this on inside Supabase auth providers when you are ready."
                enabled={settings.twoFactor}
                onToggle={() => toggleSetting('twoFactor')}
              />
            </div>

            <div className="pt-10 border-t border-zinc-100">
              <h4 className="text-red-500 font-bold mb-4">Danger Zone</h4>
              <p className="text-zinc-500 text-sm mb-6">
                Profile edits are metadata-backed. Account deletion should be handled from your auth provider once enabled.
              </p>
              <button className="flex items-center gap-2 text-red-500 font-bold hover:bg-red-50 px-4 py-2 rounded-lg transition-all">
                <Trash2 size={18} />
                Delete Account
              </button>
            </div>
          </motion.div>
        )}

        {activeSubTab === 'security' && (
          <motion.div
            key="security"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white p-6 sm:p-10 rounded-[2rem] editorial-shadow border border-zinc-50 space-y-10"
          >
            <h3 className="text-2xl font-bold">Security & Privacy</h3>

            <form className="space-y-6 max-w-md" onSubmit={(event) => event.preventDefault()}>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={user.email ?? ''}
                  disabled
                  className="w-full px-4 py-3 bg-zinc-50 border-none rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value="********"
                  disabled
                  className="w-full px-4 py-3 bg-zinc-50 border-none rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>
              <button className="bg-primary text-white px-8 py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-primary-container transition-all">
                Managed By Supabase Auth
              </button>
            </form>

            <div className="pt-10 border-t border-zinc-100">
              <h4 className="font-bold mb-6 flex items-center gap-2">
                <Smartphone size={20} className="text-primary" />
                Active Sessions
              </h4>
              <div className="space-y-4">
                <SessionItem device="Current Browser Session" location="Authenticated" time="Active Now" />
              </div>
            </div>
          </motion.div>
        )}

        {activeSubTab === 'notifications' && (
          <motion.div
            key="notifications"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white p-6 sm:p-10 rounded-[2rem] editorial-shadow border border-zinc-50 space-y-10"
          >
            <h3 className="text-2xl font-bold">Notification Preferences</h3>

            <div className="space-y-8">
              <NotificationGroup title="Quiz Alerts">
                <SettingToggle
                  title="Upcoming Quizzes"
                  desc="Get notified when a new quiz is about to start."
                  enabled={settings.upcomingQuizzes}
                  onToggle={() => toggleSetting('upcomingQuizzes')}
                />
                <SettingToggle
                  title="Quiz Results"
                  desc="Receive your performance report after your attempt is attached to your account."
                  enabled={settings.quizResults}
                  onToggle={() => toggleSetting('quizResults')}
                />
              </NotificationGroup>

              <NotificationGroup title="Account Activity">
                <SettingToggle
                  title="Security Alerts"
                  desc="Get notified of new logins or security changes."
                  enabled={settings.securityAlerts}
                  onToggle={() => toggleSetting('securityAlerts')}
                />
                <SettingToggle
                  title="Product Updates"
                  desc="Stay informed about new features and resources."
                  enabled={settings.productUpdates}
                  onToggle={() => toggleSetting('productUpdates')}
                />
              </NotificationGroup>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function InfoItem({ icon: Icon, label, value }: { icon: LucideIcon, label: string, value: string }) {
  return (
    <div className="flex items-start gap-4 min-w-0">
      <div className="w-10 h-10 rounded-xl bg-zinc-50 flex items-center justify-center text-zinc-400">
        <Icon size={20} />
      </div>
      <div className="min-w-0">
        <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 block mb-1">{label}</span>
        <span className="font-bold text-zinc-900 break-words">{value}</span>
      </div>
    </div>
  );
}

function StatItem({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-white/60 text-sm">{label}</span>
      <span className="font-bold">{value}</span>
    </div>
  );
}

function SettingToggle({
  icon: Icon,
  title,
  desc,
  enabled,
  isSelect,
  onToggle,
}: {
  icon?: LucideIcon,
  title: string,
  desc: string,
  enabled?: boolean,
  isSelect?: boolean,
  onToggle?: () => void,
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 group">
      <div className="flex items-center gap-4 min-w-0">
        {Icon ? (
          <div className="w-10 h-10 rounded-xl bg-zinc-50 flex items-center justify-center text-zinc-400 group-hover:bg-primary/5 group-hover:text-primary transition-all">
            <Icon size={20} />
          </div>
        ) : null}
        <div className="min-w-0">
          <h4 className="font-bold text-zinc-900">{title}</h4>
          <p className="text-sm text-zinc-500">{desc}</p>
        </div>
      </div>
      {isSelect ? (
        <button className="self-start sm:self-auto flex items-center gap-2 text-zinc-400 font-bold text-xs uppercase tracking-widest hover:text-primary transition-all">
          Edit <ChevronRight size={16} />
        </button>
      ) : (
        <button
          type="button"
          onClick={onToggle}
          className={`self-start sm:self-auto w-12 h-6 rounded-full relative transition-all ${enabled ? 'bg-primary' : 'bg-zinc-200'}`}
        >
          <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${enabled ? 'right-1' : 'left-1'}`} />
        </button>
      )}
    </div>
  );
}

function SessionItem({ device, location, time }: { device: string, location: string, time: string }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-zinc-50">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-zinc-400">
          <Smartphone size={20} />
        </div>
        <div>
          <h5 className="font-bold text-sm text-zinc-900">{device}</h5>
          <p className="text-xs text-zinc-500">{location}</p>
        </div>
      </div>
      <span className={`text-[10px] font-bold uppercase tracking-widest ${time === 'Active Now' ? 'text-green-500' : 'text-zinc-400'}`}>
        {time}
      </span>
    </div>
  );
}

function NotificationGroup({ title, children }: { title: string, children: ReactNode }) {
  return (
    <div className="space-y-4">
      <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">{title}</h4>
      <div className="space-y-4">{children}</div>
    </div>
  );
}
