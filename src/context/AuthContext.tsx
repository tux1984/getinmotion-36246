
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

  const updateDebugInfo = (field: string, value: any) => {
    setDebugInfo(prev => ({ ...prev, [field]: value }));
  };

  const checkAuthorization = async (userEmail?: string, retryCount = 0): Promise<boolean> => {
    const maxRetries = 3;
    
    try {
      const email = userEmail || user?.email;
      if (!email) {
        console.log('AuthContext: No email provided for authorization check');
        setIsAuthorized(false);
        return false;
      }
      
      updateDebugInfo('authorizationAttempts', debugInfo.authorizationAttempts + 1);
      console.log(`AuthContext: Checking authorization for: ${email} (attempt ${retryCount + 1})`);
      
      // Use RLS-enabled query with retry logic
      const { data, error } = await supabase
        .from('admin_users')
        .select('email, is_active')
        .eq('email', email)
        .eq('is_active', true)
        .maybeSingle();
      
      if (error) {
        console.error('AuthContext: Error checking authorization:', error);
        
        // Retry logic for transient errors
        if (retryCount < maxRetries && (
          error.message?.includes('Failed to fetch') || 
          error.message?.includes('timeout') ||
          error.code === 'PGRST301'
        )) {
          console.log(`AuthContext: Retrying authorization check in ${(retryCount + 1) * 1000}ms...`);
          await new Promise(resolve => setTimeout(resolve, (retryCount + 1) * 1000));
          return checkAuthorization(userEmail, retryCount + 1);
        }
        
        setIsAuthorized(false);
        return false;
      }
      
      const authorized = !!data;
      console.log('AuthContext: Authorization result:', authorized, data);
      setIsAuthorized(authorized);
      return authorized;
    } catch (error) {
      console.error('AuthContext: Exception checking authorization:', error);
      
      // Retry for network errors
      if (retryCount < maxRetries) {
        console.log(`AuthContext: Retrying authorization check due to exception...`);
        await new Promise(resolve => setTimeout(resolve, (retryCount + 1) * 1000));
        return checkAuthorization(userEmail, retryCount + 1);
      }
      
      setIsAuthorized(false);
      return false;
    }
  };

  useEffect(() => {
    console.log('AuthContext: Setting up auth listener');
    
    let isMounted = true;
    
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        updateDebugInfo('authStateChangeCount', debugInfo.authStateChangeCount + 1);
        updateDebugInfo('lastAuthEvent', event);
        
        console.log('AuthContext: Auth state changed:', event, session?.user?.email || 'No session');
        
        if (!isMounted) return;
        
        setSession(session);
        setUser(session?.user ?? null);
        
        // Check authorization for authenticated users with delay to prevent deadlocks
        if (session?.user?.email) {
          console.log('AuthContext: Auth state change - checking authorization...');
          setTimeout(() => {
            if (isMounted) {
              checkAuthorization(session.user.email);
            }
          }, 100); // Increased delay to prevent potential issues
        } else {
          console.log('AuthContext: Auth state change - no user, setting unauthorized');
          setIsAuthorized(false);
        }
        
        console.log('AuthContext: Auth state change complete, setting loading to false');
        setLoading(false);
      }
    );

    // Get initial session
    const getInitialSession = async () => {
      try {
        console.log('AuthContext: Getting initial session...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (!isMounted) return;
        
        if (error) {
          console.error('AuthContext: Error getting initial session:', error);
          setLoading(false);
          return;
        }
        
        console.log('AuthContext: Initial session check:', session?.user?.email || 'No session');
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user?.email) {
          console.log('AuthContext: User found, checking authorization...');
          await checkAuthorization(session.user.email);
        } else {
          console.log('AuthContext: No user found, setting unauthorized');
          setIsAuthorized(false);
        }
        
        console.log('AuthContext: Initial setup complete, setting loading to false');
        setLoading(false);
      } catch (error) {
        console.error('AuthContext: Exception getting initial session:', error);
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    // Initialize with small delay to ensure DOM is ready
    setTimeout(getInitialSession, 50);

    return () => {
      console.log('AuthContext: Cleaning up auth listener');
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    console.log('AuthContext: Attempting sign in for:', email);
    
    try {
      setLoading(true);
      
      // Input validation
      if (!email || !password) {
        return { error: { message: 'Email and password are required' } };
      }
      
      if (!email.includes('@') || email.length < 3) {
        return { error: { message: 'Invalid email format' } };
      }
      
      if (password.length < 6) {
        return { error: { message: 'Password must be at least 6 characters' } };
      }
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password
      });
      
      if (error) {
        console.error('AuthContext: Sign in error:', error);
        setLoading(false);
        return { error };
      }
      
      console.log('AuthContext: Sign in successful for:', data.user?.email);
      // Don't set loading to false here, let the auth state change handle it
      return { error: null };
    } catch (error) {
      console.error('AuthContext: Sign in exception:', error);
      setLoading(false);
      return { error };
    }
  };

  const signOut = async () => {
    console.log('AuthContext: Signing out');
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
