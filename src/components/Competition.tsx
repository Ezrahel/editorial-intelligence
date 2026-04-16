import { motion } from 'motion/react';
import { 
  Clock, 
  Trophy, 
  ChevronRight,
  AlertCircle,
  Zap,
  Users,
  Timer as TimerIcon,
  Keyboard
} from 'lucide-react';
import { useState, useEffect } from 'react';

const mockQuestions = [
  {
    id: 1,
    text: "Which of the following is a primary storage device?",
    options: [
      { id: 'A', text: 'Hard Disk' },
      { id: 'B', text: 'RAM' },
      { id: 'C', text: 'CD-ROM' },
      { id: 'D', text: 'Flash Drive' }
    ],
    correct: 'B'
  },
  {
    id: 2,
    text: "The set of instructions that tells the computer what to do is called?",
    options: [
      { id: 'A', text: 'Hardware' },
      { id: 'B', text: 'Software' },
      { id: 'C', text: 'Firmware' },
      { id: 'D', text: 'Middleware' }
    ],
    correct: 'B'
  },
  {
    id: 3,
    text: "Which of the following is an example of an operating system?",
    options: [
      { id: 'A', text: 'Microsoft Word' },
      { id: 'B', text: 'Google Chrome' },
      { id: 'C', text: 'Windows 10' },
      { id: 'D', text: 'Adobe Reader' }
    ],
    correct: 'C'
  },
  {
    id: 4,
    text: "In computer networking, the acronym 'LAN' stands for?",
    options: [
      { id: 'A', text: 'Local Area Network' },
      { id: 'B', text: 'Low Area Network' },
      { id: 'C', text: 'Large Area Network' },
      { id: 'D', text: 'Long Area Network' }
    ],
    correct: 'A'
  },
  {
    id: 5,
    text: "Which of the following is a high-level programming language?",
    options: [
      { id: 'A', text: 'Machine language' },
      { id: 'B', text: 'Assembly language' },
      { id: 'C', text: 'BASIC' },
      { id: 'D', text: 'Low-level language' }
    ],
    correct: 'C'
  }
];

export default function Competition() {
  const [totalTime, setTotalTime] = useState(892); // 14:52 in seconds
  const initialTotalTime = 900; // 15:00
  const [questionTime, setQuestionTime] = useState(60); // 60 seconds per question
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const totalQuestions = mockQuestions.length;

  useEffect(() => {
    const timer = setInterval(() => {
      setTotalTime((prev) => (prev > 0 ? prev - 1 : 0));
      setQuestionTime((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleNextQuestion = () => {
    if (currentQuestionIdx < totalQuestions - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
      setQuestionTime(60);
      setSelectedOption(null);
    }
  };

  const currentQuestion = mockQuestions[currentQuestionIdx];

  return (
    <div className="min-h-screen bg-zinc-50 font-sans">
      {/* Total Time Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-zinc-100 z-[60]">
        <motion.div 
          initial={{ width: '100%' }}
          animate={{ width: `${(totalTime / initialTotalTime) * 100}%` }}
          className="h-full bg-primary"
        />
      </div>

      {/* Quiz Header */}
      <div className="bg-white border-b border-zinc-100 p-8 pt-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div>
            <span className="bg-blue-100 text-blue-600 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4 inline-block">Computer Studies (WASSCE)</span>
            <h1 className="text-5xl font-bold font-headline text-zinc-900 tracking-tighter">
              Competition <span className="text-primary italic">Tier III</span>
            </h1>
          </div>
          
          <div className="flex gap-12">
            <div className="text-right">
              <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest block mb-1">Total Time Remaining</span>
              <span className="text-4xl font-black text-primary">{formatTime(totalTime)}</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest block mb-1">Current Score</span>
              <span className="text-4xl font-black text-zinc-900">850</span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar & Question Timer */}
      <div className="max-w-7xl mx-auto px-8 mt-8 grid grid-cols-1 md:grid-cols-4 gap-8 items-end">
        <div className="md:col-span-3">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Question {(currentQuestionIdx + 1).toString().padStart(2, '0')} / {totalQuestions}</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">{Math.round(((currentQuestionIdx + 1) / totalQuestions) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-zinc-200 h-2 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: '0%' }}
              animate={{ width: `${((currentQuestionIdx + 1) / totalQuestions) * 100}%` }}
              className="bg-primary h-full rounded-full" 
            />
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl editorial-shadow border border-zinc-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center">
              <Clock size={16} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Question Timer</span>
          </div>
          <span className={`text-xl font-black ${questionTime < 10 ? 'text-red-500 animate-pulse' : 'text-zinc-900'}`}>
            0:{questionTime.toString().padStart(2, '0')}
          </span>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Question Section */}
          <div className="lg:col-span-8 bg-white p-12 rounded-[3rem] editorial-shadow">
            <h2 className="text-3xl font-bold font-headline text-zinc-900 leading-tight mb-12">
              {currentQuestion.text}
            </h2>

            <div className="space-y-4">
              {currentQuestion.options.map((opt) => (
                <div 
                  key={opt.id}
                  onClick={() => setSelectedOption(opt.id)}
                  className={`p-6 rounded-2xl border-2 cursor-pointer transition-all flex items-center gap-6 ${selectedOption === opt.id ? 'border-primary bg-blue-50/50' : 'border-zinc-50 hover:border-zinc-100'}`}
                >
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedOption === opt.id ? 'border-primary bg-primary' : 'border-zinc-200'}`}>
                    {selectedOption === opt.id && <div className="w-2 h-2 bg-white rounded-full" />}
                  </div>
                  <span className={`font-medium ${selectedOption === opt.id ? 'text-primary' : 'text-zinc-600'}`}>{opt.text}</span>
                </div>
              ))}
            </div>

            <div className="mt-16 flex justify-between items-center">
              <button className="flex items-center gap-2 text-zinc-400 font-bold text-xs uppercase tracking-widest hover:text-zinc-600 transition-all">
                <AlertCircle size={18} />
                Report Issue
              </button>
              <div className="flex gap-4">
                <button 
                  onClick={handleNextQuestion}
                  className="px-10 py-4 bg-zinc-100 text-zinc-500 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-zinc-200 transition-all"
                >
                  Skip Question
                </button>
                <button 
                  onClick={handleNextQuestion}
                  disabled={!selectedOption}
                  className={`px-10 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all editorial-shadow ${
                    selectedOption 
                      ? 'bg-primary text-white hover:bg-primary-container' 
                      : 'bg-zinc-100 text-zinc-300 cursor-not-allowed'
                  }`}
                >
                  Confirm Answer
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar Analytics */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-zinc-100 p-8 rounded-[2.5rem]">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-8">Subject Analytics</h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-primary">
                    <Zap size={18} />
                    <span className="text-xs font-bold text-zinc-900">Difficulty</span>
                  </div>
                  <span className="text-xs font-medium text-zinc-500">Mastery Level</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-primary">
                    <TimerIcon size={18} />
                    <span className="text-xs font-bold text-zinc-900">Avg. Time</span>
                  </div>
                  <span className="text-xs font-medium text-zinc-500">42s / Question</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-primary">
                    <Users size={18} />
                    <span className="text-xs font-bold text-zinc-900">Success Rate</span>
                  </div>
                  <span className="text-xs font-medium text-zinc-500">24% Globally</span>
                </div>
              </div>
            </div>

            <div className="bg-zinc-900 rounded-[2.5rem] overflow-hidden relative group">
              <img 
                src="https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=2070&auto=format&fit=crop" 
                className="w-full h-64 object-cover opacity-50 group-hover:scale-110 transition-all duration-700"
                alt="Quantum Visualization"
              />
              <div className="absolute inset-0 p-8 flex flex-col justify-end">
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/60 mb-2 block">Educational Resource</span>
                <p className="text-xs text-white/80 leading-relaxed">Basic computer system architecture and data networking concepts</p>
              </div>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] border border-zinc-100">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-6">Hotkeys</h3>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <span className="bg-zinc-100 px-2 py-1 rounded text-[10px] font-mono font-bold">1-4</span>
                  <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Select</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-zinc-100 px-2 py-1 rounded text-[10px] font-mono font-bold">ENTER</span>
                  <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Submit</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
