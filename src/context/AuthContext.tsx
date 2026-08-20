import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../supabaseClient';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Debug: check what's in localStorage at mount time
    const storageKeys = Object.keys(localStorage).filter(k => k.startsWith('sb-'));
    console.log('[Auth] Mount - Supabase keys in localStorage:', storageKeys);
    console.log('[Auth] Mount - URL hash:', window.location.hash ? 'present' : 'none');

    // Set up the auth state listener FIRST (Supabase v2 recommended pattern).
    // This fires INITIAL_SESSION synchronously with any persisted session.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('[Auth] onAuthStateChange:', event, session ? 'session exists' : 'no session');
      setSession(session);
      setUser(session?.user ?? null);

      if (event === 'INITIAL_SESSION') {
        setLoading(false);
      }
    });

    // Fallback: if INITIAL_SESSION didn't fire (edge case), resolve loading via getSession
    const fallbackTimer = setTimeout(() => {
      setLoading(prev => {
        if (prev) {
          console.log('[Auth] Fallback: loading was still true, resolving via getSession');
          supabase.auth.getSession().then(({ data: { session } }) => {
            console.log('[Auth] getSession fallback:', session ? 'session exists' : 'no session');
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
          });
        }
        return prev;
      });
    }, 1000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(fallbackTimer);
    };
  }, []);

  const signInWithEmail = async (email: string, pass: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: pass,
    });
    if (error) {
      console.error('Error logging in:', error.message);
      throw error;
    }
  };

  const signUpWithEmail = async (email: string, pass: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password: pass,
    });
    if (error) {
      console.error('Error signing up:', error.message);
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    });
    if (error) {
      console.error('Error logging in with Google:', error.message);
      throw error;
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error logging out:', error.message);
    } else {
      setSession(null);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ session, user, signInWithEmail, signUpWithEmail, signInWithGoogle, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
