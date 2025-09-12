import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useRobustAuth } from '@/hooks/useRobustAuth';
import { useSessionHealth } from '@/hooks/useSessionHealth';
import { useSessionDiagnostics } from '@/hooks/useSessionDiagnostics';
import { useSessionMonitor } from '@/hooks/useSessionMonitor';
import { 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  RefreshCw, 
  Trash2, 
  Shield,
  Activity,
  Clock
} from 'lucide-react';

interface SessionSyncStatus {
  clientSession: boolean;
  serverAuth: boolean;
  tokenValid: boolean;
  isAdmin: boolean;
  syncStatus: 'synced' | 'desynced' | 'checking' | 'error';
  lastChecked: Date | null;
}

export const SessionSyncManager: React.FC = () => {
  const { toast } = useToast();
  const { user, session } = useRobustAuth();
  const { isSessionHealthy, isChecking, checkSessionHealth, forceSessionRefresh } = useSessionHealth();
  const { diagnostics, runDiagnostics, forceSessionSync } = useSessionDiagnostics();
  const sessionMonitor = useSessionMonitor();
  const [syncStatus, setSyncStatus] = useState<SessionSyncStatus>({
    clientSession: false,
    serverAuth: false,
    tokenValid: false,
    isAdmin: false,
    syncStatus: 'checking',
    lastChecked: null
  });
  const [isResetting, setIsResetting] = useState(false);
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(true);

  // Comprehensive session check
  const performComprehensiveCheck = async () => {
    try {
      setSyncStatus(prev => ({ ...prev, syncStatus: 'checking' }));
      
      // Run diagnostics
      const diagResult = await runDiagnostics();
      
      // Check session health
      const healthResult = await checkSessionHealth();
      
      // Test server connectivity with auth.uid()
      let serverAuthTest = false;
      try {
        const { data: uidTest, error: uidError } = await supabase.rpc('is_admin');
        serverAuthTest = !uidError;
        console.log('🔍 Server auth.uid() test:', { result: uidTest, error: uidError });
      } catch (error) {
        console.error('❌ Server auth test failed:', error);
      }

      const newStatus: SessionSyncStatus = {
        clientSession: !!session && !!user,
        serverAuth: serverAuthTest,
        tokenValid: healthResult && !!diagResult?.tokenValidity,
        isAdmin: !!diagResult?.isAdmin,
        syncStatus: (!!session && serverAuthTest) ? 'synced' : 'desynced',
        lastChecked: new Date()
      };

      setSyncStatus(newStatus);
      
      if (newStatus.syncStatus === 'desynced') {
        toast({
          title: '⚠️ Desincronización detectada',
          description: 'La sesión cliente y servidor no están sincronizadas',
          variant: 'destructive'
        });
      }

      return newStatus;
    } catch (error) {
      console.error('❌ Comprehensive check failed:', error);
      setSyncStatus(prev => ({ 
        ...prev, 
        syncStatus: 'error',
        lastChecked: new Date()
      }));
      return null;
    }
  };

  // Deep session cleanup
  const performDeepCleanup = async () => {
    setIsResetting(true);
    try {
      console.log('🧹 Starting deep session cleanup...');
      
      toast({
        title: '🧹 Limpieza profunda',
        description: 'Eliminando todos los datos de sesión...'
      });

      // 1. Sign out from Supabase
      await supabase.auth.signOut();
      
      // 2. Clear all storage
      localStorage.clear();
      sessionStorage.clear();
      
      // 3. Clear auth-specific storage
      [
        'supabase.auth.token',
        'sb-ylooqmqmoufqtxvetxuj-auth-token',
        'supabase.auth.refreshToken',
        'supabase.auth.expiresAt'
      ].forEach(key => {
        localStorage.removeItem(key);
        sessionStorage.removeItem(key);
      });
      
      // 4. Clear cookies related to auth
      document.cookie.split(";").forEach(cookie => {
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
        if (name.includes('supabase') || name.includes('auth') || name.includes('session')) {
          document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
          document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=.${window.location.hostname}`;
        }
      });
      
      // 5. Wait for cleanup to propagate
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: '✅ Limpieza completada',
        description: 'Sesión completamente reiniciada. Recargando página...'
      });
      
      // 6. Force page reload
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      
    } catch (error) {
      console.error('❌ Deep cleanup failed:', error);
      toast({
        title: '❌ Error en limpieza',
        description: 'Error durante la limpieza profunda',
        variant: 'destructive'
      });
    } finally {
      setIsResetting(false);
    }
  };

  // Smart session refresh with fallback
  const performSmartRefresh = async () => {
    try {
      toast({
        title: '🔄 Sincronización inteligente',
        description: 'Intentando sincronizar sesión...'
      });

      // First try: Standard refresh
      const refreshResult = await forceSessionRefresh();
      
      if (refreshResult) {
        // Session will be updated by auth state listeners
        const checkResult = await performComprehensiveCheck();
        
        if (checkResult?.syncStatus === 'synced') {
          toast({
            title: '✅ Sincronización exitosa',
            description: 'Sesión sincronizada correctamente'
          });
          return;
        }
      }

      // Second try: Force session sync
      toast({
        title: '🔄 Segundo intento',
        description: 'Aplicando sincronización forzada...'
      });
      
      await forceSessionSync();
      
    } catch (error) {
      console.error('❌ Smart refresh failed:', error);
      toast({
        title: '❌ Sincronización fallida',
        description: 'Se requiere limpieza profunda',
        variant: 'destructive'
      });
    }
  };

  // Auto-sync monitoring
  useEffect(() => {
    if (!autoSyncEnabled) return;

    const interval = setInterval(async () => {
      if (user && session) {
        const status = await performComprehensiveCheck();
        if (status?.syncStatus === 'desynced') {
          console.log('🔄 Auto-sync: Desynchronization detected, attempting smart refresh...');
          await performSmartRefresh();
        }
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [autoSyncEnabled, user, session]);

  // Initial check
  useEffect(() => {
    performComprehensiveCheck();
  }, []);

  const getStatusIcon = (valid: boolean) => {
    return valid ? (
      <CheckCircle className="h-4 w-4 text-green-500" />
    ) : (
      <XCircle className="h-4 w-4 text-red-500" />
    );
  };

  const getStatusBadge = (valid: boolean, label: string) => {
    return (
      <Badge variant={valid ? "default" : "destructive"} className="flex items-center gap-1">
        {getStatusIcon(valid)}
        {label}
      </Badge>
    );
  };

  const getSyncStatusBadge = () => {
    switch (syncStatus.syncStatus) {
      case 'synced':
        return <Badge variant="default" className="bg-green-600">✅ Sincronizado</Badge>;
      case 'desynced':
        return <Badge variant="destructive">⚠️ Desincronizado</Badge>;
      case 'checking':
        return <Badge variant="secondary">🔍 Verificando...</Badge>;
      case 'error':
        return <Badge variant="destructive">❌ Error</Badge>;
      default:
        return <Badge variant="secondary">Desconocido</Badge>;
    }
  };

  return (
    <Card className="bg-background/95 border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Gestor de Sincronización de Sesión
        </CardTitle>
        <CardDescription>
          Diagnóstico avanzado y resolución automática de problemas de autenticación
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Status Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <div className="text-sm font-medium">Estado General</div>
            {getSyncStatusBadge()}
          </div>
          <div className="space-y-2">
            <div className="text-sm font-medium">Sesión Cliente</div>
            {getStatusBadge(syncStatus.clientSession, syncStatus.clientSession ? 'Activa' : 'Inactiva')}
          </div>
          <div className="space-y-2">
            <div className="text-sm font-medium">Auth Servidor</div>
            {getStatusBadge(syncStatus.serverAuth, syncStatus.serverAuth ? 'Válida' : 'Inválida')}
          </div>
          <div className="space-y-2">
            <div className="text-sm font-medium">Permisos Admin</div>
            {getStatusBadge(syncStatus.isAdmin, syncStatus.isAdmin ? 'Concedidos' : 'Denegados')}
          </div>
        </div>

        {/* Detailed Information */}
        <div className="bg-muted/50 rounded-lg p-4 space-y-4">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            <span className="font-medium">Detalles de Diagnóstico</span>
          </div>
          
          {/* Main diagnostics */}
          {diagnostics && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Email:</span> {diagnostics.clientSideSession.userEmail || 'N/A'}
              </div>
              <div>
                <span className="font-medium">Token válido:</span> {diagnostics.tokenValidity ? 'Sí' : 'No'}
              </div>
              <div>
                <span className="font-medium">Última verificación:</span> {syncStatus.lastChecked?.toLocaleTimeString() || 'N/A'}
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">Auto-sync:</span>
                <Badge variant={autoSyncEnabled ? "default" : "secondary"}>
                  {autoSyncEnabled ? 'Activado' : 'Desactivado'}
                </Badge>
              </div>
            </div>
          )}
          
          {/* Session Monitor Status */}
          <div className="border-t pt-3">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-4 w-4" />
              <span className="font-medium">Monitor Avanzado</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="font-medium">Monitoreo:</span>
                <Badge variant={sessionMonitor.isMonitoring ? "default" : "secondary"}>
                  {sessionMonitor.isMonitoring ? 'Activo' : 'Inactivo'}
                </Badge>
              </div>
              <div>
                <span className="font-medium">Fallos consecutivos:</span> {sessionMonitor.consecutiveFailures}
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">Auto-recuperación:</span>
                <Badge variant={sessionMonitor.autoRecoveryEnabled ? "default" : "secondary"}>
                  {sessionMonitor.autoRecoveryEnabled ? 'Habilitada' : 'Deshabilitada'}
                </Badge>
              </div>
            </div>
            {sessionMonitor.lastSuccessfulCheck && (
              <div className="text-xs text-muted-foreground mt-2">
                Última verificación exitosa: {sessionMonitor.lastSuccessfulCheck.toLocaleString()}
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          <Button 
            onClick={performComprehensiveCheck}
            disabled={isChecking}
            variant="outline"
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isChecking ? 'animate-spin' : ''}`} />
            Verificar Estado
          </Button>
          
          <Button 
            onClick={performSmartRefresh}
            disabled={isChecking || isResetting}
            variant="default"
            className="flex items-center gap-2"
          >
            <Activity className="h-4 w-4" />
            Sincronización Inteligente
          </Button>
          
          <Button 
            onClick={performDeepCleanup}
            disabled={isResetting}
            variant="destructive"
            className="flex items-center gap-2"
          >
            <Trash2 className={`h-4 w-4 ${isResetting ? 'animate-spin' : ''}`} />
            Limpieza Profunda
          </Button>
          
          <Button 
            onClick={() => setAutoSyncEnabled(!autoSyncEnabled)}
            variant="secondary"
            className="flex items-center gap-2"
          >
            <Clock className="h-4 w-4" />
            {autoSyncEnabled ? 'Desactivar' : 'Activar'} Auto-sync
          </Button>
          
          <Button 
            onClick={sessionMonitor.toggleAutoRecovery}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Shield className="h-4 w-4" />
            {sessionMonitor.autoRecoveryEnabled ? 'Deshabilitar' : 'Habilitar'} Auto-recuperación
          </Button>
          
          <Button 
            onClick={sessionMonitor.runMonitoringCheck}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Activity className="h-4 w-4" />
            Verificación Profunda
          </Button>
        </div>

        {/* Warning for desync */}
        {syncStatus.syncStatus === 'desynced' && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
              <div className="space-y-2">
                <div className="font-medium text-destructive">Desincronización Detectada</div>
                <div className="text-sm text-muted-foreground">
                  La sesión del cliente existe pero el servidor no reconoce la autenticación. 
                  Esto puede causar que auth.uid() retorne null en las consultas.
                </div>
                <div className="text-sm">
                  <strong>Soluciones recomendadas:</strong>
                  <ol className="list-decimal list-inside mt-2 space-y-1 text-muted-foreground">
                    <li>Intenta "Sincronización Inteligente" primero</li>
                    <li>Si persiste, usa "Limpieza Profunda" para reiniciar completamente</li>
                    <li>Verifica la configuración de Site URL y Redirect URLs en Supabase</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};