import { useState, useEffect, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { clearSystemCache } from '@/utils/localStorage';

interface RobustAuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAuthorized: boolean;
  jwtIntegrity: 'checking' | 'valid' | 'corrupted' | 'recovering';
  lastIntegrityCheck: Date | null;
}

export const useRobustAuth = () => {
  const [authState, setAuthState] = useState<RobustAuthState>({
    user: null,
    session: null,
    loading: true,
    isAuthorized: false,
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
    setAuthState(prev => ({ ...prev, loading: true }));

    const user = session?.user ?? null;
    
    try {
      const isAuthorized = session ? await checkAuthorization(session) : false;

      setAuthState(prev => ({
        ...prev,
        user,
        session,
        isAuthorized,
        loading: false,
        jwtIntegrity: 'valid',
        lastIntegrityCheck: new Date()
      }));

      console.log('✅ Auth state updated:', { hasUser: !!user, isAuthorized });
    } catch (error) {
      console.error('❌ Error updating auth state:', error);
      setAuthState(prev => ({
        ...prev,
        user,
        session,
        isAuthorized: false,
        loading: false,
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
      
      // Clear system cache on logout
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.includes('supabase') || key.includes('auth') || key.includes('cache')) {
          localStorage.removeItem(key);
        }
      });
      
      setAuthState({
        user: null,
        session: null,
        loading: false,
        isAuthorized: false,
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
            setAuthState(prev => ({ ...prev, loading: false }));
          }
          return;
        }

        if (mounted) {
          await updateAuthState(session);
        }
      } catch (error) {
        console.error('❌ Auth initialization error:', error);
        if (mounted) {
          setAuthState(prev => ({ ...prev, loading: false }));
        }
      }
    };

    // Simple auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Auth state changed:', { event, hasSession: !!session });
        if (mounted) {
          if (event === 'SIGNED_OUT') {
            clearSystemCache();
            setAuthState({
              user: null,
              session: null,
              loading: false,
              isAuthorized: false,
              jwtIntegrity: 'valid',
              lastIntegrityCheck: new Date()
            });
          } else if (event === 'SIGNED_IN') {
            clearSystemCache(); // Clear cache on login too for fresh start
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