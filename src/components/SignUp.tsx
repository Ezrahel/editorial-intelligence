import { motion } from 'motion/react';
import { Chrome, ArrowRight } from 'lucide-react';
import Avatar from './Avatar';

interface SignUpProps {
  onLogin: () => void;
  onSignUp: () => void;
}

export default function SignUp({ onLogin, onSignUp }: SignUpProps) {
  return (
    <div className="min-h-screen flex font-sans">
      {/* Left Side - Image & Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-primary">
        <img 
          src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop" 
          alt="Digital Scholar"
          className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/90 to-transparent" />
        
        <div className="relative z-10 flex flex-col justify-end p-16 text-white h-full">
          <div className="w-12 h-1 bg-white mb-8" />
          <h2 className="text-4xl font-bold font-headline mb-4 leading-tight">
            The Future of Nigerian Tech Starts Here.
          </h2>
          <p className="text-xl text-white/80 mb-12">Join the Elite League.</p>
          
          <div className="flex items-center gap-4">
            <div className="flex -space-x-2">
              {[
                { name: 'Chidi Adekunle', variant: 'emerald' as const },
                { name: 'Zainab Bello', variant: 'coral' as const },
                { name: 'Tolu Akinola', variant: 'blue' as const },
              ].map((person) => (
                <Avatar
                  key={person.name}
                  name={person.name}
                  variant={person.variant}
                  className="w-10 h-10 rounded-full border-2 border-white text-xs"
                />
              ))}
              <div className="w-10 h-10 rounded-full border-2 border-white bg-primary-container flex items-center justify-center text-[10px] font-bold">
                500+
              </div>
            </div>
            <span className="font-label text-xs uppercase tracking-widest font-bold">Scholars Registered</span>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 bg-white flex flex-col justify-center px-8 md:px-24 py-12">
        <div className="max-w-md w-full mx-auto">
          <div className="mb-12">
            <h1 className="text-primary font-bold italic tracking-tighter text-xl mb-1">THE DIGITAL SCHOLAR</h1>
            <p className="text-zinc-400 font-label text-[10px] uppercase tracking-[0.2em] mb-8">Nigeria's Academic Frontier</p>
            
            <h2 className="text-2xl font-bold font-headline text-zinc-900 mb-2">Create your account</h2>
            <p className="text-zinc-500">Step into the arena of excellence.</p>
          </div>

          <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); onSignUp(); }}>
            <div>
              <label className="block font-label text-[10px] uppercase tracking-widest font-bold text-primary mb-2">Full Name</label>
              <input 
                type="text" 
                placeholder="Chidi Adekunle"
                className="w-full px-4 py-4 bg-zinc-50 border-none rounded-lg focus:ring-2 focus:ring-primary/20 transition-all outline-none"
              />
            </div>

            <div>
              <label className="block font-label text-[10px] uppercase tracking-widest font-bold text-primary mb-2">School Name</label>
              <input 
                type="text" 
                placeholder="Potter and Clay, Iloko"
                className="w-full px-4 py-4 bg-zinc-50 border-none rounded-lg focus:ring-2 focus:ring-primary/20 transition-all outline-none"
              />
            </div>

            <div>
              <label className="block font-label text-[10px] uppercase tracking-widest font-bold text-primary mb-2">Grade Level</label>
              <select className="w-full px-4 py-4 bg-zinc-50 border-none rounded-lg focus:ring-2 focus:ring-primary/20 transition-all outline-none appearance-none">
                <option>Select your class</option>
                <option>SS1</option>
                <option>SS2</option>
                <option>SS3</option>
              </select>
            </div>

            <div>
              <label className="block font-label text-[10px] uppercase tracking-widest font-bold text-primary mb-2">Password</label>
              <input 
                type="password" 
                placeholder="••••••••"
                className="w-full px-4 py-4 bg-zinc-50 border-none rounded-lg focus:ring-2 focus:ring-primary/20 transition-all outline-none"
              />
            </div>

            <button className="w-full bg-primary hover:bg-primary-container text-white font-bold py-4 rounded-lg transition-all editorial-shadow">
              Create Account
            </button>
          </form>

          <div className="relative my-10">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-100"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase tracking-widest font-bold text-zinc-400">
              <span className="bg-white px-4">Or continue with</span>
            </div>
          </div>

          <button className="w-full flex items-center justify-center gap-3 py-4 border border-zinc-100 rounded-lg hover:bg-zinc-50 transition-all font-bold text-zinc-700">
            <Chrome size={20} className="text-red-500" />
            Google
          </button>

          <p className="mt-12 text-center text-zinc-500 text-sm">
            Already an elite member? <button onClick={onLogin} className="text-primary font-bold hover:underline">Log in here</button>
          </p>

          <div className="mt-24 flex justify-between items-center text-[10px] font-label uppercase tracking-widest text-zinc-400">
            <span>© 2026 TDS Excellence</span>
            <div className="flex gap-4">
              <a href="#" className="hover:text-primary">Privacy</a>
              <a href="#" className="hover:text-primary">Terms</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
