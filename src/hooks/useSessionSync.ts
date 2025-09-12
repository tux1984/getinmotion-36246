import { useState, useEffect } from 'react';
import { useRobustAuth } from '@/hooks/useRobustAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useSessionSync = () => {
  const { user, session } = useRobustAuth();
  const { toast } = useToast();
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncAttempts, setSyncAttempts] = useState(0);
  const maxAttempts = 3;

  const forceSessionSync = async (): Promise<boolean> => {
    if (syncAttempts >= maxAttempts) {
      console.log('🚫 Max sync attempts reached, forcing logout');
      await supabase.auth.signOut();
      window.location.href = '/login';
      return false;
    }

    setIsSyncing(true);
    setSyncAttempts(prev => prev + 1);

    try {
      console.log(`🔄 Attempt ${syncAttempts + 1}: Forcing session sync...`);
      
      // Method 1: Refresh the session
      const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
      
      if (refreshError) {
        console.error('❌ Session refresh failed:', refreshError);
        throw refreshError;
      }

      // Method 2: Verify the refresh worked
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        throw new Error('Session still null after refresh');
      }

      // Method 3: Test server connectivity
      const { error: testError } = await supabase.rpc('is_admin');
      if (testError && !testError.message.includes('auth.uid()')) {
        throw testError;
      }

      console.log('✅ Session sync successful');
      setIsSyncing(false);
      setSyncAttempts(0);
      
      toast({
        title: "Sesión sincronizada",
        description: "La sesión se ha sincronizado correctamente.",
      });

      return true;

    } catch (error) {
      console.error(`❌ Sync attempt ${syncAttempts + 1} failed:`, error);
      setIsSyncing(false);
      
      // Wait before next attempt
      if (syncAttempts < maxAttempts - 1) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        return forceSessionSync();
      } else {
        toast({
          title: "Error de sincronización",
          description: "No se pudo sincronizar la sesión. Redirigiendo al login...",
          variant: "destructive",
        });
        
        // Force logout after max attempts
        await supabase.auth.signOut();
        window.location.href = '/login';
        return false;
      }
    }
  };

  // Auto-sync on mount if we have user but potential server desync
  useEffect(() => {
    if (user && session && !isSyncing) {
      // Test if server recognizes the session
      const testServerAuth = async () => {
        try {
          const { error } = await supabase.rpc('is_admin');
          
          // If we get "auth.uid() is null" error, we need to sync
          if (error?.message?.includes('auth.uid()')) {
            console.log('🔍 Detected server desync, forcing sync...');
            forceSessionSync();
          }
        } catch (error) {
          console.log('🔍 Server auth test failed, may need sync');
        }
      };

      testServerAuth();
    }
  }, [user, session]);

  return {
    isSyncing,
    syncAttempts,
    forceSessionSync
  };
};