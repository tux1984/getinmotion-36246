import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useSessionHealth = () => {
  const [isSessionHealthy, setIsSessionHealthy] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const { toast } = useToast();

  const checkSessionHealth = async (): Promise<boolean> => {
    if (isChecking) return isSessionHealthy;
    
    setIsChecking(true);
    try {
      console.log('🔍 Checking session health...');
      
      // Get current session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      console.log('Session check:', { 
        hasSession: !!session, 
        hasAccessToken: !!session?.access_token,
        expiresAt: session?.expires_at,
        error: sessionError 
      });
      
      if (!session || !session.access_token) {
        console.log('❌ No valid session found');
        setIsSessionHealthy(false);
        return false;
      }

      // Check if token is expired
      const now = Math.floor(Date.now() / 1000);
      if (session.expires_at && session.expires_at < now) {
        console.log('❌ Session token expired');
        setIsSessionHealthy(false);
        return false;
      }

      // Test with a simple query to verify the session works
      const { error: testError } = await supabase
        .from('admin_users')
        .select('count')
        .limit(1);

      if (testError) {
        console.log('❌ Session test failed:', testError.message);
        setIsSessionHealthy(false);
        return false;
      }

      console.log('✅ Session is healthy');
      setIsSessionHealthy(true);
      return true;
    } catch (error) {
      console.error('❌ Session health check error:', error);
      setIsSessionHealthy(false);
      return false;
    } finally {
      setIsChecking(false);
    }
  };

  const forceSessionRefresh = async (): Promise<boolean> => {
    setIsChecking(true);
    try {
      console.log('🔄 Forcing complete session refresh...');
      toast({
        title: 'Renovando sesión...',
        description: 'Refrescando sesión completamente...',
      });
      
      // Force a complete session refresh
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error) {
        console.error('❌ Session refresh failed:', error);
        toast({
          title: 'Error de sesión',
          description: 'Error al refrescar la sesión. Intenta hacer logout/login.',
          variant: 'destructive',
        });
        setIsSessionHealthy(false);
        return false;
      }
      
      // Wait a bit for the session to propagate
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Verify the refreshed session works
      const healthCheck = await checkSessionHealth();
      
      if (healthCheck) {
        console.log('✅ Session refreshed and verified successfully');
        toast({
          title: 'Sesión renovada',
          description: 'Sesión refrescada exitosamente',
        });
        return true;
      } else {
        console.log('❌ Session refresh succeeded but health check failed');
        toast({
          title: 'Error de sesión',
          description: 'Sesión refrescada pero aún hay problemas. Intenta logout/login.',
          variant: 'destructive',
        });
        return false;
      }
    } catch (error) {
      console.error('❌ Session refresh error:', error);
      toast({
        title: 'Error inesperado',
        description: 'Error inesperado al refrescar la sesión',
        variant: 'destructive',
      });
      setIsSessionHealthy(false);
      return false;
    } finally {
      setIsChecking(false);
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