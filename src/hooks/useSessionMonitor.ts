import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface SessionMonitorState {
  isMonitoring: boolean;
  consecutiveFailures: number;
  lastSuccessfulCheck: Date | null;
  autoRecoveryEnabled: boolean;
}

export const useSessionMonitor = () => {
  const { session, user, forceAuthRefresh, validateAuthState } = useAuth();
  const { toast } = useToast();
  const [monitorState, setMonitorState] = useState<SessionMonitorState>({
    isMonitoring: false,
    consecutiveFailures: 0,
    lastSuccessfulCheck: null,
    autoRecoveryEnabled: true
  });

  // Deep session validation
  const performDeepValidation = useCallback(async (): Promise<boolean> => {
    if (!session || !user) {
      return false;
    }

    try {
      // 1. Check if token is not expired
      const now = Math.floor(Date.now() / 1000);
      if (session.expires_at && session.expires_at < now) {
        console.log('⚠️ Token expired, needs refresh');
        return false;
      }

      // 2. Test actual server connectivity
      const { data: uidTest, error: uidError } = await supabase.rpc('is_admin');
      
      if (uidError) {
        console.log('❌ Server auth test failed:', uidError.message);
        
        // Check if it's specifically an auth issue
        if (uidError.message?.includes('JWT') || 
            uidError.message?.includes('token') ||
            uidError.message?.includes('expired') ||
            uidError.message?.includes('invalid')) {
          return false;
        }
      }

      // 3. Additional validation with validateAuthState
      const authValidation = await validateAuthState(session);
      
      return authValidation.serverValid && authValidation.clientValid;
    } catch (error) {
      console.error('❌ Deep validation error:', error);
      return false;
    }
  }, [session, user, validateAuthState]);

  // Auto-recovery mechanism
  const attemptAutoRecovery = useCallback(async (): Promise<boolean> => {
    if (!monitorState.autoRecoveryEnabled) {
      return false;
    }

    try {
      console.log('🔄 Attempting auto-recovery...');
      
      toast({
        title: '🔄 Recuperación automática',
        description: 'Intentando restaurar la sesión...'
      });

      // Try auth refresh first
      const refreshSuccess = await forceAuthRefresh();
      
      if (refreshSuccess) {
        // Validate after refresh
        const validationSuccess = await performDeepValidation();
        
        if (validationSuccess) {
          console.log('✅ Auto-recovery successful');
          toast({
            title: '✅ Recuperación exitosa',
            description: 'Sesión restaurada automáticamente'
          });
          
          setMonitorState(prev => ({
            ...prev,
            consecutiveFailures: 0,
            lastSuccessfulCheck: new Date()
          }));
          
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error('❌ Auto-recovery failed:', error);
      return false;
    }
  }, [monitorState.autoRecoveryEnabled, forceAuthRefresh, performDeepValidation, toast]);

  // Enhanced monitoring check
  const runMonitoringCheck = useCallback(async () => {
    if (!session || !user) {
      return;
    }

    const isValid = await performDeepValidation();
    
    if (isValid) {
      setMonitorState(prev => ({
        ...prev,
        consecutiveFailures: 0,
        lastSuccessfulCheck: new Date()
      }));
    } else {
      setMonitorState(prev => {
        const newFailures = prev.consecutiveFailures + 1;
        
        // If we have multiple consecutive failures, try auto-recovery
        if (newFailures >= 2 && prev.autoRecoveryEnabled) {
          // Don't await this - run it in background
          attemptAutoRecovery();
        }
        
        // If we have many failures, suggest manual intervention
        if (newFailures >= 4) {
          toast({
            title: '⚠️ Problemas persistentes',
            description: 'Se detectaron múltiples fallos de sesión. Considera usar la limpieza profunda.',
            variant: 'destructive'
          });
        }
        
        return {
          ...prev,
          consecutiveFailures: newFailures
        };
      });
    }
  }, [session, user, performDeepValidation, attemptAutoRecovery, toast]);

  // Start/stop monitoring
  const startMonitoring = useCallback(() => {
    setMonitorState(prev => ({ ...prev, isMonitoring: true }));
  }, []);

  const stopMonitoring = useCallback(() => {
    setMonitorState(prev => ({ ...prev, isMonitoring: false }));
  }, []);

  const toggleAutoRecovery = useCallback(() => {
    setMonitorState(prev => ({ 
      ...prev, 
      autoRecoveryEnabled: !prev.autoRecoveryEnabled 
    }));
  }, []);

  // Monitoring interval effect
  useEffect(() => {
    if (!monitorState.isMonitoring || !session || !user) {
      return;
    }

    const interval = setInterval(() => {
      runMonitoringCheck();
    }, 20000); // Check every 20 seconds when monitoring is active

    return () => clearInterval(interval);
  }, [monitorState.isMonitoring, session, user, runMonitoringCheck]);

  // Auto-start monitoring when user is authenticated
  useEffect(() => {
    if (session && user && !monitorState.isMonitoring) {
      console.log('🎯 Starting automatic session monitoring');
      startMonitoring();
    } else if ((!session || !user) && monitorState.isMonitoring) {
      console.log('🛑 Stopping session monitoring - no valid session');
      stopMonitoring();
    }
  }, [session, user, monitorState.isMonitoring, startMonitoring, stopMonitoring]);

  return {
    ...monitorState,
    startMonitoring,
    stopMonitoring,
    toggleAutoRecovery,
    runMonitoringCheck,
    performDeepValidation,
    attemptAutoRecovery
  };
};