import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAuthorized: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: any }>;
  signOut: () => Promise<void>;
  checkAuthorization: (userEmail?: string) => Promise<boolean>;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  const checkAuthorization = async (userEmail?: string): Promise<boolean> => {
    const emailToCheck = userEmail || user?.email;
    if (!emailToCheck) {
      setIsAuthorized(false);
      return false;
    }

    try {
      console.log('🔍 Checking authorization for:', emailToCheck);
      const { data, error } = await supabase
        .rpc('is_authorized_user', { user_email: emailToCheck });

      if (error) {
        console.error('❌ Authorization check error:', error);
        return false;
      }

      const authorized = Boolean(data);
      console.log('✅ Authorization result:', authorized);
      setIsAuthorized(authorized);
      return authorized;
    } catch (error) {
      console.error('❌ Authorization check failed:', error);
      return false;
    }
  };

  const refreshAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      console.log('🔄 Refreshing auth, session:', session?.user?.email);
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user?.email) {
        await checkAuthorization(session.user.email);
      }
    } catch (error) {
      console.error('❌ Auth refresh failed:', error);
    }
  };

  // Check authorization when user changes
  useEffect(() => {
    if (user?.email) {
      console.log('👤 User changed, checking authorization for:', user.email);
      checkAuthorization(user.email);
    } else {
      setIsAuthorized(false);
    }
  }, [user?.email]);

  // Set up auth state change listener - SIMPLIFIED FOR RELIABILITY
  useEffect(() => {
    console.log('🚀 Setting up auth listener');
    
    // First, get initial session synchronously
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('❌ Error getting initial session:', error);
        } else {
          console.log('🏁 Initial session loaded:', session?.user?.email);
          setSession(session);
          setUser(session?.user ?? null);
        }
      } catch (error) {
        console.error('❌ Failed to get initial session:', error);
      } finally {
        setLoading(false);
      }
    };

    // Set up listener for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('🔔 Auth state changed:', event, session?.user?.email);
        
        // CRITICAL: Only synchronous operations here
        setSession(session);
        setUser(session?.user ?? null);
        
        // If this is after initial load, authorization check can be deferred
        if (session?.user?.email && !loading) {
          setTimeout(() => {
            checkAuthorization(session.user.email);
          }, 0);
        }
      }
    );

    // Load initial session
    getInitialSession();

    return () => {
      console.log('🧹 Cleaning up auth subscription');
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    if (!email || !password) {
      return { error: { message: 'Email y contraseña son requeridos' } };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password
      });

      if (error) {
        return { error };
      }

      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const signOut = async () => {
    try {
      setIsAuthorized(false);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
      isAuthorized,
      signIn,
      signOut,
      checkAuthorization,
      refreshAuth
    }}>
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