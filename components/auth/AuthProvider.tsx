"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

// Minimal local types to avoid depending on @supabase/supabase-js types at dev time.
type SupabaseUser = { id: string; email?: string | null };
type SupabaseSession = { user?: SupabaseUser } | null;
type AuthChangeEvent = string;

type User = {
  id: string;
  email?: string | null;
};

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    (async () => {
      const { data } = await supabase.auth.getSession();
  const s = data.session as SupabaseSession;
      if (mounted) {
        if (s && s.user) {
          setUser({ id: s.user.id, email: s.user.email });
        }
        setLoading(false);
      }
    })();

    const { data: listener } = supabase.auth.onAuthStateChange((event: AuthChangeEvent, session: SupabaseSession) => {
      if (session && session.user) {
        setUser({ id: session.user.id, email: session.user.email });
      } else {
        setUser(null);
      }
    });

    return () => {
      mounted = false;
      listener?.subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
  };

  const signUp = async (email: string, password: string) => {
    setLoading(true);
    await supabase.auth.signUp({ email, password });
    setLoading(false);
  };

  const signOut = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
