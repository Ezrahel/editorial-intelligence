import { useEffect, useState } from 'react';
import TechQuiz from './components/TechQuiz';
import { isSupabaseConfigured, supabase } from './lib/supabase';
import { type AuthUser } from './lib/scholar';
import scholarlyLogo from '../logo-content.png';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authUser, setAuthUser] = useState<AuthUser>(null);

  useEffect(() => {
    if (!supabase || !isSupabaseConfigured) {
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

  return (
    <div className="min-h-screen bg-surface">
      <nav className="bg-white/80 backdrop-blur-md shadow-sm fixed top-0 w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <img
                src={scholarlyLogo}
                alt="Scholarly"
                className="h-14 w-auto object-contain"
              />
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:block">
                <span className="text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full">
                  MVP Launch: Tech Quiz
                </span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-16">
        <TechQuiz />
      </main>

      <footer className="bg-white border-t border-zinc-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 text-center">
          <div className="font-headline font-bold text-zinc-900 text-xl mb-2">Scholarly Quiz Hub</div>
          <p className="font-label text-[10px] uppercase tracking-widest text-zinc-500">
            © 2026 Scholarly Quiz Hub. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
