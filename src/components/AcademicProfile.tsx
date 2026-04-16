import { motion } from 'motion/react';
import { 
  MapPin, 
  GraduationCap, 
  ShieldCheck, 
  Network, 
  Code2, 
  Cpu, 
  BarChart3, 
  Shield,
  ArrowLeft,
  User
} from 'lucide-react';

interface AcademicProfileProps {
  onBack: () => void;
  onFinish: () => void;
}

export default function AcademicProfile({ onBack, onFinish }: AcademicProfileProps) {
  return (
    <div className="min-h-screen bg-zinc-50 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-zinc-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
          <div className="text-xl font-bold tracking-tighter text-primary font-headline">The Digital Scholar</div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-500">
            <a href="#" className="hover:text-primary">Competition</a>
            <a href="#" className="hover:text-primary">Resources</a>
            <a href="#" className="text-primary border-b-2 border-primary pb-1">Profile</a>
          </nav>
          <div className="text-zinc-500">
            <User size={24} />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left Sidebar - Steps */}
          <div className="lg:w-1/3 space-y-6">
            <div className="bg-white p-8 rounded-[2rem] editorial-shadow relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <GraduationCap size={120} />
              </div>
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6">
                <GraduationCap size={24} />
              </div>
              <h3 className="text-xl font-bold font-headline mb-4">School & Interests</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">
                Help us tailor your tech journey. Your track selection determines which quiz modules you'll face in the national qualifiers.
              </p>
            </div>

            <div className="space-y-4 px-4">
              <div className="flex items-center gap-4 text-zinc-400">
                <div className="w-8 h-8 rounded-full bg-zinc-200 flex items-center justify-center">
                  <ShieldCheck size={16} />
                </div>
                <span className="font-bold text-sm">Official Representation</span>
              </div>
              <div className="flex items-center gap-4 text-zinc-400">
                <div className="w-8 h-8 rounded-full bg-zinc-200 flex items-center justify-center">
                  <Network size={16} />
                </div>
                <span className="font-bold text-sm">Specialization Path</span>
              </div>
            </div>
          </div>

          {/* Right Content - Form */}
          <div className="lg:w-2/3 bg-white p-10 md:p-16 rounded-[2rem] editorial-shadow relative">
            {/* Progress */}
            <div className="absolute top-8 right-12 text-right">
              <span className="text-zinc-400 text-xs font-bold uppercase tracking-widest">Progress</span>
              <div className="text-2xl font-black text-primary">66%</div>
            </div>

            <div className="mb-12">
              <span className="text-primary font-bold text-xs uppercase tracking-widest mb-2 block">Step 2 of 3</span>
              <h2 className="text-4xl font-bold font-headline text-zinc-900">Academic Profile</h2>
              <div className="mt-4 flex gap-2">
                <div className="h-1.5 w-1/3 bg-primary rounded-full" />
                <div className="h-1.5 w-1/3 bg-primary rounded-full" />
                <div className="h-1.5 w-1/3 bg-zinc-100 rounded-full" />
              </div>
            </div>

            <form className="space-y-10" onSubmit={(e) => { e.preventDefault(); onFinish(); }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block font-label text-[10px] uppercase tracking-widest font-bold text-zinc-900 mb-3">LGA / State of Origin</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="e.g. Ilesha, Osun"
                      className="w-full px-4 py-4 bg-zinc-50 border-none rounded-lg focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                    />
                    <MapPin size={18} className="absolute right-4 top-4 text-zinc-300" />
                  </div>
                </div>

                <div>
                  <label className="block font-label text-[10px] uppercase tracking-widest font-bold text-zinc-900 mb-3">School Category</label>
                  <div className="flex gap-2">
                    {['Private', 'Federal', 'State'].map((cat) => (
                      <button 
                        key={cat}
                        type="button"
                        className={`px-6 py-3 rounded-xl font-bold text-sm transition-all ${cat === 'Federal' ? 'bg-primary text-white' : 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200'}`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-label text-[10px] uppercase tracking-widest font-bold text-zinc-900 mb-6">Select your tech track</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { id: 'coding', icon: Code2, title: 'Coding', desc: 'Python, Java, & Web Dev' },
                    { id: 'robotics', icon: Cpu, title: 'Robotics', desc: 'Hardware & Embedded Systems' },
                    { id: 'data', icon: BarChart3, title: 'Data Science', desc: 'ML Models & Statistics', active: true },
                    { id: 'cyber', icon: Shield, title: 'Cyber Security', desc: 'Network & App Security' }
                  ].map((track) => (
                    <div 
                      key={track.id}
                      className={`p-6 rounded-2xl border-2 cursor-pointer transition-all flex items-center gap-4 ${track.active ? 'border-primary bg-zinc-50' : 'border-zinc-100 hover:border-zinc-200'}`}
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${track.active ? 'bg-primary text-white' : 'bg-zinc-100 text-zinc-400'}`}>
                        <track.icon size={24} />
                      </div>
                      <div>
                        <h4 className="font-bold text-zinc-900">{track.title}</h4>
                        <p className="text-xs text-zinc-400">{track.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-label text-[10px] uppercase tracking-widest font-bold text-zinc-900 mb-3">Teacher / Mentor Name (Optional)</label>
                <input 
                  type="text" 
                  placeholder="Enter full name of your guiding teacher"
                  className="w-full px-4 py-4 bg-zinc-50 border-none rounded-lg focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                />
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-center pt-8 gap-4">
                <button 
                  type="button"
                  onClick={onBack}
                  className="flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all"
                >
                  <ArrowLeft size={20} />
                  Back to Step 1
                </button>
                <button className="w-full sm:w-auto bg-primary hover:bg-primary-container text-white font-bold px-12 py-4 rounded-xl transition-all editorial-shadow">
                  Finish Setup
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>

      <footer className="max-w-7xl mx-auto px-8 py-12 border-t border-zinc-200 mt-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-zinc-400 text-[10px] font-label uppercase tracking-widest">© 2026 The Digital Scholar. Nigerian Academic Excellence.</p>
          <div className="flex gap-8 text-[10px] font-label uppercase tracking-widest text-zinc-400">
            <a href="#" className="hover:text-primary">Standards</a>
            <a href="#" className="hover:text-primary">FAQ</a>
            <a href="#" className="hover:text-primary">Privacy</a>
            <a href="#" className="hover:text-primary">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
