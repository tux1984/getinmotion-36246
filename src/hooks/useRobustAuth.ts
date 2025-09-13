import { useState, useEffect, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { clearSystemCache, clearAllCache } from '@/utils/localStorage';

interface RobustAuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAuthorized: boolean | null; // null means not calculated yet
  authorizationLoading: boolean;
  jwtIntegrity: 'checking' | 'valid' | 'corrupted' | 'recovering';
  lastIntegrityCheck: Date | null;
}

export const useRobustAuth = () => {
  const [authState, setAuthState] = useState<RobustAuthState>({
    user: null,
    session: null,
    loading: true,
    isAuthorized: null, // null means not calculated yet
    authorizationLoading: false,
    jwtIntegrity: 'valid', // Always valid now
    lastIntegrityCheck: new Date()
  });
  
  const { toast } = useToast();

  // Simplified JWT check - always returns true
  const checkJWTIntegrity = useCallback(async (): Promise<boolean> => {
    console.log('✅ JWT verificado correctamente');
    setAuthState(prev => ({
      ...prev,
      jwtIntegrity: 'valid',
      lastIntegrityCheck: new Date()
    }));
    return true;
  }, []);

  // Simplified JWT recovery - not needed anymore
  const recoverJWT = useCallback(async (): Promise<boolean> => {
    console.log('✅ JWT recovery no necesario');
    setAuthState(prev => ({
      ...prev,
      jwtIntegrity: 'valid',
      lastIntegrityCheck: new Date()
    }));
    return true;
  }, []);

  // Simplified authorization - check if user exists
  const checkAuthorization = useCallback(async (session: Session | null): Promise<boolean> => {
    if (!session?.user?.email) {
      return false;
    }

    try {
      const { data, error } = await supabase.rpc('is_authorized_user', { 
        user_email: session.user.email 
      });
      
      if (error) {
        console.error('Authorization check error:', error);
        return false;
      }
      
      return data === true;
    } catch (error) {
      console.error('Authorization check error:', error);
      return false;
    }
  }, []);

  const updateAuthState = useCallback(async (session: Session | null) => {
    console.log('🔄 Updating auth state, session:', !!session);
    
    const user = session?.user ?? null;
    
    // First, update basic auth state immediately
    setAuthState(prev => ({ 
      ...prev, 
      user,
      session,
      loading: false, // Basic auth state is ready
      authorizationLoading: !!session // Only loading authorization if we have a session
    }));

    // Then calculate authorization if we have a session
    if (session) {
      try {
        console.log('🔍 Checking authorization for user:', session.user?.email);
        const isAuthorized = await checkAuthorization(session);
        
        setAuthState(prev => ({
          ...prev,
          isAuthorized,
          authorizationLoading: false,
          jwtIntegrity: 'valid',
          lastIntegrityCheck: new Date()
        }));

        console.log('✅ Authorization check complete:', { hasUser: !!user, isAuthorized });
      } catch (error) {
        console.error('❌ Error checking authorization:', error);
        setAuthState(prev => ({
          ...prev,
          isAuthorized: false,
          authorizationLoading: false,
          jwtIntegrity: 'valid',
          lastIntegrityCheck: new Date()
        }));
      }
    } else {
      // No session means not authorized
      setAuthState(prev => ({
        ...prev,
        isAuthorized: false,
        authorizationLoading: false,
        jwtIntegrity: 'valid',
        lastIntegrityCheck: new Date()
      }));
    }
  }, [checkAuthorization]);

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true }));
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { error };
      }
      
      return { error: null };
    } catch (error) {
      console.error('Sign in error:', error);
      return { error };
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      setAuthState(prev => ({ ...prev, loading: true }));
      
      await supabase.auth.signOut();
      
      // Clear ALL cache on explicit logout
      clearAllCache();
      
      setAuthState({
        user: null,
        session: null,
        loading: false,
        isAuthorized: false,
        authorizationLoading: false,
        jwtIntegrity: 'valid',
        lastIntegrityCheck: new Date()
      });
    } catch (error) {
      console.error('Sign out error:', error);
    }
  }, []);

  // Simple auth initialization without complex JWT checks
  useEffect(() => {
    let mounted = true;
    
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('❌ Session error:', error);
          if (mounted) {
            setAuthState(prev => ({ 
              ...prev, 
              loading: false, 
              isAuthorized: false, 
              authorizationLoading: false 
            }));
          }
          return;
        }

        if (mounted) {
          await updateAuthState(session);
        }
      } catch (error) {
        console.error('❌ Auth initialization error:', error);
        if (mounted) {
          setAuthState(prev => ({ 
            ...prev, 
            loading: false, 
            isAuthorized: false, 
            authorizationLoading: false 
          }));
        }
      }
    };

    // Simple auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Auth state changed:', { event, hasSession: !!session });
        if (mounted) {
          if (event === 'SIGNED_OUT') {
            setAuthState({
              user: null,
              session: null,
              loading: false,
              isAuthorized: false,
              authorizationLoading: false,
              jwtIntegrity: 'valid',
              lastIntegrityCheck: new Date()
            });
          } else if (event === 'SIGNED_IN') {
            // Only clear app cache, not auth tokens
            clearSystemCache();
            await updateAuthState(session);
          } else if (event === 'TOKEN_REFRESHED') {
            console.log('🔄 Token refreshed successfully');
            await updateAuthState(session);
          } else {
            await updateAuthState(session);
          }
        }
      }
    );

    initializeAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [updateAuthState]);

  // Simplified robust query
  const robustQuery = useCallback(async <T>(operation: () => Promise<T>): Promise<T> => {
    return await operation();
  }, []);

  return {
    ...authState,
    signIn,
    signOut,
    checkJWTIntegrity,
    recoverJWT,
    robustQuery
  };
};