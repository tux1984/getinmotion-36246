import { useState, useEffect, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { robustSupabase, jwtManager, robustQuery } from '@/integrations/supabase/robust-client';
import { useToast } from '@/hooks/use-toast';

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
    jwtIntegrity: 'checking',
    lastIntegrityCheck: null
  });
  
  const { toast } = useToast();

  const checkJWTIntegrity = useCallback(async (): Promise<boolean> => {
    if (!authState.session) return false;

    try {
      setAuthState(prev => ({ ...prev, jwtIntegrity: 'checking' }));
      
      const isValid = await jwtManager.verifyJWTIntegrity();
      
      setAuthState(prev => ({
        ...prev,
        jwtIntegrity: isValid ? 'valid' : 'corrupted',
        lastIntegrityCheck: new Date()
      }));
      
      return isValid;
    } catch (error) {
      console.error('JWT integrity check error:', error);
      setAuthState(prev => ({
        ...prev,
        jwtIntegrity: 'corrupted',
        lastIntegrityCheck: new Date()
      }));
      return false;
    }
  }, [authState.session]);

  const recoverJWT = useCallback(async (): Promise<boolean> => {
    try {
      setAuthState(prev => ({ ...prev, jwtIntegrity: 'recovering' }));
      
      toast({
        title: 'Recuperando autenticación...',
        description: 'Reparando sesión corrompida...',
      });
      
      const recovered = await jwtManager.forceJWTRegeneration();
      
      if (recovered) {
        toast({
          title: 'Autenticación recuperada',
          description: 'Sesión reparada exitosamente',
        });
        
        // Force refresh of auth state
        const { data: { session } } = await robustSupabase.auth.getSession();
        updateAuthState(session);
        
        return true;
      } else {
        toast({
          title: 'Error de recuperación',
          description: 'No se pudo reparar la sesión. Redirigiendo al login...',
          variant: 'destructive',
        });
        return false;
      }
    } catch (error) {
      console.error('JWT recovery error:', error);
      toast({
        title: 'Error crítico',
        description: 'Error al recuperar la autenticación',
        variant: 'destructive',
      });
      return false;
    }
  }, [toast]);

  const checkAuthorization = useCallback(async (session: Session | null): Promise<boolean> => {
    if (!session?.user?.email) return false;

    try {
      const result = await robustQuery(async () => 
        robustSupabase.rpc('is_authorized_user', { user_email: session.user.email })
      );
      
      return result.data === true;
    } catch (error) {
      console.error('Authorization check error:', error);
      return false;
    }
  }, []);

  const updateAuthState = useCallback(async (session: Session | null) => {
    setAuthState(prev => ({ ...prev, loading: true }));

    const user = session?.user ?? null;
    const isAuthorized = await checkAuthorization(session);

    setAuthState(prev => ({
      ...prev,
      user,
      session,
      isAuthorized,
      loading: false
    }));

    // Check JWT integrity after state update
    if (session) {
      setTimeout(() => checkJWTIntegrity(), 100);
    }
  }, [checkAuthorization, checkJWTIntegrity]);

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true }));
      
      const { data, error } = await robustSupabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { error };
      }

      // Force JWT integrity check after successful login
      setTimeout(() => checkJWTIntegrity(), 1000);
      
      return { error: null };
    } catch (error) {
      console.error('Sign in error:', error);
      return { error };
    }
  }, [checkJWTIntegrity]);

  const signOut = useCallback(async () => {
    try {
      setAuthState(prev => ({ ...prev, loading: true }));
      
      await robustSupabase.auth.signOut();
      
      // Clear all auth-related storage
      ['supabase.auth.token', 'supabase.auth.robust.token'].forEach(key => {
        localStorage.removeItem(key);
        sessionStorage.removeItem(key);
      });
      
      setAuthState({
        user: null,
        session: null,
        loading: false,
        isAuthorized: false,
        jwtIntegrity: 'checking',
        lastIntegrityCheck: null
      });
    } catch (error) {
      console.error('Sign out error:', error);
    }
  }, []);

  // Initialize auth state and set up listeners
  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = robustSupabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔐 Auth state change:', event, { hasSession: !!session });
        await updateAuthState(session);
      }
    );

    // Check for existing session
    robustSupabase.auth.getSession().then(({ data: { session } }) => {
      updateAuthState(session);
    });

    return () => subscription.unsubscribe();
  }, [updateAuthState]);

  // Periodic JWT integrity check for active sessions
  useEffect(() => {
    if (!authState.session || authState.jwtIntegrity === 'recovering') return;

    const intervalId = setInterval(() => {
      if (authState.jwtIntegrity === 'corrupted') {
        recoverJWT();
      } else {
        checkJWTIntegrity();
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(intervalId);
  }, [authState.session, authState.jwtIntegrity, checkJWTIntegrity, recoverJWT]);

  return {
    ...authState,
    signIn,
    signOut,
    checkJWTIntegrity,
    recoverJWT,
    robustQuery: (operation: () => Promise<any>) => robustQuery(operation)
  };
};