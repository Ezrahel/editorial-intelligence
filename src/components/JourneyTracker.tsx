import { motion } from 'motion/react';
import { 
  CheckCircle2, 
  Circle, 
  Lock, 
  Star, 
  Zap, 
  Trophy, 
  Target,
  ChevronRight,
  ArrowRight,
  BookOpen,
  Cpu,
  Brain,
  Code2,
  Database
} from 'lucide-react';

interface Module {
  id: string;
  title: string;
  status: 'completed' | 'current' | 'locked';
  description: string;
  icon: any;
}

interface Tier {
  id: string;
  name: string;
  status: 'completed' | 'current' | 'locked';
  modules: Module[];
}

const journeyData: Tier[] = [
  {
    id: 'tier-1',
    name: 'Tier I: Foundation',
    status: 'completed',
    modules: [
      { id: 'm1', title: 'Digital Literacy', status: 'completed', description: 'Master the basics of digital tools and online safety.', icon: BookOpen },
      { id: 'm2', title: 'Intro to Programming', status: 'completed', description: 'Learn logic and syntax with Python.', icon: Code2 },
      { id: 'm3', title: 'Data Fundamentals', status: 'completed', description: 'Understanding how data is stored and used.', icon: Database },
    ]
  },
  {
    id: 'tier-2',
    name: 'Tier II: Specialist',
    status: 'current',
    modules: [
      { id: 'm4', title: 'Advanced Algorithms', status: 'completed', description: 'Complex problem solving and optimization.', icon: Cpu },
      { id: 'm5', title: 'Machine Learning Basics', status: 'current', description: 'Introduction to neural networks and predictive models.', icon: Brain },
      { id: 'm6', title: 'Cloud Architecture', status: 'locked', description: 'Designing scalable systems in the cloud.', icon: Zap },
    ]
  },
  {
    id: 'tier-3',
    name: 'Tier III: Elite',
    status: 'locked',
    modules: [
      { id: 'm7', title: 'Quantum Computing', status: 'locked', description: 'The future of computation and quantum logic.', icon: Target },
      { id: 'm8', title: 'Cybersecurity Defense', status: 'locked', description: 'Advanced threat detection and mitigation.', icon: Lock },
      { id: 'm9', title: 'AI Ethics & Governance', status: 'locked', description: 'Navigating the moral landscape of AI.', icon: Star },
    ]
  }
];

export default function JourneyTracker() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto px-6 py-12"
    >
      <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-16">
        <div>
          <span className="font-label text-[10px] uppercase tracking-[0.2em] text-primary font-bold mb-4 block">Scholarly Path</span>
          <h1 className="font-headline text-6xl font-bold tracking-tighter text-zinc-900">
            The Digital <br />
            <span className="text-primary italic">Scholar Journey.</span>
          </h1>
        </div>
        
        <div className="bg-zinc-900 p-8 rounded-[2.5rem] text-white editorial-shadow min-w-[300px]">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center">
              <Trophy size={24} />
            </div>
            <div>
              <h3 className="font-bold">Current Status</h3>
              <p className="text-xs text-white/60 uppercase tracking-widest font-bold">Tier II Specialist</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-white/40">
              <span>Overall Progress</span>
              <span>45%</span>
            </div>
            <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '45%' }}
                className="bg-primary h-full rounded-full" 
              />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-24 relative">
        {/* Connector Line */}
        <div className="absolute left-[23px] top-8 bottom-8 w-0.5 bg-zinc-100 hidden md:block" />

        {journeyData.map((tier, tierIdx) => (
          <div key={tier.id} className="relative">
            <div className="flex items-center gap-6 mb-12 relative z-10">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 border-white editorial-shadow ${
                tier.status === 'completed' ? 'bg-green-500 text-white' :
                tier.status === 'current' ? 'bg-primary text-white' :
                'bg-zinc-200 text-zinc-400'
              }`}>
                {tier.status === 'completed' ? <CheckCircle2 size={24} /> : 
                 tier.status === 'current' ? <Star size={24} /> : 
                 <Lock size={20} />}
              </div>
              <div>
                <h2 className={`text-3xl font-bold font-headline ${tier.status === 'locked' ? 'text-zinc-300' : 'text-zinc-900'}`}>
                  {tier.name}
                </h2>
                <p className="text-xs font-bold uppercase tracking-widest text-zinc-400">
                  {tier.status === 'completed' ? 'Tier Mastered' : 
                   tier.status === 'current' ? 'Active Progression' : 
                   'Locked Tier'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 ml-0 md:ml-16">
              {tier.modules.map((module, modIdx) => (
                <motion.div
                  key={module.id}
                  whileHover={{ y: -5 }}
                  className={`p-8 rounded-[2.5rem] border transition-all relative overflow-hidden ${
                    module.status === 'completed' ? 'bg-white border-zinc-100 editorial-shadow' :
                    module.status === 'current' ? 'bg-white border-primary shadow-[0_20px_40px_rgba(43,55,166,0.1)] ring-1 ring-primary/20' :
                    'bg-zinc-50 border-transparent opacity-60 grayscale'
                  }`}
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                      module.status === 'completed' ? 'bg-green-50 text-green-600' :
                      module.status === 'current' ? 'bg-primary/10 text-primary' :
                      'bg-zinc-100 text-zinc-400'
                    }`}>
                      <module.icon size={24} />
                    </div>
                    {module.status === 'completed' && <CheckCircle2 className="text-green-500" size={20} />}
                    {module.status === 'current' && (
                      <span className="bg-primary text-white text-[8px] font-bold px-2 py-1 rounded-full uppercase tracking-widest animate-pulse">
                        In Progress
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-lg mb-2 text-zinc-900">{module.title}</h3>
                  <p className="text-zinc-500 text-xs leading-relaxed mb-8">{module.description}</p>

                  <div className="flex items-center justify-between mt-auto">
                    <button className={`text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 transition-colors ${
                      module.status === 'locked' ? 'text-zinc-400 cursor-not-allowed' : 'text-primary hover:text-primary-container'
                    }`}>
                      {module.status === 'completed' ? 'Review Module' : 
                       module.status === 'current' ? 'Continue Learning' : 
                       'Locked'}
                      <ArrowRight size={14} />
                    </button>
                  </div>

                  {/* Background Decoration */}
                  <div className="absolute -bottom-4 -right-4 opacity-[0.03] pointer-events-none">
                    <module.icon size={120} strokeWidth={1} />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Final Milestone */}
      <div className="mt-32 p-12 rounded-[3.5rem] bg-gradient-to-br from-zinc-900 to-zinc-800 text-white text-center relative overflow-hidden editorial-shadow">
        <div className="relative z-10 max-w-2xl mx-auto">
          <Trophy size={64} className="mx-auto mb-8 text-primary" />
          <h2 className="text-4xl font-bold font-headline mb-4">The Ultimate Goal: Elite Status</h2>
          <p className="text-white/60 mb-10 leading-relaxed">
            Reach the end of the journey to become a certified Digital Scholar Elite. 
            Unlock exclusive opportunities, mentorship from industry leaders, and 
            fully funded academic pathways.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="bg-white/10 px-6 py-3 rounded-xl border border-white/10">
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/40 block mb-1">Rewards</span>
              <span className="font-bold text-sm">₦5,000,000 Grant</span>
            </div>
            <div className="bg-white/10 px-6 py-3 rounded-xl border border-white/10">
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/40 block mb-1">Access</span>
              <span className="font-bold text-sm">Global Tech Summit</span>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-10 left-10 w-64 h-64 bg-primary rounded-full blur-[120px]" />
          <div className="absolute bottom-10 right-10 w-64 h-64 bg-blue-500 rounded-full blur-[120px]" />
        </div>
      </div>
    </motion.div>
  );
}
