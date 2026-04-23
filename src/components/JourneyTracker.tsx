import { motion } from 'motion/react';
import { ArrowRight, BookOpen, Brain, CheckCircle2, Code2, Cpu, Database, Lock, Star, Target, Trophy, Zap } from 'lucide-react';
import { buildScholarInsights, type AuthUser, type LeaderboardEntry, type QuizAttempt } from '../lib/scholar';

interface Module {
  id: string;
  title: string;
  status: 'completed' | 'current' | 'locked';
  description: string;
  icon: typeof BookOpen;
}

interface Tier {
  id: string;
  name: string;
  status: 'completed' | 'current' | 'locked';
  modules: Module[];
}

function buildJourneyData(insights: ReturnType<typeof buildScholarInsights>): Tier[] {
  const hasStrongFoundation = insights.completedCount >= 1;
  const hasSpecialistProgress = insights.completedCount >= 4 || insights.averageAccuracy >= 65;
  const hasEliteProgress = insights.completedCount >= 8 || insights.bestScore >= 45;

  return [
    {
      id: 'tier-1',
      name: 'Tier I: Foundation',
      status: hasStrongFoundation ? 'completed' : 'current',
      modules: [
        {
          id: 'm1',
          title: `${insights.gradeLevel} digital literacy`,
          status: hasStrongFoundation ? 'completed' : 'current',
          description: `Core quiz readiness for ${insights.gradeLevel} learners and first-round confidence building.`,
          icon: BookOpen,
        },
        {
          id: 'm2',
          title: 'Intro to programming logic',
          status: hasStrongFoundation ? 'completed' : 'current',
          description: `Built around ${insights.firstName}'s current focus: ${insights.recommendedFocus}.`,
          icon: Code2,
        },
        {
          id: 'm3',
          title: 'Data fundamentals',
          status: hasStrongFoundation ? 'completed' : 'locked',
          description: 'Understanding how information moves through devices, networks, and storage.',
          icon: Database,
        },
      ],
    },
    {
      id: 'tier-2',
      name: 'Tier II: Specialist',
      status: hasEliteProgress ? 'completed' : hasSpecialistProgress ? 'current' : 'locked',
      modules: [
        {
          id: 'm4',
          title: 'Advanced algorithms',
          status: hasSpecialistProgress ? 'completed' : 'locked',
          description: `Unlocked as claimed quizzes and accuracy improve beyond ${insights.averageAccuracy}%.`,
          icon: Cpu,
        },
        {
          id: 'm5',
          title: 'Machine learning basics',
          status: hasEliteProgress ? 'completed' : hasSpecialistProgress ? 'current' : 'locked',
          description: `Current stage for ${insights.firstName}: ${insights.stageLabel}.`,
          icon: Brain,
        },
        {
          id: 'm6',
          title: 'Cloud architecture',
          status: hasEliteProgress ? 'current' : 'locked',
          description: 'Designed for learners already building repeatable strong quiz scores.',
          icon: Zap,
        },
      ],
    },
    {
      id: 'tier-3',
      name: 'Tier III: Elite',
      status: hasEliteProgress ? 'current' : 'locked',
      modules: [
        {
          id: 'm7',
          title: 'Quantum computing',
          status: hasEliteProgress ? 'current' : 'locked',
          description: 'High-difficulty conceptual rounds reserved for top-performing students.',
          icon: Target,
        },
        {
          id: 'm8',
          title: 'Cybersecurity defense',
          status: hasEliteProgress ? 'current' : 'locked',
          description: `A strong next step once ${insights.firstName} consistently scores above 45/50.`,
          icon: Lock,
        },
        {
          id: 'm9',
          title: 'AI ethics & governance',
          status: hasEliteProgress ? 'current' : 'locked',
          description: 'Capstone decision-making track for students approaching national finals.',
          icon: Star,
        },
      ],
    },
  ];
}

export default function JourneyTracker({
  user,
  attempts,
  leaderboardEntries,
}: {
  user: AuthUser;
  attempts: QuizAttempt[];
  leaderboardEntries: LeaderboardEntry[];
}) {
  const insights = buildScholarInsights(user, attempts, leaderboardEntries);
  const journeyData = buildJourneyData(insights);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12">
      <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-12 md:mb-16">
        <div className="min-w-0">
          <span className="font-label text-[10px] uppercase tracking-[0.2em] text-primary font-bold mb-4 block">Scholarly Path</span>
          <h1 className="font-headline text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter text-zinc-900">
            {insights.firstName}'s Digital <br />
            <span className="text-primary italic">Scholar Journey.</span>
          </h1>
          <p className="mt-4 max-w-2xl text-sm sm:text-base text-zinc-500">
            This pathway now adapts to {insights.fullName}'s claimed quiz record, performance level, and current class stage.
          </p>
        </div>

        <div className="bg-zinc-900 p-6 sm:p-8 rounded-[2.5rem] text-white editorial-shadow w-full md:w-auto md:min-w-[300px]">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center">
              <Trophy size={24} />
            </div>
            <div className="min-w-0">
              <h3 className="font-bold">Current Status</h3>
              <p className="text-xs text-white/60 uppercase tracking-widest font-bold">{insights.stageLabel}</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-white/40">
              <span>Overall Progress</span>
              <span>{insights.progressPercent}%</span>
            </div>
            <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: `${insights.progressPercent}%` }} className="bg-primary h-full rounded-full" />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-16 md:space-y-24 relative">
        <div className="absolute left-[23px] top-8 bottom-8 w-0.5 bg-zinc-100 hidden md:block" />

        {journeyData.map((tier) => (
          <div key={tier.id} className="relative">
            <div className="flex items-center gap-4 sm:gap-6 mb-8 sm:mb-12 relative z-10">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center border-4 border-white editorial-shadow ${
                  tier.status === 'completed' ? 'bg-green-500 text-white' : tier.status === 'current' ? 'bg-primary text-white' : 'bg-zinc-200 text-zinc-400'
                }`}
              >
                {tier.status === 'completed' ? <CheckCircle2 size={24} /> : tier.status === 'current' ? <Star size={24} /> : <Lock size={20} />}
              </div>
              <div className="min-w-0">
                <h2 className={`text-2xl sm:text-3xl font-bold font-headline ${tier.status === 'locked' ? 'text-zinc-300' : 'text-zinc-900'}`}>{tier.name}</h2>
                <p className="text-xs font-bold uppercase tracking-widest text-zinc-400">
                  {tier.status === 'completed' ? 'Tier Mastered' : tier.status === 'current' ? 'Active Progression' : 'Locked Tier'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 ml-0 md:ml-16">
              {tier.modules.map((module) => (
                <motion.div
                  key={module.id}
                  whileHover={{ y: -5 }}
                  className={`p-6 sm:p-8 rounded-[2.5rem] border transition-all relative overflow-hidden ${
                    module.status === 'completed'
                      ? 'bg-white border-zinc-100 editorial-shadow'
                      : module.status === 'current'
                        ? 'bg-white border-primary shadow-[0_20px_40px_rgba(43,55,166,0.1)] ring-1 ring-primary/20'
                        : 'bg-zinc-50 border-transparent opacity-60 grayscale'
                  }`}
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-start mb-6">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                        module.status === 'completed'
                          ? 'bg-green-50 text-green-600'
                          : module.status === 'current'
                            ? 'bg-primary/10 text-primary'
                            : 'bg-zinc-100 text-zinc-400'
                      }`}
                    >
                      <module.icon size={24} />
                    </div>
                    {module.status === 'completed' && <CheckCircle2 className="text-green-500 self-start sm:self-auto" size={20} />}
                    {module.status === 'current' && (
                      <span className="self-start bg-primary text-white text-[8px] font-bold px-2 py-1 rounded-full uppercase tracking-widest animate-pulse">
                        In Progress
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-lg mb-2 text-zinc-900">{module.title}</h3>
                  <p className="text-zinc-500 text-xs leading-relaxed mb-8">{module.description}</p>

                  <div className="flex items-center justify-between mt-auto">
                    <button
                      className={`text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 transition-colors ${
                        module.status === 'locked' ? 'text-zinc-400 cursor-not-allowed' : 'text-primary hover:text-primary-container'
                      }`}
                    >
                      {module.status === 'completed' ? 'Review Module' : module.status === 'current' ? 'Continue Learning' : 'Locked'}
                      <ArrowRight size={14} />
                    </button>
                  </div>

                  <div className="absolute -bottom-4 -right-4 opacity-[0.03] pointer-events-none">
                    <module.icon size={120} strokeWidth={1} />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-20 md:mt-32 p-8 sm:p-12 rounded-[2.5rem] md:rounded-[3.5rem] bg-gradient-to-br from-zinc-900 to-zinc-800 text-white text-center relative overflow-hidden editorial-shadow">
        <div className="relative z-10 max-w-2xl mx-auto">
          <Trophy size={56} className="mx-auto mb-6 sm:mb-8 text-primary" />
          <h2 className="text-3xl sm:text-4xl font-bold font-headline mb-4">The Ultimate Goal: Elite Status</h2>
          <p className="text-white/60 mb-10 leading-relaxed">
            Keep moving from school-level readiness to national-tech competition confidence with a track shaped by your latest results.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white/10 px-6 py-3 rounded-xl border border-white/10">
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/40 block mb-1">Current Best</span>
              <span className="font-bold text-sm">{insights.bestScore}/50 Score</span>
            </div>
            <div className="bg-white/10 px-6 py-3 rounded-xl border border-white/10">
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/40 block mb-1">Next Focus</span>
              <span className="font-bold text-sm">{insights.upcomingRound}</span>
            </div>
          </div>
        </div>

        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-10 left-10 w-64 h-64 bg-primary rounded-full blur-[120px]" />
          <div className="absolute bottom-10 right-10 w-64 h-64 bg-blue-500 rounded-full blur-[120px]" />
        </div>
      </div>
    </motion.div>
  );
}
