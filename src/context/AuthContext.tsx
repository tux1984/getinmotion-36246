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

  console.log('🔄 AuthProvider: Current state', { 
    hasUser: !!user, 
    hasSession: !!session, 
    isAuthorized, 
    loading 
  });

  const checkAuthorization = async (userEmail?: string): Promise<boolean> => {
    if (!userEmail) {
      console.log('🚫 AuthProvider: No email provided for authorization check');
      setIsAuthorized(false);
      return false;
    }

    try {
      console.log('🔍 AuthProvider: Checking authorization for', userEmail);
      const { data: isAuth, error } = await supabase.rpc('is_authorized_user', { 
        user_email: userEmail 
      });
      
      if (error) {
        console.error('❌ AuthProvider: Authorization check failed:', error);
        setIsAuthorized(false);
        return false;
      }
      
      const authorized = Boolean(isAuth);
      console.log('✅ AuthProvider: Authorization result:', authorized);
      setIsAuthorized(authorized);
      return authorized;
    } catch (error) {
      console.error('❌ AuthProvider: Authorization check error:', error);
      setIsAuthorized(false);
      return false;
    }
  };

  const refreshAuth = async () => {
    try {
      console.log('🔄 AuthProvider: Starting complete auth refresh...');
      
      // Force session refresh first
      const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
      
      if (refreshError) {
        console.error('❌ AuthProvider: Refresh session failed:', refreshError);
        // Fall back to getting current session
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        setUser(session?.user ?? null);
      } else {
        console.log('✅ AuthProvider: Session refreshed successfully');
        setSession(refreshData.session);
        setUser(refreshData.session?.user ?? null);
      }
      
      const currentSession = refreshData?.session || (await supabase.auth.getSession()).data.session;
      
      if (currentSession?.user?.email) {
        console.log('🔍 AuthProvider: Checking authorization after refresh...');
        await checkAuthorization(currentSession.user.email);
      } else {
        console.log('🚫 AuthProvider: No valid session after refresh');
        setIsAuthorized(false);
      }
    } catch (error) {
      console.error('❌ AuthProvider: Complete auth refresh failed:', error);
      setIsAuthorized(false);
    }
  };

  // SIMPLIFIED AUTH STATE MANAGEMENT
  useEffect(() => {
    console.log('🎧 AuthProvider: Setting up auth state listener');
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('🔔 AuthProvider: Auth state changed', { event, hasSession: !!session });
        
        // ONLY synchronous state updates here - NO async calls
        setSession(session);
        setUser(session?.user ?? null);
        
        // If no session, clear everything immediately
        if (!session) {
          setIsAuthorized(false);
          setLoading(false);
          return;
        }
      }
    );

    // Initialize session once
    const initializeAuth = async () => {
      try {
        console.log('🚀 AuthProvider: Getting initial session...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('❌ AuthProvider: Session error:', error);
          setLoading(false);
          return;
        }

        console.log('📋 AuthProvider: Initial session', { hasSession: !!session });
        
        if (session?.user?.email) {
          const authorized = await checkAuthorization(session.user.email);
          console.log('✅ AuthProvider: Initial authorization complete:', authorized);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('❌ AuthProvider: Init error:', error);
        setLoading(false);
      }
    };

    initializeAuth();

    return () => {
      console.log('🧹 AuthProvider: Cleaning up');
      subscription.unsubscribe();
    };
  }, []);

  // Separate effect for handling authorization when session changes
  useEffect(() => {
    if (session?.user?.email && !loading) {
      console.log('🔍 AuthProvider: Checking authorization for session change');
      checkAuthorization(session.user.email);
    }
  }, [session?.user?.email, loading]);

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