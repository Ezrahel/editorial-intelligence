import { 
  Bell, 
  UserCircle, 
  Trophy, 
  ArrowRight, 
  Monitor, 
  BadgeCheck, 
  Globe, 
  Share2,
  ChevronRight,
  LayoutGrid,
  BarChart3,
  Lightbulb,
  Cpu,
  Search,
  ArrowUpRight,
  Code,
  Bot,
  Route,
  Terminal,
  BookOpen,
  Download,
  PlayCircle,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import SignUp from './components/SignUp';
import AcademicProfile from './components/AcademicProfile';
import Dashboard from './components/Dashboard';
import Leaderboard from './components/Leaderboard';
import Competition from './components/Competition';
import AcademicPulse from './components/AcademicPulse';
import Profile from './components/Profile';
import JourneyTracker from './components/JourneyTracker';
import Avatar from './components/Avatar';

const NotificationsDropdown = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const notifications = [
    { id: 1, title: 'Quiz Starting Soon', desc: 'SS3 Tech League Qualifier begins in 15 minutes.', time: '15m ago', unread: true },
    { id: 2, title: 'Achievement Unlocked', desc: 'You earned the "Master Thinker" badge!', time: '2h ago', unread: true },
    { id: 3, title: 'New Resource Available', desc: 'Quantum Computing Module 4 is now live.', time: '5h ago', unread: false },
    { id: 4, title: 'System Update', desc: 'Academic Pulse dashboard has been updated.', time: '1d ago', unread: false },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-[60]" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-2 w-80 bg-white rounded-[2rem] editorial-shadow border border-zinc-100 z-[70] overflow-hidden"
          >
            <div className="p-6 border-b border-zinc-50 flex justify-between items-center">
              <h3 className="font-bold text-zinc-900">Notifications</h3>
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Mark all as read</span>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {notifications.map((n) => (
                <div key={n.id} className={`p-6 hover:bg-zinc-50 transition-all cursor-pointer border-b border-zinc-50 last:border-none ${n.unread ? 'bg-blue-50/30' : ''}`}>
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-bold text-sm text-zinc-900">{n.title}</h4>
                    <span className="text-[10px] text-zinc-400">{n.time}</span>
                  </div>
                  <p className="text-xs text-zinc-500 leading-relaxed">{n.desc}</p>
                </div>
              ))}
            </div>
            <button className="w-full p-4 bg-zinc-50 text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-primary transition-all">
              View All Notifications
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const Navbar = ({ activeTab, setActiveTab, onSignIn, onStartQuiz }: { activeTab: string, setActiveTab: (tab: string) => void, onSignIn: () => void, onStartQuiz: () => void }) => {
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-sm fixed top-0 w-full z-50">
      <div className="flex justify-between items-center max-w-7xl mx-auto px-6 h-16">
        <div 
          className="text-xl font-bold tracking-tighter text-zinc-900 font-headline cursor-pointer"
          onClick={() => setActiveTab('home')}
        >
          Scholarly
        </div>
        <div className="hidden md:flex items-center space-x-8 font-sans text-sm tracking-tight">
          <button 
            className={`${activeTab === 'home' ? 'text-primary font-bold border-b-2 border-primary' : 'text-zinc-500'} hover:text-primary transition-colors pb-1`}
            onClick={() => setActiveTab('home')}
          >
            Competitions
          </button>
          <button 
            className={`${activeTab === 'leaderboard' ? 'text-primary font-bold border-b-2 border-primary' : 'text-zinc-500'} hover:text-primary transition-colors pb-1`}
            onClick={() => setActiveTab('leaderboard')}
          >
            Leaderboard
          </button>
          <button 
            className={`${activeTab === 'journey' ? 'text-primary font-bold border-b-2 border-primary' : 'text-zinc-500'} hover:text-primary transition-colors pb-1`}
            onClick={() => setActiveTab('journey')}
          >
            Journey
          </button>
          <button 
            className={`${activeTab === 'dashboard' ? 'text-primary font-bold border-b-2 border-primary' : 'text-zinc-500'} hover:text-primary transition-colors pb-1`}
            onClick={() => setActiveTab('dashboard')}
          >
            Dashboard
          </button>
          <button 
            className={`${activeTab === 'pulse' ? 'text-primary font-bold border-b-2 border-primary' : 'text-zinc-500'} hover:text-primary transition-colors pb-1`}
            onClick={() => setActiveTab('pulse')}
          >
            Pulse
          </button>
          <button 
            className={`${activeTab === 'resources' ? 'text-primary font-bold border-b-2 border-primary' : 'text-zinc-500'} hover:text-primary transition-colors pb-1`}
            onClick={() => setActiveTab('resources')}
          >
            Resources
          </button>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <button 
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className={`${isNotifOpen ? 'text-primary' : 'text-zinc-500'} hover:text-primary transition-colors relative`}
            >
              <Bell size={20} />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>
            <NotificationsDropdown isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
          </div>
          <button 
            className={`${activeTab === 'profile' ? 'text-primary' : 'text-zinc-500'} hover:text-primary transition-colors`}
            onClick={() => setActiveTab('profile')}
          >
            <UserCircle size={24} />
          </button>
          <button 
            onClick={onStartQuiz}
            className="bg-primary hover:bg-primary-container text-white px-5 py-2 rounded-full font-label text-[10px] uppercase tracking-widest transition-all scale-95 duration-200"
          >
            Start Quiz
          </button>
        </div>
      </div>
    </nav>
  );
};

const Hero = () => (
  <section className="relative overflow-hidden bg-surface py-24 md:py-32">
    <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-16">
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="flex-1 text-left z-10"
      >
        <div className="inline-block px-3 py-1 bg-tertiary-fixed text-tertiary rounded-full font-label text-[10px] uppercase tracking-[0.2em] mb-6">
          Excellence in Technology
        </div>
        <h1 className="font-headline text-5xl md:text-7xl font-bold tracking-tighter text-on-surface mb-6 leading-tight">
          Scholarly <span className="text-gradient-primary">Elite.</span>
        </h1>
        <p className="font-sans text-lg text-secondary max-w-lg mb-10 leading-relaxed">
          Join an exclusive league of digital scholars. Test your architectural depth and cloud mastery in the industry's most prestigious tech competition.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <button className="bg-gradient-to-br from-primary to-primary-container text-white px-8 py-4 rounded-full font-headline font-bold text-lg editorial-shadow transition-transform hover:scale-[1.02] active:scale-95">
            Join the League
          </button>
          <button className="bg-zinc-200 text-primary px-8 py-4 rounded-full font-headline font-bold text-lg hover:bg-zinc-300 transition-colors">
            View Schedule
          </button>
        </div>
      </motion.div>
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="flex-1 relative"
      >
        <div className="relative w-full aspect-square rounded-[2rem] overflow-hidden editorial-shadow bg-zinc-100">
          <img 
            className="w-full h-full object-cover" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAAsjEFSsL5tO_oLizdr9jXWTT_OFt_UNg1DNnxTtez_5ZSj_xFjevFLzDqeve9P0qFV9D8AIC4wg_SPL--nCdSoYoyoLUouk4kQYpOffckttvlGayg-tkCfpOZMS5Mp9G_nmeYK7NwWNwFuUAqmG8qdjFnnNmBk6abx_UcQKH7EoP0alDKzR8MtuEfzZ4_3IyqBPhxNglWl9J8L74OSxlG8Ts9LZyUm7xDmS_U5r_Y-9oEEmkQPhJpeLd6Q6Ob-3640NDhUht_ZzbL" 
            alt="Scholarly Elite"
            referrerPolicy="no-referrer"
          />
        </div>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1 }}
          className="absolute -bottom-8 -left-8 bg-white/90 backdrop-blur-xl p-6 rounded-full border border-outline-variant/20 editorial-shadow hidden lg:block"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-tertiary rounded-full flex items-center justify-center text-white">
              <Trophy size={24} />
            </div>
            <div>
              <div className="font-label text-[10px] uppercase tracking-widest text-secondary">Global Rank</div>
              <div className="font-headline font-extrabold text-primary text-xl">Top 1% Elite</div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
    <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl"></div>
  </section>
);

const Rewards = () => (
  <section className="bg-zinc-50 py-24">
    <div className="max-w-7xl mx-auto px-6">
      <div className="flex justify-between items-end mb-12">
        <div>
          <div className="font-label text-xs uppercase tracking-widest text-primary mb-2">Rewards</div>
          <h2 className="font-headline text-4xl font-bold tracking-tight text-on-surface">Championship Stakes</h2>
        </div>
        <div className="font-sans text-secondary max-w-xs text-right hidden md:block">
          Exceptional performance is met with unparalleled opportunities and recognition.
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div 
          whileHover={{ y: -5 }}
          className="md:col-span-2 bg-white p-10 rounded-[2rem] editorial-shadow group hover:bg-primary transition-colors duration-500"
        >
          <div className="flex flex-col h-full justify-between">
            <div>
              <Trophy className="text-primary group-hover:text-white transition-colors mb-6" size={48} />
              <h3 className="font-headline text-3xl font-bold mb-4 group-hover:text-white transition-colors">The Excellence Grant</h3>
              <p className="font-sans text-secondary group-hover:text-white/80 transition-colors text-lg max-w-md">
                A $25,000 scholarship and career placement with our global elite cloud partners.
              </p>
            </div>
            <div className="mt-8 flex items-center gap-2 font-label text-xs uppercase tracking-widest group-hover:text-white transition-colors">
              Learn More <ArrowRight size={16} />
            </div>
          </div>
        </motion.div>
        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-white p-8 rounded-[2rem] editorial-shadow group hover:bg-tertiary transition-colors duration-500"
        >
          <Monitor className="text-tertiary group-hover:text-white transition-colors mb-6" size={40} />
          <h3 className="font-headline text-2xl font-bold mb-4 group-hover:text-white transition-colors">Digital Arsenal</h3>
          <p className="font-sans text-secondary group-hover:text-white/80 transition-colors">
            The latest enterprise workstation hardware for the top 5 finalists.
          </p>
        </motion.div>
        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-white p-8 rounded-[2rem] editorial-shadow group hover:bg-zinc-800 transition-colors duration-500"
        >
          <BadgeCheck className="text-primary group-hover:text-white transition-colors mb-6" size={40} />
          <h3 className="font-headline text-2xl font-bold mb-4 group-hover:text-white transition-colors">Verified Credentials</h3>
          <p className="font-sans text-secondary group-hover:text-white/80 transition-colors">
            Exclusive NFT-backed certifications recognized by industry leaders.
          </p>
        </motion.div>
        <motion.div 
          whileHover={{ y: -5 }}
          className="md:col-span-2 relative rounded-[2rem] overflow-hidden min-h-[300px] group"
        >
          <img 
            className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBOhvC70mJC_AkbddWR4banS07K39jZq6CnW2GFr210mYW8UHDN9av8MmqnIZnEcxZEd-zAWrU8rBGRz4vLG711QaYWFLKzV0g1rSL80roMNR9g1cCvFPLIrwQQ7f9vxsiPj2MoH9k17vxKqEiG3nGA0klLI7tszLwSS7tYi48r_dHQeZpNHNmg6VVnETt4hTWMxdFQyL75qYT3xGeuUpsn9fHa8yXbTJP_tNVZF-J0VzzuiSJlrPFhVYl5nExDpx-07iqTU-Je1HKW" 
            alt="Network of Peers"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-primary/40 flex flex-col justify-end p-10">
            <h3 className="font-headline text-3xl font-bold text-white mb-2">Network of Peers</h3>
            <p className="font-sans text-white/90 max-w-sm">Join the private Scholarly Alumni circle for lifelong mentorship.</p>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

const HowItWorks = () => (
  <section className="bg-surface py-24 relative overflow-hidden">
    <div className="max-w-7xl mx-auto px-6">
      <div className="flex flex-col lg:flex-row items-start gap-20">
        <div className="lg:w-1/3 lg:sticky lg:top-32">
          <div className="font-label text-xs uppercase tracking-widest text-tertiary mb-4">The Journey</div>
          <h2 className="font-headline text-5xl font-bold tracking-tighter text-on-surface mb-8">How it <br/>Works.</h2>
          <div className="w-16 h-1 bg-primary mb-8"></div>
          <p className="font-sans text-lg text-secondary leading-relaxed">
            A tiered evaluation process designed to isolate true technical intuition from rote memorization.
          </p>
        </div>
        <div className="lg:w-2/3 space-y-12">
          {[
            {
              num: "01",
              title: "Initial Calibration",
              desc: "A 45-minute sprint covering fundamental cloud architecture, security protocols, and operational excellence. High precision is required to proceed.",
              color: "group-hover:text-primary"
            },
            {
              num: "02",
              title: "Deep Architecture",
              desc: "Advanced scenario-based problem solving. Design resilient systems under simulated traffic spikes and security breaches.",
              color: "group-hover:text-tertiary",
              offset: true
            },
            {
              num: "03",
              title: "The Live League",
              desc: "Top 50 candidates face a live, proctored environment for the final championship round. Real-time debugging and optimization challenges.",
              color: "group-hover:text-primary"
            }
          ].map((step, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`flex gap-8 group ${step.offset ? 'md:translate-x-12' : ''}`}
            >
              <div className={`flex-none font-headline text-6xl font-black text-zinc-200 ${step.color} transition-colors duration-300`}>
                {step.num}
              </div>
              <div className="pt-4">
                <h4 className="font-headline text-2xl font-bold text-on-surface mb-4">{step.title}</h4>
                <p className="font-sans text-secondary leading-relaxed max-w-xl">
                  {step.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

const CTA = () => (
  <section className="bg-primary py-24 text-center relative overflow-hidden">
    <div className="max-w-3xl mx-auto px-6 relative z-10">
      <h2 className="font-headline text-4xl md:text-5xl font-bold text-white mb-8 tracking-tight">Are you ready to claim your place?</h2>
      <p className="font-sans text-white/80 text-lg mb-10">
        Registration for the Spring Semester League closes in 4 days. Secure your entry today.
      </p>
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <button className="bg-white text-primary px-10 py-5 rounded-full font-headline font-bold text-xl hover:bg-zinc-100 transition-colors editorial-shadow">
          Start Your Application
        </button>
        <button className="border border-white/30 text-white px-10 py-5 rounded-full font-headline font-bold text-xl hover:bg-white/10 transition-colors">
          Read Guidelines
        </button>
      </div>
    </div>
    <div className="absolute inset-0 opacity-10">
      <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-tertiary rounded-full blur-[100px] translate-x-1/2 translate-y-1/2"></div>
    </div>
  </section>
);

const Resources = () => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="max-w-7xl mx-auto px-6 py-12"
  >
    <section className="mb-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
      <div className="lg:col-span-7">
        <span className="font-label text-xs font-bold tracking-[0.2em] text-tertiary uppercase mb-4 block">Knowledge Repository</span>
        <h1 className="font-headline text-[3.5rem] font-bold leading-tight tracking-[-0.02em] text-on-surface mb-6">
          Scholarly Elites <br />
          <span className="text-primary-container">Elite Resources.</span>
        </h1>
        <p className="text-secondary text-lg max-w-xl">
          Curated learning pathways for the next generation of Nigerian tech leaders. From WAEC excellence to AI mastery.
        </p>
      </div>
      <div className="lg:col-span-5 flex justify-end">
        <div className="relative w-full aspect-video rounded-full overflow-hidden shadow-2xl">
          <img 
            alt="Digital Learning" 
            className="w-full h-full object-cover" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuD6EHOWDB4QjexWs6lPBMuaW8YBTq96oG1rX2ZRBrP5XjGREMQdUl1lY2WzcB0u_FBptnCyDq8fs8747GRFJUD9pZVEkt0bbmxn6bGhZsztCX2zATTPu_DXGKpbqZJyDACAogCFGTGSXgKA8uSpViRy4W36b5lFx4hPHzVdcPs_HxFcYKaCIZzdYsFBk4OAPlPdQQE4ZFbniccImG5VXoTPCC4kURfPTTyA16nJUlmnH0W94gbx00lmMgxMP-dRkRvWHpkQMeC5btp8" 
            referrerPolicy="no-referrer"
          />
        </div>
      </div>
    </section>

    <section className="mb-16 bg-zinc-100 rounded-full p-2 flex flex-col md:flex-row gap-4 items-center">
      <div className="relative flex-grow px-4 flex items-center gap-3">
        <Search className="text-zinc-400" size={20} />
        <input 
          className="w-full bg-transparent border-none focus:outline-none font-sans text-on-surface py-4 placeholder:text-zinc-400" 
          placeholder="Find JAMB prep, Python basics, or AI ethics..." 
          type="text" 
        />
      </div>
      <div className="flex gap-2 p-2">
        <button className="bg-white text-primary px-6 py-2 rounded-full font-label text-xs font-bold shadow-sm hover:bg-primary hover:text-white transition-all">ALL MATERIALS</button>
        <button className="text-secondary px-6 py-2 rounded-full font-label text-xs font-bold hover:bg-zinc-200 transition-all">VIDEOS</button>
        <button className="text-secondary px-6 py-2 rounded-full font-label text-xs font-bold hover:bg-zinc-200 transition-all">GUIDES</button>
      </div>
    </section>

    <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-12 gap-6 mb-16">
      <div className="md:col-span-4 lg:col-span-8 bg-white rounded-[2rem] p-8 flex flex-col justify-between group cursor-pointer hover:shadow-xl transition-all duration-500">
        <div className="flex justify-between items-start">
          <span className="bg-tertiary-fixed text-tertiary px-4 py-1 rounded-full font-label text-[10px] uppercase font-bold tracking-widest">Featured Pathway</span>
          <ArrowUpRight className="text-tertiary" size={24} />
        </div>
        <div className="mt-20">
          <h3 className="font-headline text-3xl font-bold mb-4 group-hover:text-primary transition-colors">Tech Career Path Prep 2026</h3>
          <p className="text-secondary mb-6 max-w-md">Comprehensive module covering Computer Studies, Mathematics, and Logic specifically tailored for Nigerian national exams.</p>
          <div className="flex items-center gap-6">
            <div className="flex -space-x-3">
              <Avatar name="Morayo Afolabi" variant="emerald" className="w-10 h-10 rounded-full border-2 border-white text-xs" />
              <Avatar name="Uche Okoye" variant="amber" className="w-10 h-10 rounded-full border-2 border-white text-xs" />
              <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center text-[10px] font-bold text-primary font-label">+1.2k</div>
            </div>
            <span className="font-label text-xs text-zinc-400 uppercase tracking-wider">Join 1,200+ Scholars</span>
          </div>
        </div>
      </div>

      <div className="md:col-span-4 bg-primary-container rounded-[2rem] p-8 text-white flex flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-20">
          <Code size={80} strokeWidth={1} />
        </div>
        <div>
          <span className="font-label text-[10px] uppercase tracking-[0.2em] opacity-80">New Module</span>
          <h3 className="font-headline text-2xl font-bold mt-4 leading-tight">Python for Web Development</h3>
        </div>
        <button className="bg-white text-primary px-6 py-3 rounded-full font-label text-xs font-bold uppercase tracking-widest self-start mt-12 hover:scale-105 transition-transform">Explore</button>
      </div>

      {[
        { icon: Bot, title: "Emerging Tech", count: "12 RESOURCES" },
        { icon: Route, title: "Career Paths", count: "8 PATHWAYS" },
        { icon: Terminal, title: "Coding Basics", count: "24 TUTORIALS" },
        { icon: BookOpen, title: "Exam Prep", count: "15 GUIDES" }
      ].map((cat, i) => (
        <div key={i} className="md:col-span-2 lg:col-span-3 bg-zinc-100 rounded-[2rem] p-6 hover:bg-zinc-200 transition-colors cursor-pointer">
          <cat.icon className="text-tertiary mb-4" size={24} />
          <h4 className="font-headline font-bold text-lg mb-2">{cat.title}</h4>
          <p className="text-[10px] text-secondary font-label uppercase tracking-widest">{cat.count}</p>
        </div>
      ))}
    </div>

    <div className="flex justify-between items-center mb-10">
      <h2 className="font-headline text-2xl font-semibold">Latest Materials</h2>
      <a className="font-label text-xs font-bold text-primary border-b-2 border-primary-fixed pb-1 hover:border-primary transition-all" href="#">BROWSE ALL ARCHIVES</a>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[
        {
          img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCFcIP_RaZTbsegYhFGMRyXFI3Jx3etlSU80GVXPPK2k72MCOvtrdCvb-v7XwuynkaLgjwPwQqEnc733Ms6ofEPpZe1R92z5iuZ7Bp1mJYSTDMlz0fKsmWeo3RpFIniDxx6Et0GjZ494veu2IkCfiduP-b6uAXgE7kH0_6kxkcwLa7y7xu5Too01tSkA3g90j4eUj3T8QL139wDHh3CKj4oOuci5RZti-xS1lv8G5WVFO_YrYrjLVEgI1A3FqZsC6nP4VmiixVP9PtV",
          tag: "AI & ROBOTICS",
          time: "15 MIN READ",
          title: "Ethics in Nigerian AI Development",
          desc: "Exploring the cultural and legal landscape for implementing AI solutions in Ilesha' booming tech ecosystem.",
          action: "READ ARTICLE",
          icon: Download
        },
        {
          img: "https://lh3.googleusercontent.com/aida-public/AB6AXuC-rJJ3EpX5qq3RiyYr4U6Pka7AkC0nbiYnW6FpmKGMmvrqvxa0V6dBAe9UjqSk9Ffsk6l4-C0pLj5YViVxtdv6csfVS2zoeGDUviwVVqriwWyjOcJsZ7jlTOdPcHnpaVwe6Ahpd5uFXvmr71Gwgpd5QfsgSr9cOenJjgZ-eKiwOfPO1JVE66CnhsdsUJxvPfz5H72h-DzHJL3urScE2I0bOA8VumWHW4sKt34aNvRtfnmiC-E6DADtzJJkJmq5CEzuTemgKjEGFD1J",
          tag: "DATA SCIENCE",
          time: "VIDEO COURSE",
          title: "Intro to SQL for Beginners",
          desc: "Master the foundation of data management. Includes 5 hands-on practice sets for WAEC Computer Science.",
          action: "WATCH NOW",
          icon: PlayCircle
        },
        {
          img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBGrQOdFMgIa-CVY29NHXfJf7m1UZG0AN9NFq0NoqRwkc0kdCJ0sHp93IGRxkUaW-sotGMLTwtjiyHOgHk-_sGBNE8t8MZHPgBAOyquy_8bGebqibR2tFEWJKn8O8GoV9dMvO7vF1khfKSCQ-UPbwMIFknX_8pNHADIjgZkbtIX-wNFfCTB6_pe3vr_opD3fgetx-8iEkrLZs8nj2lWyvj8OJqu8ZLXD5he7GxTQBoDcA4NQ1VqxtE-ix7b05voMdNMF9u9gjqvjySC",
          tag: "CAREER PATHS",
          time: "DOWNLOADABLE PDF",
          title: "Software Engineering in Nigeria",
          desc: "A roadmap to landing your first internship at top African fintechs like Flutterwave or Paystack.",
          action: "DOWNLOAD GUIDE",
          icon: FileText
        }
      ].map((item, i) => (
        <article key={i} className="bg-zinc-100 rounded-[2rem] overflow-hidden hover:bg-white transition-all group editorial-shadow">
          <div className="h-48 overflow-hidden">
            <img 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
              src={item.img} 
              alt={item.title} 
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="p-8">
            <div className="flex gap-4 mb-4">
              <span className="text-[10px] font-label font-bold text-tertiary uppercase tracking-widest">{item.tag}</span>
              <span className="text-[10px] font-label font-bold text-zinc-400 uppercase tracking-widest">{item.time}</span>
            </div>
            <h3 className="font-headline text-xl font-bold mb-3">{item.title}</h3>
            <p className="text-sm text-secondary line-clamp-2 mb-6">{item.desc}</p>
            <div className="flex items-center justify-between">
              <span className="font-label text-xs font-bold text-primary">{item.action}</span>
              <item.icon className="text-primary" size={18} />
            </div>
          </div>
        </article>
      ))}
    </div>
  </motion.div>
);

const Footer = () => (
  <footer className="bg-white border-t border-zinc-100">
    <div className="max-w-7xl mx-auto px-8 py-12">
      <div className="flex flex-col md:flex-row justify-between items-center mb-12">
        <div className="mb-8 md:mb-0">
          <div className="font-headline font-bold text-zinc-900 text-xl mb-2">Scholarly Elites</div>
          <p className="font-label text-[10px] uppercase tracking-widest text-zinc-500">© 2026 Scholarly Elites. All rights reserved.</p>
        </div>
        <div className="flex flex-wrap justify-center gap-8 font-label text-[10px] uppercase tracking-widest">
          <a className="text-zinc-500 hover:text-primary transition-colors" href="#" target="_blank" rel="noopener noreferrer">Privacy Policy</a>
          <a className="text-zinc-500 hover:text-primary transition-colors" href="#" target="_blank" rel="noopener noreferrer">Terms of Service</a>
          <a className="text-zinc-500 hover:text-primary transition-colors" href="#" target="_blank" rel="noopener noreferrer">Contact</a>
          <a className="text-zinc-500 hover:text-primary transition-colors" href="#" target="_blank" rel="noopener noreferrer">FAQ</a>
          <a className="text-zinc-500 hover:text-primary transition-colors" href="#" target="_blank" rel="noopener noreferrer">Sitemap</a>
        </div>
        <div className="mt-8 md:mt-0 flex gap-4 text-primary">
          <Globe size={20} />
          <Share2 size={20} />
        </div>
      </div>
    </div>
  </footer>
);

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [view, setView] = useState<'landing' | 'signup' | 'profile' | 'competition'>('landing');

  if (view === 'signup') {
    return (
      <SignUp 
        onLogin={() => setView('landing')} 
        onSignUp={() => setView('profile')} 
      />
    );
  }

  if (view === 'profile') {
    return (
      <AcademicProfile 
        onBack={() => setView('signup')} 
        onFinish={() => setView('landing')} 
      />
    );
  }

  if (view === 'competition') {
    return (
      <div className="min-h-screen bg-zinc-50">
        <Navbar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          onSignIn={() => setView('signup')}
          onStartQuiz={() => setView('competition')}
        />
        <div className="pt-16">
          <Competition />
          <div className="max-w-7xl mx-auto px-8 py-8 flex justify-center">
            <button 
              onClick={() => setView('landing')}
              className="text-zinc-400 font-bold text-xs uppercase tracking-widest hover:text-primary transition-all"
            >
              Exit Competition
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface text-on-surface font-sans selection:bg-primary/10 selection:text-primary">
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onSignIn={() => setView('signup')}
        onStartQuiz={() => setView('competition')}
      />
      <main className="pt-16">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <Hero />
              <Rewards />
              <HowItWorks />
              <CTA />
            </motion.div>
          )}
          {activeTab === 'resources' && (
            <motion.div
              key="resources"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <Resources />
            </motion.div>
          )}
          {activeTab === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <Dashboard />
            </motion.div>
          )}
          {activeTab === 'leaderboard' && (
            <motion.div
              key="leaderboard"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <Leaderboard />
            </motion.div>
          )}
          {activeTab === 'journey' && (
            <motion.div
              key="journey"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <JourneyTracker />
            </motion.div>
          )}
          {activeTab === 'pulse' && (
            <motion.div
              key="pulse"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <AcademicPulse />
            </motion.div>
          )}
          {activeTab === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <Profile />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}
