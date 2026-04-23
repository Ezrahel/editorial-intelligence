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
  FileText,
  Menu
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useEffect, useState } from 'react';
import SignUp from './components/SignUp';
import Dashboard from './components/Dashboard';
import Leaderboard from './components/Leaderboard';
import AcademicPulse from './components/AcademicPulse';
import Profile from './components/Profile';
import JourneyTracker from './components/JourneyTracker';
import Avatar from './components/Avatar';
import TechQuiz from './components/TechQuiz';
import { isSupabaseConfigured, supabase } from './lib/supabase';
import {
  fallbackLeaderboardRows,
  type AuthUser,
  type LeaderboardEntry,
  type QuizAttempt,
} from './lib/scholar';
import scholarlyLogo from '../logo-content.png';

type AppView = 'landing' | 'signup' | 'quiz';
type AppTab = 'home' | 'resources' | 'dashboard' | 'leaderboard' | 'journey' | 'pulse' | 'profile';
type AuthTarget = 'landing' | 'quiz' | 'profile';

function getRouteState(pathname: string): {
  view: AppView;
  activeTab: AppTab;
  authTarget: AuthTarget;
} {
  switch (pathname) {
    case '/signup':
      return { view: 'signup', activeTab: 'home', authTarget: 'landing' };
    case '/quiz':
      return { view: 'quiz', activeTab: 'home', authTarget: 'quiz' };
    case '/resources':
      return { view: 'landing', activeTab: 'resources', authTarget: 'landing' };
    case '/dashboard':
      return { view: 'landing', activeTab: 'dashboard', authTarget: 'landing' };
    case '/leaderboard':
      return { view: 'landing', activeTab: 'leaderboard', authTarget: 'landing' };
    case '/journey':
      return { view: 'landing', activeTab: 'journey', authTarget: 'landing' };
    case '/pulse':
      return { view: 'landing', activeTab: 'pulse', authTarget: 'landing' };
    case '/profile':
      return { view: 'landing', activeTab: 'profile', authTarget: 'profile' };
    case '/':
    default:
      return { view: 'landing', activeTab: 'home', authTarget: 'landing' };
  }
}

function getPathForRoute(view: AppView, activeTab: AppTab) {
  if (view === 'signup') {
    return '/signup';
  }

  if (view === 'quiz') {
    return '/quiz';
  }

  switch (activeTab) {
    case 'resources':
      return '/resources';
    case 'dashboard':
      return '/dashboard';
    case 'leaderboard':
      return '/leaderboard';
    case 'journey':
      return '/journey';
    case 'pulse':
      return '/pulse';
    case 'profile':
      return '/profile';
    case 'home':
    default:
      return '/';
  }
}

const NotificationsDropdown = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const notifications = [
    { id: 1, title: 'Quiz Starts Soon', desc: 'The Lagos Secondary Schools ICT Quiz prelims begin in 15 minutes.', time: '15m ago', unread: true },
    { id: 2, title: 'New Badge Earned', desc: 'Your school just earned the "Fastest Fingers" badge.', time: '2h ago', unread: true },
    { id: 3, title: 'Study Pack Added', desc: 'A new WAEC Computer Studies revision pack is now available.', time: '5h ago', unread: false },
    { id: 4, title: 'Schedule Updated', desc: 'Inter-school quiz fixtures for this week have been refreshed.', time: '1d ago', unread: false },
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
            className="fixed top-20 right-4 left-4 sm:absolute sm:top-auto sm:left-auto sm:right-0 sm:mt-2 sm:w-[min(20rem,calc(100vw-2rem))] bg-white rounded-[2rem] editorial-shadow border border-zinc-100 z-[70] overflow-hidden"
          >
            <div className="p-4 sm:p-6 border-b border-zinc-50 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
              <h3 className="font-bold text-zinc-900">Notifications</h3>
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Mark all as read</span>
            </div>
            <div className="max-h-[60vh] sm:max-h-96 overflow-y-auto">
              {notifications.map((n) => (
                <div key={n.id} className={`p-4 sm:p-6 hover:bg-zinc-50 transition-all cursor-pointer border-b border-zinc-50 last:border-none ${n.unread ? 'bg-blue-50/30' : ''}`}>
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

const Navbar = ({
  activeTab,
  setActiveTab,
  onSignIn,
  onStartQuiz,
  isAuthenticated,
}: {
  activeTab: AppTab,
  setActiveTab: (tab: AppTab) => void,
  onSignIn: () => void,
  onStartQuiz: () => void,
  isAuthenticated: boolean,
}) => {
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const tabs: Array<{ id: AppTab; label: string }> = [
    { id: 'home', label: 'Home' },
    { id: 'leaderboard', label: 'Leaderboard' },
    { id: 'journey', label: 'Stages' },
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'pulse', label: 'Pulse' },
    { id: 'resources', label: 'Resources' }
  ];

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-sm fixed top-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16 gap-3">
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              type="button"
              aria-label="Toggle navigation menu"
              className="md:hidden -ml-1 mr-2 rounded-full p-2 text-zinc-500 hover:bg-zinc-100 hover:text-primary transition-colors"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            >
              <Menu size={20} />
            </button>
            <button
              type="button"
              aria-label="Scholarly home"
              className="flex items-center justify-center shrink-0 cursor-pointer"
              onClick={() => {
                setActiveTab('home');
                setIsMobileMenuOpen(false);
              }}
            >
              <img
                src={scholarlyLogo}
                alt="Scholarly"
                className="h-14 w-auto object-contain"
              />
            </button>
          </div>
          <div className="hidden md:flex items-center space-x-8 font-sans text-sm tracking-tight">
            {tabs.map((tab) => (
              <button 
                key={tab.id}
                className={`${activeTab === tab.id ? 'text-primary font-bold border-b-2 border-primary' : 'text-zinc-500'} hover:text-primary transition-colors pb-1`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 sm:gap-3 shrink-0 self-stretch">
            <div className="relative">
              <button 
                onClick={() => {
                  setIsNotifOpen(!isNotifOpen);
                  setIsMobileMenuOpen(false);
                }}
                className={`${
                  isNotifOpen ? 'text-primary' : 'text-zinc-500'
                } relative inline-flex h-10 w-10 items-center justify-center self-center rounded-full hover:bg-zinc-100 hover:text-primary transition-colors`}
              >
                <Bell size={20} />
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
              </button>
              <NotificationsDropdown isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
            </div>
            <button 
              className={`${
                activeTab === 'profile' ? 'text-primary' : 'text-zinc-500'
              } inline-flex h-10 w-10 items-center justify-center self-center rounded-full hover:bg-zinc-100 hover:text-primary transition-colors`}
              onClick={() => {
                if (isAuthenticated) {
                  setActiveTab('profile');
                  setIsMobileMenuOpen(false);
                  return;
                }

                onSignIn();
              }}
            >
              <UserCircle size={24} />
            </button>
            <button 
              onClick={onStartQuiz}
              className="inline-flex h-10 items-center justify-center self-center bg-primary hover:bg-primary-container text-white px-3 sm:px-5 rounded-full font-label text-[10px] uppercase tracking-widest transition-all duration-200"
            >
              <span className="hidden sm:inline">Start Quiz</span>
              <span className="sm:hidden">Quiz</span>
            </button>
          </div>
        </div>
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="md:hidden border-t border-zinc-100/80 py-3"
            >
              <div className="grid grid-cols-2 gap-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`rounded-2xl px-3 py-3 text-sm font-bold transition-all ${
                      activeTab === tab.id ? 'bg-primary text-white' : 'bg-zinc-100 text-zinc-500'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

const Hero = () => (
  <section className="relative overflow-hidden bg-surface py-16 md:py-32">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center gap-10 md:gap-16">
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="flex-1 text-left z-10"
      >
        <div className="inline-block px-3 py-1 bg-tertiary-fixed text-tertiary rounded-full font-label text-[10px] uppercase tracking-[0.2em] mb-6">
          Unlock chance to win the Ijesha Tech Price
        </div>
        <h1 className="font-headline text-4xl sm:text-5xl md:text-7xl font-bold tracking-tighter text-on-surface mb-6 leading-tight">
          Ijesha’s <span className="text-gradient-primary">Brightest Future Minds.</span>
        </h1>
        <p className="font-sans text-base sm:text-lg text-secondary max-w-lg mb-8 md:mb-10 leading-relaxed">
          A modern inter-school quiz platform for junior and senior secondary students. Register your school, prepare with past questions, and compete in fair, timed academic contests.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <button className="bg-gradient-to-br from-primary to-primary-container text-white px-6 sm:px-8 py-4 rounded-full font-headline font-bold text-base sm:text-lg editorial-shadow transition-transform hover:scale-[1.02] active:scale-95">
            Register Your School
          </button>
          <button className="bg-zinc-200 text-primary px-6 sm:px-8 py-4 rounded-full font-headline font-bold text-base sm:text-lg hover:bg-zinc-300 transition-colors">
            View Competition Stages
          </button>
        </div>
      </motion.div>
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="flex-1 relative"
      >
        <div className="relative w-full max-w-xl mx-auto aspect-square rounded-[2rem] overflow-hidden editorial-shadow bg-zinc-100">
          <img 
            className="w-full h-full object-cover" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAAsjEFSsL5tO_oLizdr9jXWTT_OFt_UNg1DNnxTtez_5ZSj_xFjevFLzDqeve9P0qFV9D8AIC4wg_SPL--nCdSoYoyoLUouk4kQYpOffckttvlGayg-tkCfpOZMS5Mp9G_nmeYK7NwWNwFuUAqmG8qdjFnnNmBk6abx_UcQKH7EoP0alDKzR8MtuEfzZ4_3IyqBPhxNglWl9J8L74OSxlG8Ts9LZyUm7xDmS_U5r_Y-9oEEmkQPhJpeLd6Q6Ob-3640NDhUht_ZzbL" 
            alt="Students participating in a school quiz competition"
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
              <div className="font-label text-[10px] uppercase tracking-widest text-secondary">Top School This Week</div>
              <div className="font-headline font-extrabold text-primary text-xl">First Place Overall</div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
    <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl"></div>
  </section>
);

const Rewards = () => (
  <section className="bg-zinc-50 py-16 md:py-24">
    <div className="max-w-7xl mx-auto px-4 sm:px-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-12">
        <div>
          <div className="font-label text-xs uppercase tracking-widest text-primary mb-2">Rewards</div>
          <h2 className="font-headline text-3xl md:text-4xl font-bold tracking-tight text-on-surface">What Schools Can Win</h2>
        </div>
        <div className="font-sans text-secondary max-w-xs text-right hidden md:block">
          Strong performance leads to recognition, prizes, and motivation for students and teachers.
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
              <h3 className="font-headline text-3xl font-bold mb-4 group-hover:text-white transition-colors">Grand Prize Package</h3>
              <p className="font-sans text-secondary group-hover:text-white/80 transition-colors text-lg max-w-md">
                Cash awards, school recognition, and academic support for the overall best-performing schools and students.
              </p>
            </div>
            <div className="mt-8 flex items-center gap-2 font-label text-xs uppercase tracking-widest group-hover:text-white transition-colors">
              See Prize Details <ArrowRight size={16} />
            </div>
          </div>
        </motion.div>
        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-white p-8 rounded-[2rem] editorial-shadow group hover:bg-tertiary transition-colors duration-500"
        >
          <Monitor className="text-tertiary group-hover:text-white transition-colors mb-6" size={40} />
          <h3 className="font-headline text-2xl font-bold mb-4 group-hover:text-white transition-colors">School Equipment Support</h3>
          <p className="font-sans text-secondary group-hover:text-white/80 transition-colors">
            Learning devices, internet support, or lab materials for outstanding finalist schools.
          </p>
        </motion.div>
        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-white p-8 rounded-[2rem] editorial-shadow group hover:bg-zinc-800 transition-colors duration-500"
        >
          <BadgeCheck className="text-primary group-hover:text-white transition-colors mb-6" size={40} />
          <h3 className="font-headline text-2xl font-bold mb-4 group-hover:text-white transition-colors">Certificates & Recognition</h3>
          <p className="font-sans text-secondary group-hover:text-white/80 transition-colors">
            Certificates for participants, finalists, and winning schools to celebrate achievement.
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
            <h3 className="font-headline text-3xl font-bold text-white mb-2">School Pride & Community</h3>
            <p className="font-sans text-white/90 max-w-sm">Build healthy academic rivalry and celebrate excellence across participating schools.</p>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

const HowItWorks = () => (
  <section className="bg-surface py-16 md:py-24 relative overflow-hidden">
    <div className="max-w-7xl mx-auto px-4 sm:px-6">
      <div className="flex flex-col lg:flex-row items-start gap-20">
        <div className="lg:w-1/3 lg:sticky lg:top-32">
          <div className="font-label text-xs uppercase tracking-widest text-tertiary mb-4">Competition Order</div>
          <h2 className="font-headline text-4xl md:text-5xl font-bold tracking-tighter text-on-surface mb-8">How the <br/>Quiz Works.</h2>
          <div className="w-16 h-1 bg-primary mb-8"></div>
          <p className="font-sans text-lg text-secondary leading-relaxed">
            The quiz is not just a bunch of planned questions but a momentum to set you on the path of digital world. A plus is, you get access to mock quiz to prepare ahead of the main scheduled quiz for absolute familiarity in the tech world.
          </p>
        </div>
        <div className="lg:w-2/3 space-y-12">
          {[
            {
              num: "01",
              title: "Register and Prepare",
              desc: "Schools create accounts, enroll student teams, and access study materials, rules, and the competition timetable before the first round.",
              color: "group-hover:text-primary"
            },
            {
              num: "02",
              title: "Take the Qualifiers",
              desc: "Students answer timed quiz questions by subject or level. Scores are based on accuracy, speed, and completion of each round.",
              color: "group-hover:text-tertiary",
              offset: true
            },
            {
              num: "03",
              title: "Advance to the Finals",
              desc: "Top schools move on to the final stage, where the best teams compete live for trophies, certificates, and school prizes.",
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
  <section className="bg-primary py-16 md:py-24 text-center relative overflow-hidden">
    <div className="max-w-3xl mx-auto px-4 sm:px-6 relative z-10">
      <h2 className="font-headline text-3xl md:text-5xl font-bold text-white mb-6 md:mb-8 tracking-tight">Ready to put your school on the leaderboard?</h2>
      <p className="font-sans text-base md:text-lg text-white/80 mb-8 md:mb-10">
        Open registration, simple team setup, and competitive quiz rounds designed for secondary school students.
      </p>
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <button className="bg-white text-primary px-8 md:px-10 py-4 md:py-5 rounded-full font-headline font-bold text-lg md:text-xl hover:bg-zinc-100 transition-colors editorial-shadow">
          Register Now
        </button>
        <button className="border border-white/30 text-white px-8 md:px-10 py-4 md:py-5 rounded-full font-headline font-bold text-lg md:text-xl hover:bg-white/10 transition-colors">
          Read Competition Guide
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
    className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12"
  >
    <section className="mb-16 md:mb-20 grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-end">
      <div className="lg:col-span-7">
        <span className="font-label text-xs font-bold tracking-[0.2em] text-tertiary uppercase mb-4 block">Study Resources</span>
        <h1 className="font-headline text-4xl sm:text-5xl md:text-[3.5rem] font-bold leading-tight tracking-[-0.02em] text-on-surface mb-6">
          Quiz Prep <br />
          <span className="text-primary-container">Resources Hub.</span>
        </h1>
        <p className="text-secondary text-lg max-w-xl">
          Practice materials, revision guides, and subject support to help secondary school students prepare for quiz competitions.
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

    <section className="mb-16 bg-zinc-100 rounded-[2rem] md:rounded-full p-2 flex flex-col md:flex-row gap-4 items-stretch md:items-center">
      <div className="relative flex-grow px-4 flex items-center gap-3 min-w-0">
        <Search className="text-zinc-400" size={20} />
        <input 
          className="w-full bg-transparent border-none focus:outline-none font-sans text-on-surface py-4 placeholder:text-zinc-400" 
          placeholder="Find past questions, ICT notes, or revision guides..." 
          type="text" 
        />
      </div>
      <div className="flex gap-2 p-2 overflow-x-auto w-full md:w-auto">
        <button className="bg-white text-primary px-6 py-2 rounded-full font-label text-xs font-bold shadow-sm hover:bg-primary hover:text-white transition-all">ALL MATERIALS</button>
        <button className="text-secondary px-6 py-2 rounded-full font-label text-xs font-bold hover:bg-zinc-200 transition-all">PAST QUESTIONS</button>
        <button className="text-secondary px-6 py-2 rounded-full font-label text-xs font-bold hover:bg-zinc-200 transition-all">STUDY GUIDES</button>
      </div>
    </section>

    <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-12 gap-6 mb-16">
      <div className="md:col-span-4 lg:col-span-8 bg-white rounded-[2rem] p-6 md:p-8 flex flex-col justify-between group cursor-pointer hover:shadow-xl transition-all duration-500">
        <div className="flex justify-between items-start">
          <span className="bg-tertiary-fixed text-tertiary px-4 py-1 rounded-full font-label text-[10px] uppercase font-bold tracking-widest">Featured Pathway</span>
          <ArrowUpRight className="text-tertiary" size={24} />
        </div>
        <div className="mt-12 md:mt-20">
          <h3 className="font-headline text-2xl md:text-3xl font-bold mb-4 group-hover:text-primary transition-colors">Secondary School Quiz Prep Pack</h3>
          <p className="text-secondary mb-6 max-w-md">A focused learning path covering Mathematics, English, Basic Science, Current Affairs, and Computer Studies for school competitions.</p>
          <div className="flex items-center gap-6">
            <div className="flex -space-x-3">
              <Avatar name="Morayo Afolabi" variant="emerald" className="w-10 h-10 rounded-full border-2 border-white text-xs" />
              <Avatar name="Uche Okoye" variant="amber" className="w-10 h-10 rounded-full border-2 border-white text-xs" />
              <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center text-[10px] font-bold text-primary font-label">+1.2k</div>
            </div>
            <span className="font-label text-xs text-zinc-400 uppercase tracking-wider">Used by 1,200+ Students</span>
          </div>
        </div>
      </div>

      <div className="md:col-span-4 bg-primary-container rounded-[2rem] p-6 md:p-8 text-white flex flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-20">
          <Code size={80} strokeWidth={1} />
        </div>
        <div>
          <span className="font-label text-[10px] uppercase tracking-[0.2em] opacity-80">New Module</span>
          <h3 className="font-headline text-2xl font-bold mt-4 leading-tight">Speed and Accuracy Drills</h3>
        </div>
        <button className="bg-white text-primary px-6 py-3 rounded-full font-label text-xs font-bold uppercase tracking-widest self-start mt-12 hover:scale-105 transition-transform">Open Pack</button>
      </div>

      {[
        { icon: Bot, title: "Computer Studies", count: "12 RESOURCES" },
        { icon: Route, title: "Current Affairs", count: "8 TOPICS" },
        { icon: Terminal, title: "Mathematics Practice", count: "24 QUIZZES" },
        { icon: BookOpen, title: "Exam Revision", count: "15 GUIDES" }
      ].map((cat, i) => (
        <div key={i} className="md:col-span-2 lg:col-span-3 bg-zinc-100 rounded-[2rem] p-6 hover:bg-zinc-200 transition-colors cursor-pointer">
          <cat.icon className="text-tertiary mb-4" size={24} />
          <h4 className="font-headline font-bold text-lg mb-2">{cat.title}</h4>
          <p className="text-[10px] text-secondary font-label uppercase tracking-widest">{cat.count}</p>
        </div>
      ))}
    </div>

    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
      <h2 className="font-headline text-2xl font-semibold">Latest Study Materials</h2>
      <a className="font-label text-xs font-bold text-primary border-b-2 border-primary-fixed pb-1 hover:border-primary transition-all" href="#">BROWSE ALL MATERIALS</a>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[
        {
          img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCFcIP_RaZTbsegYhFGMRyXFI3Jx3etlSU80GVXPPK2k72MCOvtrdCvb-v7XwuynkaLgjwPwQqEnc733Ms6ofEPpZe1R92z5iuZ7Bp1mJYSTDMlz0fKsmWeo3RpFIniDxx6Et0GjZ494veu2IkCfiduP-b6uAXgE7kH0_6kxkcwLa7y7xu5Too01tSkA3g90j4eUj3T8QL139wDHh3CKj4oOuci5RZti-xS1lv8G5WVFO_YrYrjLVEgI1A3FqZsC6nP4VmiixVP9PtV",
          tag: "CURRENT AFFAIRS",
          time: "15 MIN READ",
          title: "How to Prepare for School Quiz Current Affairs",
          desc: "A quick guide to helping students stay informed on national events, civic knowledge, and important updates.",
          action: "READ GUIDE",
          icon: Download
        },
        {
          img: "https://lh3.googleusercontent.com/aida-public/AB6AXuC-rJJ3EpX5qq3RiyYr4U6Pka7AkC0nbiYnW6FpmKGMmvrqvxa0V6dBAe9UjqSk9Ffsk6l4-C0pLj5YViVxtdv6csfVS2zoeGDUviwVVqriwWyjOcJsZ7jlTOdPcHnpaVwe6Ahpd5uFXvmr71Gwgpd5QfsgSr9cOenJjgZ-eKiwOfPO1JVE66CnhsdsUJxvPfz5H72h-DzHJL3urScE2I0bOA8VumWHW4sKt34aNvRtfnmiC-E6DADtzJJkJmq5CEzuTemgKjEGFD1J",
          tag: "COMPUTER STUDIES",
          time: "VIDEO COURSE",
          title: "Computer Studies Basics for Quiz Contests",
          desc: "Revise common topics such as hardware, software, operating systems, and internet safety with guided examples.",
          action: "WATCH LESSON",
          icon: PlayCircle
        },
        {
          img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBGrQOdFMgIa-CVY29NHXfJf7m1UZG0AN9NFq0NoqRwkc0kdCJ0sHp93IGRxkUaW-sotGMLTwtjiyHOgHk-_sGBNE8t8MZHPgBAOyquy_8bGebqibR2tFEWJKn8O8GoV9dMvO7vF1khfKSCQ-UPbwMIFknX_8pNHADIjgZkbtIX-wNFfCTB6_pe3vr_opD3fgetx-8iEkrLZs8nj2lWyvj8OJqu8ZLXD5he7GxTQBoDcA4NQ1VqxtE-ix7b05voMdNMF9u9gjqvjySC",
          tag: "PAST QUESTIONS",
          time: "DOWNLOADABLE PDF",
          title: "Inter-School Quiz Practice Questions",
          desc: "A printable set of mixed-subject questions for classroom practice, mock contests, and team preparation.",
          action: "DOWNLOAD PDF",
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
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 md:py-12">
      <div className="flex flex-col md:flex-row justify-between items-center mb-12">
        <div className="mb-8 md:mb-0">
          <div className="font-headline font-bold text-zinc-900 text-xl mb-2">Scholarly Quiz Hub</div>
          <p className="font-label text-[10px] uppercase tracking-widest text-zinc-500">© 2026 Scholarly Quiz Hub. All rights reserved.</p>
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
  const [activeTab, setActiveTab] = useState<AppTab>(() =>
    typeof window === 'undefined' ? 'home' : getRouteState(window.location.pathname).activeTab,
  );
  const [view, setView] = useState<AppView>(() =>
    typeof window === 'undefined' ? 'landing' : getRouteState(window.location.pathname).view,
  );
  const [authTarget, setAuthTarget] = useState<AuthTarget>(() =>
    typeof window === 'undefined' ? 'landing' : getRouteState(window.location.pathname).authTarget,
  );
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authUser, setAuthUser] = useState<AuthUser>(null);
  const [quizAttempts, setQuizAttempts] = useState<QuizAttempt[]>([]);
  const [isLoadingAttempts, setIsLoadingAttempts] = useState(false);
  const [leaderboardEntries, setLeaderboardEntries] = useState<LeaderboardEntry[]>([]);
  const [isLoadingLeaderboard, setIsLoadingLeaderboard] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const syncFromLocation = () => {
      const routeState = getRouteState(window.location.pathname);
      setView(routeState.view);
      setActiveTab(routeState.activeTab);
      setAuthTarget(routeState.authTarget);
    };

    syncFromLocation();

    const recoveryHash = new URLSearchParams(
      window.location.hash.startsWith('#') ? window.location.hash.slice(1) : window.location.hash,
    );

    if (recoveryHash.get('type') === 'recovery') {
      setAuthTarget('landing');
      setView('signup');
    }

    window.addEventListener('popstate', syncFromLocation);

    return () => {
      window.removeEventListener('popstate', syncFromLocation);
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const nextPath = getPathForRoute(view, activeTab);
    const currentPath = window.location.pathname;

    if (currentPath !== nextPath) {
      window.history.pushState({}, '', nextPath);
    }
  }, [activeTab, view]);

  useEffect(() => {
    if (!supabase || !isSupabaseConfigured) {
      setLeaderboardEntries(fallbackLeaderboardRows);
      setIsLoadingLeaderboard(false);
      return;
    }

    const client = supabase!;
    let isMounted = true;

    void client.auth.getSession().then(({ data }) => {
      if (!isMounted) {
        return;
      }

      setAuthUser(
        data.session?.user
          ? {
              id: data.session.user.id,
              email: data.session.user.email ?? null,
              user_metadata: data.session.user.user_metadata,
            }
          : null,
      );
      setIsAuthenticated(Boolean(data.session?.user));
    });

    const {
      data: { subscription },
    } = client.auth.onAuthStateChange((_event, session) => {
      setAuthUser(
        session?.user
          ? {
              id: session.user.id,
              email: session.user.email ?? null,
              user_metadata: session.user.user_metadata,
            }
          : null,
      );
      setIsAuthenticated(Boolean(session?.user));
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!supabase || !isSupabaseConfigured) {
      return;
    }

    const client = supabase!;
    let isCancelled = false;

    async function loadLeaderboard() {
      setIsLoadingLeaderboard(true);

      const { data, error } = await client
        .from('quiz_leaderboard')
        .select('*')
        .order('total_points', { ascending: false })
        .order('average_percentage', { ascending: false });

      if (isCancelled) {
        return;
      }

      if (!error && Array.isArray(data) && data.length > 0) {
        setLeaderboardEntries(
          data.map((entry) => ({
            user_id: String((entry as LeaderboardEntry).user_id),
            full_name: String((entry as LeaderboardEntry).full_name ?? 'Scholar'),
            school_name:
              typeof (entry as LeaderboardEntry).school_name === 'string'
                ? (entry as LeaderboardEntry).school_name
                : null,
            grade_level:
              typeof (entry as LeaderboardEntry).grade_level === 'string'
                ? (entry as LeaderboardEntry).grade_level
                : null,
            attempts_count: Number((entry as LeaderboardEntry).attempts_count ?? 0),
            total_points: Number((entry as LeaderboardEntry).total_points ?? 0),
            average_percentage: Number((entry as LeaderboardEntry).average_percentage ?? 0),
            best_score: Number((entry as LeaderboardEntry).best_score ?? 0),
            last_completed_at:
              typeof (entry as LeaderboardEntry).last_completed_at === 'string'
                ? (entry as LeaderboardEntry).last_completed_at
                : null,
          })),
        );
      } else {
        setLeaderboardEntries(fallbackLeaderboardRows);
      }

      setIsLoadingLeaderboard(false);
    }

    void loadLeaderboard();

    return () => {
      isCancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!authUser || !supabase) {
      setQuizAttempts([]);
      setIsLoadingAttempts(false);
      return;
    }

    const client = supabase!;
    let isCancelled = false;

    async function loadAttempts() {
      setIsLoadingAttempts(true);

      const { data, error } = await client.rpc('get_my_quiz_attempts');

      if (isCancelled) {
        return;
      }

      if (!error && Array.isArray(data)) {
        setQuizAttempts(
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
        setQuizAttempts([]);
      }

      setIsLoadingAttempts(false);
    }

    void loadAttempts();

    return () => {
      isCancelled = true;
    };
  }, [authUser]);

  const openAuth = (target: AuthTarget = 'landing') => {
    setAuthTarget(target);
    setView('signup');
  };

  const handleAuthenticated = () => {
    if (authTarget === 'quiz') {
      setView('quiz');
      return;
    }

    setView('landing');

    if (authTarget === 'profile') {
      setActiveTab('profile');
    }
  };

  const handleSignOut = async () => {
    if (!supabase) {
      return;
    }

    await supabase.auth.signOut();
    setActiveTab('home');
    setView('landing');
  };

  if (view === 'signup') {
    return (
      <SignUp
        onAuthenticated={handleAuthenticated}
        onCancel={() => setView(authTarget === 'quiz' ? 'quiz' : 'landing')}
      />
    );
  }

  if (view === 'quiz') {
    return (
      <div className="min-h-screen bg-zinc-50">
        <Navbar 
          activeTab={activeTab} 
          setActiveTab={(tab) => {
            setActiveTab(tab);
            setView('landing');
          }}
          onSignIn={() => openAuth('quiz')}
          onStartQuiz={() => setView('quiz')}
          isAuthenticated={isAuthenticated}
        />
        <div className="pt-16">
          <TechQuiz onRequireAuth={() => openAuth('quiz')} />
          <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 flex justify-center">
            <button 
              onClick={() => setView('landing')}
              className="text-zinc-400 font-bold text-xs uppercase tracking-widest hover:text-primary transition-all"
            >
              Exit Quiz
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
        onSignIn={() => openAuth('profile')}
        onStartQuiz={() => setView('quiz')}
        isAuthenticated={isAuthenticated}
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
              <Dashboard
                user={authUser}
                attempts={quizAttempts}
                leaderboardEntries={leaderboardEntries}
                isLoading={isLoadingAttempts || isLoadingLeaderboard}
              />
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
              <Leaderboard
                currentUser={authUser}
                entries={leaderboardEntries}
                currentUserId={authUser?.id ?? null}
                isLoading={isLoadingLeaderboard}
              />
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
              <JourneyTracker
                user={authUser}
                attempts={quizAttempts}
                leaderboardEntries={leaderboardEntries}
              />
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
              <AcademicPulse
                user={authUser}
                attempts={quizAttempts}
                leaderboardEntries={leaderboardEntries}
                isLoading={isLoadingAttempts || isLoadingLeaderboard}
              />
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
              <Profile
                user={authUser}
                attemptsOverride={quizAttempts}
                isLoadingAttemptsOverride={isLoadingAttempts}
                onSignOut={handleSignOut}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}
