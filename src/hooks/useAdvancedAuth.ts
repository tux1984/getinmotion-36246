import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { User, Session } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAuthorized: boolean;
  lastSyncCheck: Date | null;
  syncStatus: 'healthy' | 'desynced' | 'checking' | 'error';
}

interface AuthValidationResult {
  clientValid: boolean;
  serverValid: boolean;
  tokenExpired: boolean;
  isAdmin: boolean;
  needsRefresh: boolean;
}

export const useAdvancedAuth = () => {
  const { toast } = useToast();
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    isAuthorized: false,
    lastSyncCheck: null,
    syncStatus: 'checking'
  });

  // Validate auth state comprehensively
  const validateAuthState = useCallback(async (session: Session | null): Promise<AuthValidationResult> => {
    const result: AuthValidationResult = {
      clientValid: false,
      serverValid: false,
      tokenExpired: false,
      isAdmin: false,
      needsRefresh: false
    };

    try {
      // Check client-side validity
      result.clientValid = !!(session?.access_token && session?.user);
      
      if (!result.clientValid) {
        return result;
      }

      // Check token expiration
      const now = Math.floor(Date.now() / 1000);
      result.tokenExpired = !!(session?.expires_at && session.expires_at < now);
      
      if (result.tokenExpired) {
        result.needsRefresh = true;
        return result;
      }

      // Test server-side validity
      try {
        const { data: adminCheck, error: adminError } = await supabase.rpc('is_admin');
        
        if (!adminError) {
          result.serverValid = true;
          result.isAdmin = !!adminCheck;
        } else {
          console.log('❌ Server auth validation failed:', adminError);
          
          // Check if it's a token issue
          if (adminError.message?.includes('JWT') || adminError.message?.includes('token')) {
            result.needsRefresh = true;
          }
        }
      } catch (error) {
        console.error('❌ Server validation error:', error);
      }

      return result;
    } catch (error) {
      console.error('❌ Auth validation error:', error);
      return result;
    }
  }, []);

  // Enhanced session refresh with validation
  const refreshSessionWithValidation = useCallback(async (): Promise<boolean> => {
    try {
      console.log('🔄 Starting enhanced session refresh...');
      
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error) {
        console.error('❌ Session refresh failed:', error);
        return false;
      }

      if (data.session) {
        // Validate the refreshed session
        const validation = await validateAuthState(data.session);
        
        if (validation.serverValid) {
          console.log('✅ Session refreshed and validated successfully');
          return true;
        } else {
          console.log('⚠️ Session refreshed but server validation failed');
          return false;
        }
      }

      return false;
    } catch (error) {
      console.error('❌ Enhanced refresh error:', error);
      return false;
    }
  }, [validateAuthState]);

  // Smart auth state update with validation
  const updateAuthState = useCallback(async (session: Session | null, skipValidation = false) => {
    if (!session || skipValidation) {
      setAuthState(prev => ({
        ...prev,
        user: session?.user || null,
        session,
        isAuthorized: false,
        loading: false,
        syncStatus: session ? 'checking' : 'healthy'
      }));
      return;
    }

    setAuthState(prev => ({ ...prev, loading: true, syncStatus: 'checking' }));

    try {
      const validation = await validateAuthState(session);
      
      // If token needs refresh, try to refresh it
      if (validation.needsRefresh && !validation.tokenExpired) {
        console.log('🔄 Token needs refresh, attempting...');
        const refreshed = await refreshSessionWithValidation();
        
        if (refreshed) {
          // Re-validate after refresh
          const { data: { session: newSession } } = await supabase.auth.getSession();
          if (newSession) {
            const newValidation = await validateAuthState(newSession);
            validation.serverValid = newValidation.serverValid;
            validation.isAdmin = newValidation.isAdmin;
            session = newSession;
          }
        }
      }

      const syncStatus = validation.clientValid && validation.serverValid ? 'healthy' : 'desynced';
      
      setAuthState({
        user: session.user,
        session,
        loading: false,
        isAuthorized: validation.isAdmin,
        lastSyncCheck: new Date(),
        syncStatus
      });

      // Log sync status
      if (syncStatus === 'desynced') {
        console.log('⚠️ Auth desynchronization detected:', {
          clientValid: validation.clientValid,
          serverValid: validation.serverValid,
          tokenExpired: validation.tokenExpired,
          isAdmin: validation.isAdmin
        });
      }

    } catch (error) {
      console.error('❌ Auth state update error:', error);
      setAuthState(prev => ({
        ...prev,
        loading: false,
        syncStatus: 'error'
      }));
    }
  }, [validateAuthState, refreshSessionWithValidation]);

  // Enhanced sign in with validation
  const signIn = useCallback(async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });

      if (error) {
        return { error };
      }

      // Validate immediately after sign in
      if (data.session) {
        await updateAuthState(data.session);
      }

      return { error: null };
    } catch (error) {
      console.error('❌ Sign in error:', error);
      return { error };
    }
  }, [updateAuthState]);

  // Enhanced sign out
  const signOut = useCallback(async () => {
    try {
      await supabase.auth.signOut();
      setAuthState({
        user: null,
        session: null,
        loading: false,
        isAuthorized: false,
        lastSyncCheck: new Date(),
        syncStatus: 'healthy'
      });
    } catch (error) {
      console.error('❌ Sign out error:', error);
    }
  }, []);

  // Force auth refresh
  const forceAuthRefresh = useCallback(async () => {
    const success = await refreshSessionWithValidation();
    if (success) {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        await updateAuthState(session);
      }
    }
    return success;
  }, [refreshSessionWithValidation, updateAuthState]);

  // Monitor auth state changes with enhanced validation
  useEffect(() => {
    let mounted = true;

    // Set up auth state listener with validation
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        console.log('🔍 Auth state change:', event, !!session);

        // Handle immediate state updates for certain events
        if (event === 'SIGNED_OUT') {
          setAuthState({
            user: null,
            session: null,
            loading: false,
            isAuthorized: false,
            lastSyncCheck: new Date(),
            syncStatus: 'healthy'
          });
          return;
        }

        // Use timeout to prevent deadlocks
        setTimeout(() => {
          if (mounted) {
            updateAuthState(session);
          }
        }, 0);
      }
    );

    // Initial session check with validation
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (mounted) {
          await updateAuthState(session);
        }
      } catch (error) {
        console.error('❌ Auth initialization error:', error);
        if (mounted) {
          setAuthState(prev => ({ ...prev, loading: false, syncStatus: 'error' }));
        }
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [updateAuthState]);

  // Periodic sync check
  useEffect(() => {
    if (!authState.session || authState.loading) return;

    const interval = setInterval(async () => {
      const validation = await validateAuthState(authState.session);
      
      setAuthState(prev => ({
        ...prev,
        syncStatus: validation.clientValid && validation.serverValid ? 'healthy' : 'desynced',
        lastSyncCheck: new Date()
      }));

      if (!validation.serverValid && validation.clientValid) {
        console.log('🔄 Periodic check detected desync, attempting refresh...');
        await forceAuthRefresh();
      }
    }, 45000); // Check every 45 seconds

    return () => clearInterval(interval);
  }, [authState.session, authState.loading, validateAuthState, forceAuthRefresh]);

  return {
    ...authState,
    signIn,
    signOut,
    forceAuthRefresh,
    validateAuthState
  };
};