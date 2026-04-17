import { motion } from 'motion/react';
import { 
  LayoutGrid, 
  BookOpen, 
  BarChart3, 
  Settings, 
  HelpCircle, 
  ChevronRight,
  Zap,
  Timer,
  Users,
  Trophy,
  Flame,
  Brain,
  Cpu,
  UserCircle
} from 'lucide-react';
import Avatar from './Avatar';

export default function AcademicPulse() {
  return (
    <div className="flex min-h-screen bg-zinc-50 font-sans">
      {/* Sidebar - Left */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-zinc-100 p-6 sticky top-16 h-[calc(100vh-64px)]">
        <div className="flex items-center gap-3 mb-10 p-2">
          <div className="text-primary font-bold text-xl tracking-tighter">Digital Scholar</div>
        </div>

        <nav className="flex-grow space-y-2">
          {[
            { icon: LayoutGrid, label: 'Overview', active: true },
            { icon: BookOpen, label: 'My Quizzes' },
            { icon: BarChart3, label: 'Performance' },
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
          <div className="bg-primary p-6 rounded-2xl text-white">
            <span className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-1 block">Status</span>
            <h4 className="font-bold text-sm mb-3">Tech League Elite</h4>
            <button className="w-full bg-white/20 hover:bg-white/30 text-white py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all">Upgrade Profile</button>
          </div>
          <button className="w-full flex items-center gap-4 px-4 py-3 text-zinc-500 text-sm font-bold hover:bg-zinc-50 rounded-xl transition-all">
            <HelpCircle size={18} />
            Help Center
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-4 sm:p-8 lg:p-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6 mb-12">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary mb-2 block">Student Dashboard</span>
              <h1 className="text-4xl sm:text-5xl font-bold font-headline text-zinc-900 tracking-tighter">Academic Pulse</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-left sm:text-right">
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 block">Global Rank</span>
                <span className="text-2xl font-black text-primary">#42</span>
              </div>
              <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-white shadow-sm">
                <Avatar name="Kehinde Aluko" variant="amber" className="w-full h-full rounded-xl" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
            {/* Weekly Goal Progress */}
            <div className="lg:col-span-8 bg-white p-6 sm:p-10 rounded-[2.5rem] editorial-shadow relative overflow-hidden">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-10">
                <div>
                  <h3 className="text-2xl font-bold text-zinc-900 mb-2">Weekly Goal Progress</h3>
                  <p className="text-zinc-500 text-sm max-w-sm">You've completed 85% of your scheduled modules this week.</p>
                </div>
                <div className="bg-blue-50 px-6 py-4 rounded-2xl text-center">
                  <span className="text-xl font-black text-primary block">12/14</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-primary/60">Tasks</span>
                </div>
              </div>

              <div className="space-y-8">
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-900">Advanced Algorithms</span>
                    <span className="text-xs font-bold text-zinc-400">92%</span>
                  </div>
                  <div className="w-full bg-zinc-100 h-2 rounded-full">
                    <div className="bg-primary h-full w-[92%] rounded-full" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-900">Systems Architecture</span>
                    <span className="text-xs font-bold text-zinc-400">74%</span>
                  </div>
                  <div className="w-full bg-zinc-100 h-2 rounded-full">
                    <div className="bg-blue-400 h-full w-[74%] rounded-full" />
                  </div>
                </div>
              </div>
              
              {/* Decorative accent */}
              <div className="absolute top-0 left-0 w-1.5 h-full bg-primary" />
            </div>

            {/* Upcoming Round */}
            <div className="lg:col-span-4 bg-primary p-6 sm:p-10 rounded-[2.5rem] text-white editorial-shadow flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-8 block">Upcoming Round</span>
                <h3 className="text-3xl font-bold font-headline leading-tight mb-2">Quantum Theory & Logic</h3>
                <p className="text-white/60 text-sm">Starts in 4h 22m</p>
              </div>
              <button className="w-full bg-white text-primary py-4 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-zinc-50 transition-all mt-8">
                Pre-register Now
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Performance History */}
            <div className="lg:col-span-8 bg-zinc-100/50 p-10 rounded-[2.5rem]">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-12">
                <h3 className="text-xl font-bold text-zinc-900">Performance History</h3>
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                  Last 30 Days
                  <ChevronRight size={14} className="rotate-90" />
                </div>
              </div>

              <div className="flex items-end justify-between h-40 sm:h-48 px-1 sm:px-4 gap-2">
                {[
                  { day: 'MON', val: 40 },
                  { day: 'TUE', val: 65 },
                  { day: 'WED', val: 55 },
                  { day: 'THU', val: 90, active: true },
                  { day: 'FRI', val: 45 },
                  { day: 'SAT', val: 70 },
                  { day: 'SUN', val: 50 }
                ].map((bar, i) => (
                  <div key={i} className="flex flex-col items-center gap-3 sm:gap-4 flex-1 min-w-0">
                    <div 
                      className={`w-full max-w-[28px] sm:max-w-[40px] rounded-lg transition-all duration-500 ${bar.active ? 'bg-primary' : 'bg-zinc-200'}`}
                      style={{ height: `${bar.val}%` }}
                    />
                    <span className="text-[10px] font-bold text-zinc-400">{bar.day}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Achievements */}
            <div className="lg:col-span-4 bg-white p-6 sm:p-10 rounded-[2.5rem] border border-zinc-100">
              <h3 className="text-xl font-bold text-zinc-900 mb-8">Achievements</h3>
              <div className="grid grid-cols-2 gap-4 mb-10">
                {[
                  { icon: Trophy, label: 'Master Thinker', sub: 'LVL 4', color: 'bg-blue-50 text-blue-600' },
                  { icon: Zap, label: 'Quick Reflex', sub: 'ELITE', color: 'bg-indigo-50 text-indigo-600' },
                  { icon: Flame, label: '7-Day Streak', sub: 'ACTIVE', color: 'bg-orange-50 text-orange-600' },
                  { icon: Brain, label: 'Neural Link', sub: 'LOCKED', color: 'bg-zinc-50 text-zinc-300' }
                ].map((ach, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-zinc-50 flex flex-col items-center text-center">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${ach.color}`}>
                      <ach.icon size={20} />
                    </div>
                    <h4 className="text-[10px] font-bold text-zinc-900 leading-tight">{ach.label}</h4>
                    <p className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest mt-1">{ach.sub}</p>
                  </div>
                ))}
              </div>
              <button className="w-full text-[10px] font-bold uppercase tracking-widest text-primary hover:underline text-center">
                View Hall of Fame
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
