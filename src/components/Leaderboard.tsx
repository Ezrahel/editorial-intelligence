import { useMemo } from 'react';
import { motion } from 'motion/react';
import {
  LayoutGrid,
  BookOpen,
  BarChart3,
  Settings,
  HelpCircle,
  ChevronRight,
  Trophy,
  LoaderCircle,
} from 'lucide-react';
import Avatar from './Avatar';
import { getScholarIdentity, type AuthUser, type LeaderboardEntry } from '../lib/scholar';

const avatarVariants = ['coral', 'amber', 'teal', 'blue', 'plum', 'emerald'] as const;

function variantForIndex(index: number) {
  return avatarVariants[index % avatarVariants.length];
}

export default function Leaderboard({
  currentUser,
  currentUserId,
  entries,
  isLoading,
}: {
  currentUser: AuthUser;
  currentUserId: string | null;
  entries: LeaderboardEntry[];
  isLoading: boolean;
}) {
  const podiumEntries = useMemo(() => entries.slice(0, 3), [entries]);
  const rankingRows = useMemo(() => entries.slice(3), [entries]);
  const { fullName } = getScholarIdentity(currentUser);

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-zinc-50 font-sans overflow-x-hidden">
      <aside className="hidden xl:flex flex-col w-64 bg-white border-r border-zinc-100 p-6 sticky top-16 h-[calc(100vh-64px)]">
        <div className="flex items-center gap-3 mb-10 p-2">
          <Avatar name={fullName} variant="teal" className="w-10 h-10 rounded-lg" />
          <div>
            <h4 className="font-bold text-sm text-zinc-900 break-words">{fullName}</h4>
            <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Live Rankings</p>
          </div>
        </div>

        <nav className="flex-grow space-y-2">
          {[
            { icon: LayoutGrid, label: 'Overview' },
            { icon: BookOpen, label: 'My Quizzes' },
            { icon: BarChart3, label: 'Performance', active: true },
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
          <div className="bg-primary/5 p-6 rounded-2xl border border-primary/10">
            <span className="text-[10px] font-bold text-primary uppercase tracking-widest mb-2 block">Leaderboard Sync</span>
            <p className="text-sm text-zinc-600 leading-relaxed">
              Claimed quiz sessions push your score into these rankings automatically.
            </p>
          </div>
          <button className="w-full flex items-center gap-4 px-4 py-3 text-zinc-500 text-sm font-bold hover:bg-zinc-50 rounded-xl transition-all">
            <HelpCircle size={18} />
            Help Center
          </button>
        </div>
      </aside>

      <main className="flex-grow min-w-0 p-4 sm:p-6 lg:p-10">
        <div className="max-w-5xl mx-auto">
          <div className="mb-12">
            <span className="bg-blue-100 text-blue-600 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest mb-6 inline-block">
              Season 04 • Live Rankings
            </span>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
              <div>
                <h1 className="text-4xl sm:text-5xl font-bold font-headline text-zinc-900 tracking-tighter mb-2">The Intelligence</h1>
                <h2 className="text-4xl sm:text-5xl font-bold font-headline text-primary italic tracking-tighter">League</h2>
              </div>
              <p className="max-w-md text-zinc-400 text-sm md:text-right leading-relaxed">
                Rankings are now calculated from claimed Supabase quiz sessions, so only authenticated and mapped attempts appear here.
              </p>
            </div>
          </div>

          {isLoading ? (
            <div className="rounded-[2rem] bg-white p-8 editorial-shadow flex items-center gap-3 text-zinc-500">
              <LoaderCircle size={18} className="animate-spin text-primary" />
              <span>Loading leaderboard standings...</span>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-stretch md:items-end mb-16">
                {podiumEntries.map((entry, index) => {
                  const displayRank = index + 1;
                  const cardOrderClass =
                    displayRank === 1 ? 'order-1 md:order-2 md:scale-110 border-4 border-primary' : displayRank === 2 ? 'order-2 md:order-1' : 'order-3';

                  return (
                    <div
                      key={entry.user_id}
                      className={`bg-white p-6 sm:p-8 rounded-[2rem] editorial-shadow text-center relative ${cardOrderClass}`}
                    >
                      {displayRank === 1 ? (
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-white p-2 rounded-full">
                          <div className="bg-yellow-400 text-white w-10 h-10 rounded-full flex items-center justify-center">
                            <Trophy size={20} />
                          </div>
                        </div>
                      ) : null}

                      <div className={`relative ${displayRank === 1 ? 'w-28 h-28 sm:w-32 sm:h-32' : 'w-24 h-24'} mx-auto mb-6`}>
                        <Avatar
                          name={entry.full_name}
                          variant={variantForIndex(index)}
                          className={`w-full h-full ${displayRank === 1 ? 'rounded-3xl text-4xl' : 'rounded-2xl text-3xl'}`}
                        />
                        <div className="absolute -bottom-2 -right-2 bg-primary text-white px-3 py-1.5 rounded-lg flex items-center justify-center font-bold text-xs uppercase tracking-widest whitespace-nowrap">
                          Rank #{displayRank}
                        </div>
                      </div>

                      <h3 className="font-bold text-zinc-900 mb-1">{entry.full_name}</h3>
                      <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mb-6">
                        {entry.school_name ?? 'School not provided'}
                      </p>

                      <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="text-left">
                          <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest block">Attempts</span>
                          <span className="text-lg font-black text-primary">{entry.attempts_count}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest block">Avg Accuracy</span>
                          <span className="text-lg font-black text-primary">{Math.round(entry.average_percentage)}%</span>
                        </div>
                      </div>

                      <div className="flex items-baseline justify-center gap-2">
                        <span className="text-3xl sm:text-4xl font-black text-zinc-900 tracking-tighter">{entry.total_points}</span>
                        <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Points</span>
                      </div>

                      {currentUserId === entry.user_id ? (
                        <p className="mt-4 text-[10px] font-bold uppercase tracking-widest text-primary">You</p>
                      ) : null}
                    </div>
                  );
                })}
              </div>

              <div className="bg-white rounded-[2rem] editorial-shadow overflow-hidden">
                <div className="p-6 sm:p-8 border-b border-zinc-100 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  <h3 className="font-bold text-zinc-900">Standard Rankings</h3>
                  <div className="flex gap-4 sm:gap-6 text-[10px] font-bold uppercase tracking-widest overflow-x-auto w-full sm:w-auto no-scrollbar">
                    <button className="text-primary border-b-2 border-primary pb-1">Overall</button>
                    <button className="text-zinc-400 hover:text-zinc-600">Claimed Sessions</button>
                  </div>
                </div>

                <div className="space-y-4 p-4 sm:hidden">
                  {rankingRows.map((row, index) => (
                    <article key={row.user_id} className="rounded-[1.5rem] border border-zinc-100 p-4">
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div className="flex items-center gap-3 min-w-0">
                          <Avatar name={row.full_name} variant={variantForIndex(index + 3)} className="w-12 h-12 rounded-xl shrink-0" />
                          <div className="min-w-0">
                            <h4 className="font-bold text-zinc-900 break-words">{row.full_name}</h4>
                            <p className="text-xs text-zinc-500 break-words">{row.school_name ?? 'School not provided'}</p>
                          </div>
                        </div>
                        <span className="text-sm font-black text-primary">#{index + 4}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="rounded-xl bg-zinc-50 p-3">
                          <span className="block text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1">Best Score</span>
                          <span className="inline-flex bg-blue-100 text-blue-600 px-2.5 py-1 rounded-lg text-[10px] font-bold">{row.best_score}/50</span>
                        </div>
                        <div className="rounded-xl bg-zinc-50 p-3">
                          <span className="block text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1">Total Points</span>
                          <span className="font-black text-zinc-900">{row.total_points}</span>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>

                <div className="hidden sm:block overflow-x-auto">
                  <table className="w-full min-w-[720px]">
                    <thead>
                      <tr className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 text-left">
                        <th className="px-8 py-6">Rank</th>
                        <th className="px-8 py-6">Student</th>
                        <th className="px-8 py-6">School</th>
                        <th className="px-8 py-6">Best Score</th>
                        <th className="px-8 py-6 text-right">Total Points</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-50">
                      {rankingRows.map((row, index) => (
                        <tr key={row.user_id} className="group hover:bg-zinc-50 transition-all">
                          <td className="px-8 py-6 font-bold text-zinc-400">#{index + 4}</td>
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-3">
                              <Avatar name={row.full_name} variant={variantForIndex(index + 3)} className="w-10 h-10 rounded-lg" />
                              <div>
                                <span className="font-bold text-zinc-900 whitespace-nowrap">{row.full_name}</span>
                                {currentUserId === row.user_id ? (
                                  <p className="text-[10px] font-bold uppercase tracking-widest text-primary">You</p>
                                ) : null}
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-6 text-zinc-500 text-sm">{row.school_name ?? 'School not provided'}</td>
                          <td className="px-8 py-6">
                            <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-lg text-[10px] font-bold">{row.best_score}/50</span>
                          </td>
                          <td className="px-8 py-6 text-right font-black text-zinc-900">{row.total_points}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <button className="w-full py-6 text-[10px] font-bold uppercase tracking-widest text-primary hover:bg-zinc-50 transition-all flex items-center justify-center gap-2">
                  View Full Rankings
                  <ChevronRight size={14} />
                </button>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
