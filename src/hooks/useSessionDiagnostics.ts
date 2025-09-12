import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SessionDiagnostics {
  clientSideSession: any;
  serverSideAuth: any;
  tokenValidity: boolean;
  isAdmin: boolean;
  lastCheck: Date | null;
}

export const useSessionDiagnostics = () => {
  const [diagnostics, setDiagnostics] = useState<SessionDiagnostics | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const { toast } = useToast();

  const runDiagnostics = useCallback(async () => {
    setIsChecking(true);
    
    try {
      console.log('🔍 Running comprehensive session diagnostics...');
      
      // 1. Check client-side session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      console.log('Client session:', { hasSession: !!session, error: sessionError });
      
      // 2. Test server-side authentication
      let serverAuth = null;
      let tokenValid = false;
      let isAdminUser = false;
      
      if (session?.access_token) {
        try {
          // Test with a simple RPC call
          const { data: authTest, error: authError } = await supabase.rpc('is_admin');
          console.log('Server auth test:', { result: authTest, error: authError });
          
          if (!authError) {
            tokenValid = true;
            isAdminUser = !!authTest;
            serverAuth = { valid: true, isAdmin: authTest };
          } else {
            serverAuth = { valid: false, error: authError.message };
          }
        } catch (rpcError) {
          console.error('RPC test failed:', rpcError);
          serverAuth = { valid: false, error: rpcError.message };
        }
      }
      
      const diagnosticsResult: SessionDiagnostics = {
        clientSideSession: {
          exists: !!session,
          hasToken: !!session?.access_token,
          userEmail: session?.user?.email,
          expiresAt: session?.expires_at,
          error: sessionError?.message
        },
        serverSideAuth: serverAuth,
        tokenValidity: tokenValid,
        isAdmin: isAdminUser,
        lastCheck: new Date()
      };
      
      setDiagnostics(diagnosticsResult);
      
      // Show summary toast
      if (tokenValid && isAdminUser) {
        toast({
          title: "✅ Diagnóstico completado",
          description: "Sesión completamente funcional",
          variant: "default"
        });
      } else {
        toast({
          title: "⚠️ Problemas detectados",
          description: tokenValid ? "Sesión válida pero sin permisos admin" : "Sesión inválida o expirada",
          variant: "destructive"
        });
      }
      
      return diagnosticsResult;
      
    } catch (error) {
      console.error('Diagnostics failed:', error);
      toast({
        title: "❌ Error en diagnóstico",
        description: "No se pudo completar el diagnóstico de sesión",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsChecking(false);
    }
  }, [toast]);

  const forceSessionSync = useCallback(async () => {
    console.log('🔄 Forcing complete session synchronization...');
    
    try {
      // 1. Sign out completely
      await supabase.auth.signOut();
      
      // 2. Clear any cached data
      localStorage.removeItem('supabase.auth.token');
      
      // 3. Wait a moment
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "🔄 Sesión reiniciada",
        description: "Por favor, inicia sesión nuevamente",
        variant: "default"
      });
      
      // Force page reload to ensure clean state
      window.location.reload();
      
    } catch (error) {
      console.error('Session sync failed:', error);
      toast({
        title: "❌ Error al reiniciar sesión",
        description: "Intenta recargar la página manualmente",
        variant: "destructive"
      });
    }
  }, [toast]);

  return {
    diagnostics,
    isChecking,
    runDiagnostics,
    forceSessionSync
  };
};