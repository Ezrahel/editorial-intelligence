import { BarChart3, BookOpen, Brain, ChevronRight, Flame, HelpCircle, LayoutGrid, LoaderCircle, Settings, Trophy, Zap } from 'lucide-react';
import Avatar from './Avatar';
import {
  buildScholarInsights,
  formatAttemptDate,
  type AuthUser,
  type LeaderboardEntry,
  type QuizAttempt,
} from '../lib/scholar';

export default function AcademicPulse({
  user,
  attempts,
  leaderboardEntries,
  isLoading,
}: {
  user: AuthUser;
  attempts: QuizAttempt[];
  leaderboardEntries: LeaderboardEntry[];
  isLoading: boolean;
}) {
  const insights = buildScholarInsights(user, attempts, leaderboardEntries);
  const progressBars = [
    { label: 'Accuracy growth', value: Math.max(12, insights.averageAccuracy), color: 'bg-primary' },
    { label: 'Quiz consistency', value: Math.max(8, Math.min(100, insights.completedCount * 14)), color: 'bg-blue-400' },
  ];
  const weeklyPerformance = [
    { day: 'MON', val: Math.max(10, insights.averageAccuracy - 24) },
    { day: 'TUE', val: Math.max(16, insights.averageAccuracy - 10) },
    { day: 'WED', val: Math.max(12, insights.averageAccuracy - 18) },
    { day: 'THU', val: Math.max(18, insights.averageAccuracy), active: true },
    { day: 'FRI', val: Math.max(10, insights.averageAccuracy - 28) },
    { day: 'SAT', val: Math.max(14, insights.averageAccuracy - 8) },
    { day: 'SUN', val: Math.max(12, insights.averageAccuracy - 16) },
  ];

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-zinc-50 font-sans overflow-x-hidden">
      <aside className="hidden xl:flex flex-col w-64 bg-white border-r border-zinc-100 p-6 sticky top-16 h-[calc(100vh-64px)]">
        <div className="flex items-center gap-3 mb-10 p-2 min-w-0">
          <Avatar name={insights.fullName} variant="amber" className="w-10 h-10 rounded-lg shrink-0" />
          <div className="min-w-0">
            <div className="text-primary font-bold text-xl tracking-tighter truncate">{insights.firstName}</div>
            <div className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold truncate">{insights.stageLabel}</div>
          </div>
        </div>

        <nav className="flex-grow space-y-2">
          {[
            { icon: LayoutGrid, label: 'Overview', active: true },
            { icon: BookOpen, label: 'My Quizzes' },
            { icon: BarChart3, label: 'Performance' },
            { icon: BookOpen, label: 'Resources' },
            { icon: Settings, label: 'Settings' },
          ].map((item) => (
            <button
              key={item.label}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-bold transition-all ${item.active ? 'bg-primary/5 text-primary' : 'text-zinc-500 hover:bg-zinc-50'}`}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="mt-auto space-y-4">
          <div className="bg-primary p-6 rounded-2xl text-white">
            <span className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-1 block">Status</span>
            <h4 className="font-bold text-sm mb-3">{insights.stageLabel}</h4>
            <button className="w-full bg-white/20 hover:bg-white/30 text-white py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all">
              Upgrade Profile
            </button>
          </div>
          <button className="w-full flex items-center gap-4 px-4 py-3 text-zinc-500 text-sm font-bold hover:bg-zinc-50 rounded-xl transition-all">
            <HelpCircle size={18} />
            Help Center
          </button>
        </div>
      </aside>

      <main className="flex-grow min-w-0 p-4 sm:p-6 lg:p-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6 mb-12">
            <div className="min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary mb-2 block">Student Dashboard</span>
              <h1 className="text-4xl sm:text-5xl font-bold font-headline text-zinc-900 tracking-tighter">Academic Pulse</h1>
              <p className="mt-3 text-sm text-zinc-500 max-w-xl">
                Live progress for {insights.fullName}, tailored to {insights.gradeLevel} and current claimed quiz performance.
              </p>
            </div>
            <div className="flex items-center gap-3 sm:gap-4 self-stretch sm:self-auto">
              <div className="text-left sm:text-right">
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 block">Global Rank</span>
                <span className="text-2xl font-black text-primary">{insights.rank ? `#${insights.rank}` : 'Unranked'}</span>
              </div>
              <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-white shadow-sm">
                <Avatar name={insights.fullName} variant="amber" className="w-full h-full rounded-xl" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
            <div className="lg:col-span-8 bg-white p-6 sm:p-8 lg:p-10 rounded-[2.5rem] editorial-shadow relative overflow-hidden">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-10">
                <div className="min-w-0">
                  <h3 className="text-2xl font-bold text-zinc-900 mb-2">Weekly Goal Progress</h3>
                  <p className="text-zinc-500 text-sm max-w-sm">
                    {insights.firstName} has completed {insights.weeklyGoalCompleted} of {insights.weeklyGoalTarget} recommended study and quiz tasks this cycle.
                  </p>
                </div>
                <div className="bg-blue-50 px-6 py-4 rounded-2xl text-center shrink-0">
                  <span className="text-xl font-black text-primary block">
                    {insights.weeklyGoalCompleted}/{insights.weeklyGoalTarget}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-primary/60">Tasks</span>
                </div>
              </div>

              <div className="space-y-8">
                {progressBars.map((bar) => (
                  <div key={bar.label}>
                    <div className="flex justify-between items-center mb-3 gap-3">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-900">{bar.label}</span>
                      <span className="text-xs font-bold text-zinc-400">{bar.value}%</span>
                    </div>
                    <div className="w-full bg-zinc-100 h-2 rounded-full">
                      <div className={`${bar.color} h-full rounded-full`} style={{ width: `${bar.value}%` }} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="absolute top-0 left-0 w-1.5 h-full bg-primary" />
            </div>

            <div className="lg:col-span-4 bg-primary p-6 sm:p-8 lg:p-10 rounded-[2.5rem] text-white editorial-shadow flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-8 block">Upcoming Round</span>
                <h3 className="text-3xl font-bold font-headline leading-tight mb-2">{insights.upcomingRound}</h3>
                <p className="text-white/60 text-sm">Recommended next milestone for {insights.firstName}</p>
              </div>
              <button className="w-full bg-white text-primary py-4 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-zinc-50 transition-all mt-8">
                Pre-register Now
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 bg-zinc-100/50 p-6 sm:p-8 lg:p-10 rounded-[2.5rem]">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-12">
                <h3 className="text-xl font-bold text-zinc-900">Performance History</h3>
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                  Last 30 Days
                  <ChevronRight size={14} className="rotate-90" />
                </div>
              </div>

              {isLoading ? (
                <div className="flex items-center gap-3 text-zinc-500">
                  <LoaderCircle size={18} className="animate-spin text-primary" />
                  <span className="text-sm">Refreshing your academic pulse...</span>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <div className="flex min-w-[340px] items-end justify-between h-40 sm:h-48 px-1 sm:px-4 gap-2">
                    {weeklyPerformance.map((bar) => (
                      <div key={bar.day} className="flex flex-col items-center gap-3 sm:gap-4 flex-1 min-w-0">
                        <div
                          className={`w-full max-w-[28px] sm:max-w-[40px] rounded-lg transition-all duration-500 ${bar.active ? 'bg-primary' : 'bg-zinc-200'}`}
                          style={{ height: `${Math.min(100, bar.val)}%` }}
                        />
                        <span className="text-[10px] font-bold text-zinc-400">{bar.day}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="lg:col-span-4 bg-white p-6 sm:p-8 lg:p-10 rounded-[2.5rem] border border-zinc-100">
              <h3 className="text-xl font-bold text-zinc-900 mb-8">Achievements</h3>
              <div className="grid grid-cols-2 gap-4 mb-10">
                {[
                  { icon: Trophy, label: insights.stageLabel, sub: insights.rank ? `RANK #${insights.rank}` : 'IN PROGRESS', color: 'bg-blue-50 text-blue-600' },
                  { icon: Zap, label: `${insights.averageAccuracy}% Accuracy`, sub: 'LIVE', color: 'bg-indigo-50 text-indigo-600' },
                  { icon: Flame, label: `${insights.completedCount} Claimed`, sub: 'QUIZZES', color: 'bg-orange-50 text-orange-600' },
                  { icon: Brain, label: insights.recommendedFocus, sub: 'FOCUS', color: 'bg-zinc-50 text-zinc-500' },
                ].map((ach) => (
                  <div key={ach.label} className="p-4 rounded-2xl bg-zinc-50 flex flex-col items-center text-center">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${ach.color}`}>
                      <ach.icon size={20} />
                    </div>
                    <h4 className="text-[10px] font-bold text-zinc-900 leading-tight break-words">{ach.label}</h4>
                    <p className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest mt-1">{ach.sub}</p>
                  </div>
                ))}
              </div>

              <div className="rounded-2xl bg-zinc-50 p-4 text-sm text-zinc-500">
                Latest activity: {formatAttemptDate(insights.latestAttemptAt)}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
