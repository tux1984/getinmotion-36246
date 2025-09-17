
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';
import { useSecurityMonitoring } from '@/hooks/useSecurityMonitoring';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAuthorized: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: any }>;
  signOut: () => Promise<void>;
  checkAuthorization: () => Promise<boolean>;
  debugInfo: {
    authStateChangeCount: number;
    lastAuthEvent: string | null;
    authorizationAttempts: number;
  };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [debugInfo, setDebugInfo] = useState({
    authStateChangeCount: 0,
    lastAuthEvent: null as string | null,
    authorizationAttempts: 0
  });

  // Simplified security monitoring
  const { recordFailedAttempt, recordSuccessfulLogin, isRateLimited } = useSecurityMonitoring();

  const checkAuthorization = async (): Promise<boolean> => {
    if (!user?.email) {
      setIsAuthorized(false);
      return false;
    }

    try {
      setDebugInfo(prev => ({ ...prev, authorizationAttempts: prev.authorizationAttempts + 1 }));

      const { data, error } = await supabase
        .from('admin_users')
        .select('email, is_active')
        .eq('email', user.email)
        .eq('is_active', true)
        .maybeSingle();

      if (error) {
        console.error('Authorization check error:', error);
        setIsAuthorized(false);
        return false;
      }

      const authorized = !!data;
      setIsAuthorized(authorized);
      return authorized;
    } catch (error) {
      console.error('Authorization check failed:', error);
      setIsAuthorized(false);
      return false;
    }
  };

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (!mounted) return;
        
        if (error) {
          console.error('Error getting session:', error);
          setLoading(false);
          return;
        }

        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      } catch (error) {
        console.error('Failed to initialize auth:', error);
        if (mounted) {
          setIsAuthorized(false);
          setLoading(false);
        }
      }
    };

    // Auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!mounted) return;

        console.log('Auth state change:', event, session?.user?.email);
        
        setDebugInfo(prev => ({ 
          ...prev, 
          authStateChangeCount: prev.authStateChangeCount + 1,
          lastAuthEvent: event 
        }));

        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    initializeAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Separate useEffect for authorization checking
  useEffect(() => {
    if (user?.email) {
      // Defer authorization check to avoid race conditions
      const timeoutId = setTimeout(() => {
        checkAuthorization();
      }, 100);
      
      return () => clearTimeout(timeoutId);
    } else {
      setIsAuthorized(false);
    }
  }, [user?.email]);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      // Basic validation
      if (!email || !password) {
        return { error: { message: 'Email y contraseña son requeridos' } };
      }

      if (isRateLimited(email)) {
        setLoading(false);
        return { error: { message: 'Demasiados intentos fallidos. Intenta más tarde.' } };
      }
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password
      });
      
      if (error) {
        recordFailedAttempt(email);
        setLoading(false);
        return { error };
      }
      
      recordSuccessfulLogin(email);
      return { error: null };
    } catch (error) {
      console.error('Sign in exception:', error);
      recordFailedAttempt(email);
      setLoading(false);
      return { error };
    }
  };

  const signOut = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    setIsAuthorized(false);
    setLoading(false);
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
      debugInfo
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
