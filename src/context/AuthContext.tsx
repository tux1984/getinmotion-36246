
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';
import { useSecurityMonitoring } from '@/hooks/useSecurityMonitoring';
import { InputValidator } from '@/utils/inputValidation';

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
  const { recordFailedAttempt, recordSuccessfulLogin, isRateLimited } = useSecurityMonitoring();
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
        logger.debug('No email provided for authorization check', { component: 'auth' });
        setIsAuthorized(false);
        return false;
      }
      
      updateDebugInfo('authorizationAttempts', debugInfo.authorizationAttempts + 1);
      logger.debug(`Checking authorization (attempt ${retryCount + 1})`, { 
        userEmail: email, 
        component: 'auth' 
      });
      
      // Use RLS-enabled query with retry logic
      const { data, error } = await supabase
        .from('admin_users')
        .select('email, is_active')
        .eq('email', email as any)
        .eq('is_active', true as any)
        .maybeSingle();
      
      if (error) {
        logger.debug('Error checking authorization', { 
          error: error.message, 
          userEmail: email,
          component: 'auth' 
        });
        
        // Retry logic for transient errors
        if (retryCount < maxRetries && (
          error.message?.includes('Failed to fetch') || 
          error.message?.includes('timeout') ||
          error.code === 'PGRST301'
        )) {
          logger.debug(`Retrying authorization check in ${(retryCount + 1) * 1000}ms`, { 
            userEmail: email,
            component: 'auth' 
          });
          await new Promise(resolve => setTimeout(resolve, (retryCount + 1) * 1000));
          return checkAuthorization(userEmail, retryCount + 1);
        }
        
        setIsAuthorized(false);
        return false;
      }
      
      const authorized = !!data;
      logger.debug('Authorization result', { 
        authorized, 
        userEmail: email,
        component: 'auth' 
      });
      setIsAuthorized(authorized);
      return authorized;
    } catch (error) {
      logger.error('Exception checking authorization', error as Error, { 
        userEmail: userEmail || user?.email,
        component: 'auth' 
      });
      
      // Retry for network errors
      if (retryCount < maxRetries) {
        logger.debug('Retrying authorization check due to exception', { 
          userEmail: userEmail || user?.email,
          component: 'auth' 
        });
        await new Promise(resolve => setTimeout(resolve, (retryCount + 1) * 1000));
        return checkAuthorization(userEmail, retryCount + 1);
      }
      
      setIsAuthorized(false);
      return false;
    }
  };

  useEffect(() => {
    logger.debug('Setting up auth listener', { component: 'auth' });
    
    let isMounted = true;
    
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        updateDebugInfo('authStateChangeCount', debugInfo.authStateChangeCount + 1);
        updateDebugInfo('lastAuthEvent', event);
        
        logger.debug('Auth state changed', { 
          event, 
          userEmail: session?.user?.email || 'No session',
          component: 'auth' 
        });
        
        if (!isMounted) return;
        
        setSession(session);
        setUser(session?.user ?? null);
        
        // Check authorization for authenticated users with delay to prevent deadlocks
        if (session?.user?.email) {
          logger.debug('Auth state change - checking authorization', { 
            userEmail: session.user.email,
            component: 'auth' 
          });
          setTimeout(() => {
            if (isMounted) {
              checkAuthorization(session.user.email);
            }
          }, 100); // Increased delay to prevent potential issues
        } else {
          logger.debug('Auth state change - no user, setting unauthorized', { component: 'auth' });
          setIsAuthorized(false);
        }
        
        logger.debug('Auth state change complete, setting loading to false', { component: 'auth' });
        setLoading(false);
      }
    );

    // Get initial session
    const getInitialSession = async () => {
      try {
        logger.debug('Getting initial session', { component: 'auth' });
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (!isMounted) return;
        
        if (error) {
          logger.error('Error getting initial session', error as Error, { component: 'auth' });
          setLoading(false);
          return;
        }
        
        logger.debug('Initial session check', { 
          userEmail: session?.user?.email || 'No session',
          component: 'auth' 
        });
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user?.email) {
          logger.debug('User found, checking authorization', { 
            userEmail: session.user.email,
            component: 'auth' 
          });
          await checkAuthorization(session.user.email);
        } else {
          logger.debug('No user found, setting unauthorized', { component: 'auth' });
          setIsAuthorized(false);
        }
        
        logger.debug('Initial setup complete, setting loading to false', { component: 'auth' });
        setLoading(false);
      } catch (error) {
        logger.error('Exception getting initial session', error as Error, { component: 'auth' });
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    // Initialize with small delay to ensure DOM is ready
    setTimeout(getInitialSession, 50);

    return () => {
      logger.debug('Cleaning up auth listener', { component: 'auth' });
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    let sanitizedEmail = email; // Declare outside try block for catch access
    
    try {
      setLoading(true);
      
      // Enhanced input validation using InputValidator
      const emailValidation = InputValidator.validateEmail(email);
      if (!emailValidation.isValid) {
        return { error: { message: emailValidation.errors[0] } };
      }
      
      const passwordValidation = InputValidator.validatePassword(password);
      if (!passwordValidation.isValid) {
        return { error: { message: passwordValidation.errors[0] } };
      }
      
      sanitizedEmail = emailValidation.sanitizedValue || email;

      // Check rate limiting
      if (isRateLimited(sanitizedEmail)) {
        logger.security.suspiciousActivity('Rate limited login attempt', { userEmail: sanitizedEmail });
        setLoading(false);
        return { error: { message: 'Too many failed attempts. Please try again later.' } };
      }
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: sanitizedEmail,
        password
      });
      
      if (error) {
        logger.security.authError(error.message, sanitizedEmail);
        recordFailedAttempt(sanitizedEmail);
        setLoading(false);
        return { error };
      }
      
      recordSuccessfulLogin(sanitizedEmail);
      logger.info('User signed in successfully', { userEmail: sanitizedEmail, component: 'auth' });
      // Don't set loading to false here, let the auth state change handle it
      return { error: null };
    } catch (error) {
      logger.error('Sign in exception', error as Error, { userEmail: sanitizedEmail, component: 'auth' });
      recordFailedAttempt(sanitizedEmail);
      setLoading(false);
      return { error };
    }
  };

  const signOut = async () => {
    const userEmail = user?.email;
    logger.info('User signing out', { userEmail, component: 'auth' });
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
