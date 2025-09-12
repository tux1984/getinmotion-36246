
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';
import { useSecurityMonitoring } from '@/hooks/useSecurityMonitoring';
import { InputValidator } from '@/utils/inputValidation';
import { useSessionPersistence } from '@/hooks/useSessionPersistence';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAuthorized: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: any }>;
  signOut: () => Promise<void>;
  checkAuthorization: () => Promise<boolean>;
  refreshAuth: () => Promise<void>;
  debugInfo: {
    authStateChangeCount: number;
    lastAuthEvent: string | null;
    authorizationAttempts: number;
    sessionStatus: string;
    lastSessionRefresh: string | null;
  };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [authRetryCount, setAuthRetryCount] = useState(0);
  const { recordFailedAttempt, recordSuccessfulLogin, isRateLimited } = useSecurityMonitoring();
  const { sessionState, refreshSession, clearSession, isSessionValid, forceSessionCheck } = useSessionPersistence();
  
  const [debugInfo, setDebugInfo] = useState({
    authStateChangeCount: 0,
    lastAuthEvent: null as string | null,
    authorizationAttempts: 0,
    sessionStatus: 'unknown',
    lastSessionRefresh: null as string | null
  });

  const updateDebugInfo = useCallback((field: string, value: any) => {
    setDebugInfo(prev => ({ ...prev, [field]: value }));
  }, []);

  // Get derived state from session persistence hook
  const user = sessionState.user;
  const session = sessionState.session;
  const loading = sessionState.isLoading;

  const checkAuthorization = useCallback(async (userEmail?: string, retryCount = 0): Promise<boolean> => {
    const maxRetries = 3;
    
    try {
      updateDebugInfo('authorizationAttempts', debugInfo.authorizationAttempts + 1);
      
      // If session is invalid, try to refresh it first
      if (session && !isSessionValid()) {
        logger.debug('Session invalid, attempting refresh before authorization check', { 
          component: 'auth' 
        });
        
        const refreshSuccess = await refreshSession();
        if (!refreshSuccess) {
          logger.debug('Session refresh failed, user not authorized', { component: 'auth' });
          setIsAuthorized(false);
          return false;
        }
        
        updateDebugInfo('lastSessionRefresh', new Date().toISOString());
      }
      
      // Get current user to ensure session is properly established
      const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !currentUser?.email) {
        logger.debug('No authenticated user found', { 
          error: userError?.message,
          hasSession: !!session,
          sessionValid: session ? isSessionValid() : false,
          component: 'auth' 
        });
        
        // If we have a session but getUser fails, try to refresh
        if (session && retryCount === 0) {
          logger.debug('Have session but getUser failed, attempting session refresh', { component: 'auth' });
          await refreshSession();
          return checkAuthorization(userEmail, retryCount + 1);
        }
        
        setIsAuthorized(false);
        updateDebugInfo('sessionStatus', 'invalid-user');
        return false;
      }

      const email = userEmail || currentUser.email;
      logger.debug(`Checking authorization (attempt ${retryCount + 1})`, { 
        userEmail: email,
        sessionValid: isSessionValid(),
        component: 'auth' 
      });
      
      // Direct query to admin_users table
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
        
        // Enhanced retry logic
        if (retryCount < maxRetries && (
          error.message?.includes('Failed to fetch') || 
          error.message?.includes('timeout') ||
          error.code === 'PGRST301' ||
          error.message?.includes('JWT') ||
          error.message?.includes('permission denied') ||
          error.message?.includes('Invalid JWT')
        )) {
          logger.debug(`Retrying authorization check in ${(retryCount + 1) * 1000}ms`, { 
            userEmail: email,
            retryReason: error.message,
            component: 'auth' 
          });
          
          // Try session refresh on JWT errors
          if (error.message?.includes('JWT') && retryCount === 0) {
            await refreshSession();
          }
          
          await new Promise(resolve => setTimeout(resolve, (retryCount + 1) * 1000));
          return checkAuthorization(userEmail, retryCount + 1);
        }
        
        setIsAuthorized(false);
        updateDebugInfo('sessionStatus', `error-${error.code || 'unknown'}`);
        return false;
      }
      
      const authorized = !!data;
      logger.debug('Authorization result', { 
        authorized, 
        userEmail: email,
        adminUserFound: !!data,
        sessionValid: isSessionValid(),
        component: 'auth' 
      });
      
      setIsAuthorized(authorized);
      updateDebugInfo('sessionStatus', authorized ? 'authorized' : 'not-admin');
      setAuthRetryCount(0); // Reset retry count on success
      return authorized;
    } catch (error) {
      logger.error('Exception checking authorization', error as Error, { 
        userEmail: userEmail,
        retryCount,
        component: 'auth' 
      });
      
      // Retry for network errors
      if (retryCount < maxRetries) {
        logger.debug('Retrying authorization check due to exception', { 
          userEmail: userEmail,
          component: 'auth' 
        });
        await new Promise(resolve => setTimeout(resolve, (retryCount + 1) * 1000));
        return checkAuthorization(userEmail, retryCount + 1);
      }
      
      setIsAuthorized(false);
      updateDebugInfo('sessionStatus', 'exception');
      return false;
    }
  }, [session, isSessionValid, refreshSession, debugInfo.authorizationAttempts, updateDebugInfo]);

  const refreshAuth = useCallback(async (): Promise<void> => {
    logger.debug('Manual auth refresh requested', { component: 'auth' });
    
    try {
      // Force session check first
      await forceSessionCheck();
      
      // Then check authorization if we have a user
      if (sessionState.user?.email) {
        await checkAuthorization(sessionState.user.email);
      }
    } catch (error) {
      logger.error('Error during manual auth refresh', error as Error, { component: 'auth' });
    }
  }, [forceSessionCheck, sessionState.user?.email, checkAuthorization]);

  // Enhanced auth state monitoring with session persistence
  useEffect(() => {
    logger.debug('Setting up enhanced auth listener', { component: 'auth' });
    
    let isMounted = true;
    let authCheckTimeout: NodeJS.Timeout;
    
    const handleAuthStateChange = async (event: string, newSession: Session | null) => {
      if (!isMounted) return;
      
      updateDebugInfo('authStateChangeCount', debugInfo.authStateChangeCount + 1);
      updateDebugInfo('lastAuthEvent', event);
      
      logger.debug('Auth state changed', { 
        event, 
        userEmail: newSession?.user?.email || 'No session',
        sessionValid: newSession ? true : false,
        component: 'auth' 
      });
      
      // Clear any pending auth checks
      if (authCheckTimeout) {
        clearTimeout(authCheckTimeout);
      }
      
      // Update session status in debug info
      updateDebugInfo('sessionStatus', newSession ? 'session-active' : 'no-session');
      
      // Handle authorization check for authenticated users
      if (newSession?.user?.email) {
        logger.debug('Auth state change - scheduling authorization check', { 
          userEmail: newSession.user.email,
          component: 'auth' 
        });
        
        // Use a more sophisticated delay based on the event type
        const delay = event === 'SIGNED_IN' ? 500 : 200;
        
        authCheckTimeout = setTimeout(async () => {
          if (isMounted) {
            try {
              await checkAuthorization(newSession.user.email);
            } catch (error) {
              logger.error('Error in delayed authorization check', error as Error, { component: 'auth' });
            }
          }
        }, delay);
      } else {
        logger.debug('Auth state change - no user, setting unauthorized', { component: 'auth' });
        setIsAuthorized(false);
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthStateChange);

    // Enhanced initial session setup
    const setupInitialAuth = async () => {
      try {
        logger.debug('Setting up initial auth state', { component: 'auth' });
        
        // Force session check to get the most current state
        await forceSessionCheck();
        
        // Wait a bit for session state to update
        await new Promise(resolve => setTimeout(resolve, 100));
        
        if (!isMounted) return;
        
        // Check authorization if we have a user
        if (sessionState.user?.email) {
          logger.debug('Initial setup - user found, checking authorization', { 
            userEmail: sessionState.user.email,
            component: 'auth' 
          });
          await checkAuthorization(sessionState.user.email);
        } else {
          logger.debug('Initial setup - no user found', { component: 'auth' });
          setIsAuthorized(false);
        }
        
        logger.debug('Initial auth setup complete', { component: 'auth' });
      } catch (error) {
        logger.error('Exception in initial auth setup', error as Error, { component: 'auth' });
        if (isMounted) {
          setIsAuthorized(false);
        }
      }
    };

    // Initialize with appropriate delay
    setTimeout(setupInitialAuth, 100);

    return () => {
      logger.debug('Cleaning up enhanced auth listener', { component: 'auth' });
      isMounted = false;
      if (authCheckTimeout) {
        clearTimeout(authCheckTimeout);
      }
      subscription.unsubscribe();
    };
  }, [sessionState.user?.email, checkAuthorization, forceSessionCheck, updateDebugInfo, debugInfo.authStateChangeCount]);

  // Monitor session state changes and update debug info
  useEffect(() => {
    updateDebugInfo('sessionStatus', sessionState.session ? 'has-session' : 'no-session');
  }, [sessionState.session, updateDebugInfo]);

  const signIn = async (email: string, password: string) => {
    let sanitizedEmail = email; // Declare outside try block for catch access
    
    try {
      // Note: Loading state is managed by session persistence hook
      
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
        return { error: { message: 'Too many failed attempts. Please try again later.' } };
      }
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: sanitizedEmail,
        password
      });
      
      if (error) {
        logger.security.authError(error.message, sanitizedEmail);
        recordFailedAttempt(sanitizedEmail);
        return { error };
      }
      
      recordSuccessfulLogin(sanitizedEmail);
      logger.info('User signed in successfully', { userEmail: sanitizedEmail, component: 'auth' });
      // Loading state is managed by session persistence hook
      return { error: null };
    } catch (error) {
      logger.error('Sign in exception', error as Error, { userEmail: sanitizedEmail, component: 'auth' });
      recordFailedAttempt(sanitizedEmail);
      return { error };
    }
  };

  const signOut = async () => {
    const userEmail = user?.email;
    logger.info('User signing out', { userEmail, component: 'auth' });
    
    try {
      await supabase.auth.signOut();
      clearSession();
      setIsAuthorized(false);
      setAuthRetryCount(0);
      updateDebugInfo('sessionStatus', 'signed-out');
    } catch (error) {
      logger.error('Error during sign out', error as Error, { component: 'auth' });
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
      refreshAuth,
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
