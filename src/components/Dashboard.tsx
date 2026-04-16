import { motion } from 'motion/react';
import { 
  Clock, 
  Play, 
  Calendar, 
  ShieldCheck, 
  Trophy, 
  ChevronRight,
  Download,
  CheckCircle2
} from 'lucide-react';
import Avatar from './Avatar';

export default function Dashboard() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto px-6 py-12"
    >
      <div className="flex flex-col lg:flex-row justify-between items-start gap-8 mb-12">
        <div>
          <span className="font-label text-[10px] uppercase tracking-[0.2em] text-primary font-bold mb-4 block">Academic Dashboard</span>
          <h1 className="font-headline text-6xl font-bold tracking-tighter text-zinc-900">
            Scholarly <br />
            <span className="text-primary">Pursuits.</span>
          </h1>
        </div>
        
        <div className="flex gap-4">
          <div className="bg-zinc-100 p-6 rounded-2xl flex flex-col justify-center min-w-[160px]">
            <span className="text-[10px] font-label uppercase tracking-widest text-zinc-400 mb-1">Global Rank</span>
            <span className="text-3xl font-black text-zinc-900">#14</span>
          </div>
          <div className="bg-zinc-100 p-6 rounded-2xl flex flex-col justify-center min-w-[200px]">
            <span className="text-[10px] font-label uppercase tracking-widest text-zinc-400 mb-1">Nigerian Sector</span>
            <span className="text-3xl font-black text-zinc-900">Osun State</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-12">
          {/* Active Quizzes */}
          <section>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold font-headline">Active Quizzes</h2>
              <div className="h-[1px] flex-grow mx-8 bg-zinc-100" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-8 rounded-[2rem] editorial-shadow border border-zinc-50 flex flex-col justify-between h-full">
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">In Progress</span>
                    <span className="text-primary font-bold text-xs">24:12 Remaining</span>
                  </div>
                  <h3 className="text-xl font-bold mb-3">SS3 Tech League Qualifier</h3>
                  <p className="text-zinc-500 text-sm mb-8">State-wide competition focusing on advanced algorithms and cloud architecture.</p>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex -space-x-2">
                    <Avatar name="Femi Adeola" variant="blue" className="w-8 h-8 rounded-full border-2 border-white text-[10px]" />
                    <Avatar name="Kehinde Aluko" variant="amber" className="w-8 h-8 rounded-full border-2 border-white text-[10px]" />
                  </div>
                  <button className="bg-primary text-white px-6 py-2 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-primary-container transition-all">Resume</button>
                </div>
              </div>

              <div className="bg-white p-8 rounded-[2rem] editorial-shadow border border-zinc-50 flex flex-col justify-between h-full">
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <span className="bg-zinc-100 text-zinc-400 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">Draft</span>
                    <span className="text-zinc-400 text-xs">Not Started</span>
                  </div>
                  <h3 className="text-xl font-bold mb-3">Term 2 Mock Trials</h3>
                  <p className="text-zinc-500 text-sm mb-8">Preparatory assessment for the Federal Ministry of Education tech certifications.</p>
                </div>
                <button className="w-full border border-zinc-100 text-primary py-3 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-zinc-50 transition-all">Enter Session</button>
              </div>
            </div>
          </section>

          {/* Upcoming */}
          <section>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold font-headline">Upcoming</h2>
              <div className="h-[1px] flex-grow mx-8 bg-zinc-100" />
            </div>
            
            <div className="space-y-4">
              <div className="bg-zinc-50 p-6 rounded-2xl flex items-center justify-between group cursor-pointer hover:bg-white hover:editorial-shadow transition-all">
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                    <Calendar size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-zinc-900">State Robotics Qualifier</h4>
                    <p className="text-xs text-zinc-400">Saturday, 14 Oct 2026 • 10:00 AM WAT</p>
                  </div>
                </div>
                <button className="text-[10px] font-bold uppercase tracking-widest text-primary hover:underline">Register Interest</button>
              </div>

              <div className="bg-zinc-50 p-6 rounded-2xl flex items-center justify-between group cursor-pointer hover:bg-white hover:editorial-shadow transition-all">
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
                    <ShieldCheck size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-zinc-900">Cybersecurity Nigeria Invitational</h4>
                    <p className="text-xs text-zinc-400">Wednesday, 18 Oct 2026 • 2:00 PM WAT</p>
                  </div>
                </div>
                <button className="text-[10px] font-bold uppercase tracking-widest text-primary hover:underline">View Syllabus</button>
              </div>
            </div>
          </section>
        </div>

        {/* Sidebar Stats */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-primary p-10 rounded-[2rem] text-white relative overflow-hidden editorial-shadow">
            <div className="relative z-10">
              <span className="text-[10px] font-label uppercase tracking-widest opacity-60 mb-2 block">Total Excellence</span>
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-5xl font-black">482</span>
                <span className="text-xl opacity-60">Points</span>
              </div>
              <div className="w-full bg-white/20 h-1.5 rounded-full mb-2">
                <div className="bg-white h-full w-[85%] rounded-full" />
              </div>
              <span className="text-[10px] font-label uppercase tracking-widest opacity-60">Next Milestone: 500 PTS</span>
            </div>
            <Trophy className="absolute -bottom-4 -right-4 text-white/10" size={160} strokeWidth={1} />
          </div>

          <div className="bg-zinc-50 p-8 rounded-[2rem]">
            <h3 className="text-lg font-bold mb-8">Recent Achievements</h3>
            <div className="space-y-8">
              {[
                { score: "94%", title: "Python Syntax Mastery", date: "COMPLETED 2 DAYS AGO" },
                { score: "88%", title: "Abuja Regional Prelims", date: "COMPLETED 1 WEEK AGO" },
                { score: "100%", title: "Ethics in AI (Quiz 1)", date: "COMPLETED 2 WEEKS AGO" }
              ].map((ach, i) => (
                <div key={i} className="flex items-start gap-4">
                  <span className="text-2xl font-black text-primary">{ach.score}</span>
                  <div>
                    <h4 className="font-bold text-sm text-zinc-900">{ach.title}</h4>
                    <p className="text-[10px] text-zinc-400 font-bold tracking-widest">{ach.date}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-10 bg-white text-zinc-900 py-4 rounded-xl font-bold text-xs uppercase tracking-widest editorial-shadow hover:bg-zinc-50 transition-all flex items-center justify-center gap-2">
              <Download size={16} />
              Download Transcript
            </button>
          </div>

          <div className="rounded-[2rem] overflow-hidden h-48 relative group cursor-pointer">
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
