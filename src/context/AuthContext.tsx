import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAuthorized: boolean;
  syncStatus: 'healthy' | 'desynced' | 'checking' | 'error';
  lastSyncCheck: Date | null;
  signIn: (email: string, password: string) => Promise<{ error?: any }>;
  signOut: () => Promise<void>;
  checkAuthorization: (userEmail?: string) => Promise<boolean>;
  refreshAuth: () => Promise<void>;
  forceAuthRefresh: () => Promise<boolean>;
  validateAuthState: (session: Session | null) => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'healthy' | 'desynced' | 'checking' | 'error'>('checking');
  const [lastSyncCheck, setLastSyncCheck] = useState<Date | null>(null);

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

  const forceAuthRefresh = async (): Promise<boolean> => {
    try {
      console.log('🔄 AuthProvider: Force auth refresh...');
      setSyncStatus('checking');
      
      const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
      
      if (refreshError) {
        console.error('❌ AuthProvider: Refresh session failed:', refreshError);
        setSyncStatus('error');
        return false;
      }
      
      if (refreshData.session?.user?.email) {
        const authorized = await checkAuthorization(refreshData.session.user.email);
        setSyncStatus(authorized ? 'healthy' : 'desynced');
        setLastSyncCheck(new Date());
        return authorized;
      }
      
      setSyncStatus('error');
      return false;
    } catch (error) {
      console.error('❌ AuthProvider: Force refresh failed:', error);
      setSyncStatus('error');
      return false;
    }
  };

  const validateAuthState = async (session: Session | null): Promise<any> => {
    try {
      if (!session?.access_token) {
        return { clientValid: false, serverValid: false, isAdmin: false };
      }

      // Test server-side validation
      const { data: adminCheck, error: adminError } = await supabase.rpc('is_admin');
      
      const result = {
        clientValid: !!session.access_token,
        serverValid: !adminError,
        isAdmin: !!adminCheck,
        tokenExpired: session.expires_at ? session.expires_at < Date.now() / 1000 : false
      };

      setSyncStatus(result.clientValid && result.serverValid ? 'healthy' : 'desynced');
      setLastSyncCheck(new Date());
      
      return result;
    } catch (error) {
      console.error('❌ Auth validation error:', error);
      setSyncStatus('error');
      return { clientValid: false, serverValid: false, isAdmin: false };
    }
  };

  const refreshAuth = async () => {
    await forceAuthRefresh();
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
      syncStatus,
      lastSyncCheck,
      signIn,
      signOut,
      checkAuthorization,
      refreshAuth,
      forceAuthRefresh,
      validateAuthState
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