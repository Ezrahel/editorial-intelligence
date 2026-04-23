import { motion } from 'motion/react';
import { Calendar, Download, LoaderCircle, ShieldCheck, Trophy } from 'lucide-react';
import Avatar from './Avatar';
import {
  buildScholarInsights,
  formatAttemptDate,
  type AuthUser,
  type LeaderboardEntry,
  type QuizAttempt,
} from '../lib/scholar';

export default function Dashboard({
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
  const recentAttempts = attempts.slice(0, 3);
  const activeQuizLabel = insights.completedCount > 0 ? 'Continue Building Your Edge' : 'Start Your First Attempt';
  const activeQuizDescription =
    insights.completedCount > 0
      ? `${insights.firstName}, your current profile is tracking ${insights.completedCount} claimed quiz session${insights.completedCount === 1 ? '' : 's'}.`
      : 'Your dashboard becomes fully personalized as soon as you complete and claim a quiz session.';

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12">
      <div className="flex flex-col lg:flex-row justify-between items-start gap-8 mb-12">
        <div className="min-w-0">
          <span className="font-label text-[10px] uppercase tracking-[0.2em] text-primary font-bold mb-4 block">Academic Dashboard</span>
          <h1 className="font-headline text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter text-zinc-900">
            {insights.firstName}'s <br />
            <span className="text-primary">Pursuits.</span>
          </h1>
          <p className="mt-4 max-w-xl text-sm sm:text-base text-zinc-500">
            {insights.schoolName} • {insights.gradeLevel} • {insights.stageLabel}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full lg:w-auto lg:min-w-[26rem]">
          <div className="bg-zinc-100 p-6 rounded-2xl flex flex-col justify-center min-w-0">
            <span className="text-[10px] font-label uppercase tracking-widest text-zinc-400 mb-1">Global Rank</span>
            <span className="text-3xl font-black text-zinc-900">{insights.rank ? `#${insights.rank}` : 'Unranked'}</span>
          </div>
          <div className="bg-zinc-100 p-6 rounded-2xl flex flex-col justify-center min-w-0">
            <span className="text-[10px] font-label uppercase tracking-widest text-zinc-400 mb-1">School Profile</span>
            <span className="text-xl sm:text-2xl font-black text-zinc-900 break-words">{insights.schoolName}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        <div className="lg:col-span-8 space-y-12 min-w-0">
          <section>
            <div className="flex items-center justify-between gap-4 mb-8">
              <h2 className="text-2xl font-bold font-headline">Active Quizzes</h2>
              <div className="h-[1px] flex-grow bg-zinc-100" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 sm:p-8 rounded-[2rem] editorial-shadow border border-zinc-50 flex flex-col justify-between h-full">
                <div>
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 mb-6">
                    <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                      {insights.completedCount > 0 ? 'Personalized' : 'Ready'}
                    </span>
                    <span className="text-primary font-bold text-xs">{insights.recommendedFocus}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-3">{activeQuizLabel}</h3>
                  <p className="text-zinc-500 text-sm mb-8">{activeQuizDescription}</p>
                </div>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex -space-x-2">
                    <Avatar name={insights.fullName} variant="blue" className="w-8 h-8 rounded-full border-2 border-white text-[10px]" />
                    <Avatar name={insights.schoolName} variant="amber" className="w-8 h-8 rounded-full border-2 border-white text-[10px]" />
                  </div>
                  <button className="w-full sm:w-auto bg-primary text-white px-6 py-2 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-primary-container transition-all">
                    {insights.completedCount > 0 ? 'Review Progress' : 'Start Now'}
                  </button>
                </div>
              </div>

              <div className="bg-white p-6 sm:p-8 rounded-[2rem] editorial-shadow border border-zinc-50 flex flex-col justify-between h-full">
                <div>
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 mb-6">
                    <span className="bg-zinc-100 text-zinc-500 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">Upcoming</span>
                    <span className="text-zinc-400 text-xs">{insights.stageLabel}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-3">{insights.upcomingRound}</h3>
                  <p className="text-zinc-500 text-sm mb-8">
                    Next best focus for {insights.firstName}: {insights.recommendedFocus}.
                  </p>
                </div>
                <button className="w-full border border-zinc-100 text-primary py-3 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-zinc-50 transition-all">
                  Prepare Round
                </button>
              </div>
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between gap-4 mb-8">
              <h2 className="text-2xl font-bold font-headline">Upcoming</h2>
              <div className="h-[1px] flex-grow bg-zinc-100" />
            </div>

            <div className="space-y-4">
              <div className="bg-zinc-50 p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 group hover:bg-white hover:editorial-shadow transition-all">
                <div className="flex items-center gap-4 sm:gap-6 min-w-0">
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                    <Calendar size={24} />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-zinc-900 break-words">{insights.upcomingRound}</h4>
                    <p className="text-xs text-zinc-400">Personalized for {insights.gradeLevel} learners</p>
                  </div>
                </div>
                <button className="w-full sm:w-auto text-left sm:text-right text-[10px] font-bold uppercase tracking-widest text-primary hover:underline">
                  Register Interest
                </button>
              </div>

              <div className="bg-zinc-50 p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 group hover:bg-white hover:editorial-shadow transition-all">
                <div className="flex items-center gap-4 sm:gap-6 min-w-0">
                  <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center shrink-0">
                    <ShieldCheck size={24} />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-zinc-900 break-words">{insights.schoolName} prep session</h4>
                    <p className="text-xs text-zinc-400">Built around your recent performance and claimed quiz history</p>
                  </div>
                </div>
                <button className="w-full sm:w-auto text-left sm:text-right text-[10px] font-bold uppercase tracking-widest text-primary hover:underline">
                  View Brief
                </button>
              </div>
            </div>
          </section>
        </div>

        <div className="lg:col-span-4 space-y-8">
          <div className="bg-primary p-6 sm:p-8 lg:p-10 rounded-[2rem] text-white relative overflow-hidden editorial-shadow">
            <div className="relative z-10">
              <span className="text-[10px] font-label uppercase tracking-widest opacity-60 mb-2 block">Total Excellence</span>
              <div className="flex items-baseline gap-2 mb-6 flex-wrap">
                <span className="text-4xl sm:text-5xl font-black">{insights.totalPoints}</span>
                <span className="text-lg sm:text-xl opacity-60">Points</span>
              </div>
              <div className="w-full bg-white/20 h-1.5 rounded-full mb-2">
                <div className="bg-white h-full rounded-full" style={{ width: `${Math.min(100, (insights.totalPoints / insights.nextMilestone) * 100)}%` }} />
              </div>
              <span className="text-[10px] font-label uppercase tracking-widest opacity-60">Next Milestone: {insights.nextMilestone} PTS</span>
            </div>
            <Trophy className="absolute -bottom-4 -right-4 text-white/10" size={160} strokeWidth={1} />
          </div>

          <div className="bg-zinc-50 p-6 sm:p-8 rounded-[2rem]">
            <h3 className="text-lg font-bold mb-8">Recent Achievements</h3>
            {isLoading ? (
              <div className="flex items-center gap-3 text-zinc-500">
                <LoaderCircle size={18} className="animate-spin text-primary" />
                <span className="text-sm">Loading your performance snapshot...</span>
              </div>
            ) : recentAttempts.length > 0 ? (
              <div className="space-y-8">
                {recentAttempts.map((attempt) => (
                  <div key={attempt.session_token} className="flex flex-col gap-2 sm:flex-row sm:items-start sm:gap-4">
                    <span className="text-2xl font-black text-primary shrink-0">
                      {Math.round((attempt.score / Math.max(attempt.total_questions, 1)) * 100)}%
                    </span>
                    <div className="min-w-0">
                      <h4 className="font-bold text-sm text-zinc-900">Tech Quiz Attempt</h4>
                      <p className="text-[10px] text-zinc-400 font-bold tracking-widest uppercase">{formatAttemptDate(attempt.completed_at)}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-zinc-500">No claimed attempts yet. Once {insights.firstName} completes a quiz, the performance history will appear here.</p>
            )}
            <button className="w-full mt-10 bg-white text-zinc-900 py-4 rounded-xl font-bold text-xs uppercase tracking-widest editorial-shadow hover:bg-zinc-50 transition-all flex items-center justify-center gap-2">
              <Download size={16} />
              Download Transcript
            </button>
          </div>

          <div className="rounded-[2rem] overflow-hidden h-48 relative group">
            <img
              src="https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=2070&auto=format&fit=crop"
              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
              alt="Library"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-all" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
