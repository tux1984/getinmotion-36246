import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useSessionHealth = () => {
  const [isSessionHealthy, setIsSessionHealthy] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const { toast } = useToast();

  const checkSessionHealth = async (): Promise<boolean> => {
    try {
      setIsChecking(true);
      
      // First check if we have a session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        console.log('❌ No session available');
        setIsSessionHealthy(false);
        return false;
      }

      // Test if the session works by making a simple authenticated query
      const { error: testError } = await supabase
        .from('admin_users')
        .select('email')
        .limit(1);

      if (testError) {
        console.log('❌ Session test failed:', testError);
        
        // Try to refresh the session
        console.log('🔄 Attempting to refresh session...');
        const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
        
        if (refreshError || !refreshData.session) {
          console.log('❌ Session refresh failed');
          setIsSessionHealthy(false);
          return false;
        }
        
        console.log('✅ Session refreshed successfully');
      }

      console.log('✅ Session is healthy');
      setIsSessionHealthy(true);
      return true;
      
    } catch (error) {
      console.error('❌ Session health check failed:', error);
      setIsSessionHealthy(false);
      return false;
    } finally {
      setIsChecking(false);
    }
  };

  const forceSessionRefresh = async (): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error || !data.session) {
        toast({
          title: 'Error de sesión',
          description: 'No se pudo renovar la sesión. Por favor, inicia sesión nuevamente.',
          variant: 'destructive',
        });
        return false;
      }
      
      const healthCheck = await checkSessionHealth();
      
      if (healthCheck) {
        toast({
          title: 'Sesión renovada',
          description: 'La sesión se ha renovado exitosamente.',
        });
      }
      
      return healthCheck;
    } catch (error) {
      console.error('Error refreshing session:', error);
      return false;
    }
  };

  // Check session health on mount
  useEffect(() => {
    checkSessionHealth();
  }, []);

  return {
    isSessionHealthy,
    isChecking,
    checkSessionHealth,
    forceSessionRefresh
  };
};