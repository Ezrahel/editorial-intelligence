import { motion } from 'motion/react';
import { 
  LayoutGrid, 
  BookOpen, 
  BarChart3, 
  Settings, 
  HelpCircle, 
  ChevronRight,
  Trophy,
  Medal,
  UserCircle
} from 'lucide-react';
import Avatar from './Avatar';

export default function Leaderboard() {
  return (
    <div className="flex min-h-screen bg-zinc-50 font-sans">
      {/* Sidebar - Left */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-zinc-100 p-6 sticky top-16 h-[calc(100vh-64px)]">
        <div className="flex items-center gap-3 mb-10 p-2">
          <Avatar name="Amos Ayomide" variant="teal" className="w-10 h-10 rounded-lg" />
          <div>
            <h4 className="font-bold text-sm text-zinc-900">Digital Scholar</h4>
            <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Tech League Elite</p>
          </div>
        </div>

        <nav className="flex-grow space-y-2">
          {[
            { icon: LayoutGrid, label: 'Overview' },
            { icon: BookOpen, label: 'My Quizzes' },
            { icon: BarChart3, label: 'Performance', active: true },
            { icon: BookOpen, label: 'Resources' },
            { icon: Settings, label: 'Settings' }
          ].map((item, i) => (
            <button 
              key={i}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-bold transition-all ${item.active ? 'bg-primary/5 text-primary' : 'text-zinc-500 hover:bg-zinc-50'}`}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="mt-auto space-y-4">
          <div className="bg-primary/5 p-6 rounded-2xl border border-primary/10">
            <span className="text-[10px] font-bold text-primary uppercase tracking-widest mb-2 block">Pro Membership</span>
            <button className="w-full bg-primary text-white py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-primary-container transition-all">Upgrade Profile</button>
          </div>
          <button className="w-full flex items-center gap-4 px-4 py-3 text-zinc-500 text-sm font-bold hover:bg-zinc-50 rounded-xl transition-all">
            <HelpCircle size={18} />
            Help Center
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-8 lg:p-12">
        <div className="max-w-5xl mx-auto">
          <div className="mb-12">
            <span className="bg-blue-100 text-blue-600 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest mb-6 inline-block">Season 04 • Live Rankings</span>
            <div className="flex flex-col md:flex-row justify-between items-end gap-6">
              <div>
                <h1 className="text-5xl font-bold font-headline text-zinc-900 tracking-tighter mb-2">The Intelligence</h1>
                <h2 className="text-5xl font-bold font-headline text-primary italic tracking-tighter">League</h2>
              </div>
              <p className="max-w-md text-zinc-400 text-sm text-right leading-relaxed">
                Global leaderboard for the top editorial researchers and tech-savvy scholars. Calculated based on accuracy, speed, and difficulty level of quizzes completed.
              </p>
            </div>
          </div>

          {/* Podium */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end mb-16">
            {/* Rank 2 */}
            <div className="bg-white p-8 rounded-[2rem] editorial-shadow text-center relative order-2 md:order-1">
              <div className="relative w-24 h-24 mx-auto mb-6">
                <Avatar name="Sijuwade Lawrence" variant="amber" className="w-full h-full rounded-2xl text-3xl" />
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary text-white rounded-lg flex items-center justify-center font-bold text-sm">2</div>
              </div>
              <h3 className="font-bold text-zinc-900 mb-1">Sijuwade Lawrence</h3>
              <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mb-4">Iloko Model College</p>
              <div className="bg-zinc-50 py-2 rounded-full text-primary font-bold text-xs">12,450 pts</div>
            </div>

            {/* Rank 1 */}
            <div className="bg-white p-10 rounded-[2.5rem] border-4 border-primary editorial-shadow text-center relative z-10 scale-110 order-1 md:order-2">
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-white p-2 rounded-full">
                <div className="bg-yellow-400 text-white w-10 h-10 rounded-full flex items-center justify-center">
                  <Trophy size={20} />
                </div>
              </div>
              <div className="relative w-32 h-32 mx-auto mb-6">
                <Avatar name="Adebimpe Rhoda" variant="coral" className="w-full h-full rounded-3xl text-4xl" />
                <div className="absolute -bottom-3 -right-3 bg-primary text-white px-4 py-1.5 rounded-lg font-bold text-xs uppercase tracking-widest">Rank #1</div>
              </div>
              <h3 className="text-xl font-bold text-zinc-900 mb-1">Adebimpe Rhoda</h3>
              <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mb-6">Olashoore International School</p>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="text-left">
                  <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest block">Quizzes</span>
                  <span className="text-lg font-black text-primary">482</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest block">Avg Accuracy</span>
                  <span className="text-lg font-black text-primary">98.4%</span>
                </div>
              </div>
              
              <div className="flex items-baseline justify-center gap-2">
                <span className="text-4xl font-black text-zinc-900 tracking-tighter">14,892</span>
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Points</span>
              </div>
            </div>

            {/* Rank 3 */}
            <div className="bg-white p-8 rounded-[2rem] editorial-shadow text-center relative order-3">
              <div className="relative w-24 h-24 mx-auto mb-6">
                <Avatar name="Amos Ayomide" variant="teal" className="w-full h-full rounded-2xl text-3xl" />
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary text-white rounded-lg flex items-center justify-center font-bold text-sm">3</div>
              </div>
              <h3 className="font-bold text-zinc-900 mb-1">Amos Ayomide</h3>
              <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mb-4">LSE Graduate Dept</p>
              <div className="bg-zinc-50 py-2 rounded-full text-primary font-bold text-xs">11,920 pts</div>
            </div>
          </div>

          {/* Standard Rankings Table */}
          <div className="bg-white rounded-[2rem] editorial-shadow overflow-hidden">
            <div className="p-8 border-b border-zinc-100 flex justify-between items-center">
              <h3 className="font-bold text-zinc-900">Standard Rankings</h3>
              <div className="flex gap-6 text-[10px] font-bold uppercase tracking-widest">
                <button className="text-primary border-b-2 border-primary pb-1">Overall</button>
                <button className="text-zinc-400 hover:text-zinc-600">By School</button>
                <button className="text-zinc-400 hover:text-zinc-600">By Department</button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 text-left">
                    <th className="px-8 py-6">Rank</th>
                    <th className="px-8 py-6">Student</th>
                    <th className="px-8 py-6">School</th>
                    <th className="px-8 py-6">Last Quiz</th>
                    <th className="px-8 py-6 text-right">Total Points</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-50">
                  {[
                    { rank: '04', name: 'Aluko Kehinde', variant: 'blue' as const, inst: 'Ilesha Grammar School', score: '94%', pts: '10,540' },
                    { rank: '05', name: 'Olawumi Joy', variant: 'plum' as const, inst: 'Ijebu-Jesha Grammar School', score: '97%', pts: '9,820' },
                    { rank: '06', name: 'Ifedayo Teniola', variant: 'amber' as const, inst: 'King`s College', score: '89%', pts: '9,115' },
                    { rank: '07', name: 'Bolaji-kowe Israel', variant: 'emerald' as const, inst: 'Olashoore Int`l School', score: '92%', pts: '8,990' }
                  ].map((row, i) => (
                    <tr key={i} className="group hover:bg-zinc-50 transition-all">
                      <td className="px-8 py-6 font-bold text-zinc-400">{row.rank}</td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <Avatar name={row.name} variant={row.variant} className="w-10 h-10 rounded-lg" />
                          <span className="font-bold text-zinc-900">{row.name}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-zinc-500 text-sm">{row.inst}</td>
                      <td className="px-8 py-6">
                        <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-lg text-[10px] font-bold">{row.score}</span>
                      </td>
                      <td className="px-8 py-6 text-right font-black text-zinc-900">{row.pts}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <button className="w-full py-6 text-[10px] font-bold uppercase tracking-widest text-primary hover:bg-zinc-50 transition-all flex items-center justify-center gap-2">
              View Full 100 Rankings
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
