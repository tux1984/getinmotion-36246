import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, XCircle, RefreshCw, Activity } from 'lucide-react';
import { useSessionDiagnostics } from '@/hooks/useSessionDiagnostics';
import { useToast } from '@/hooks/use-toast';

export const SessionDiagnostics = () => {
  const { diagnostics, isChecking, runDiagnostics, forceSessionSync } = useSessionDiagnostics();
  const { toast } = useToast();
  const [isResetting, setIsResetting] = useState(false);

  const handleEmergencyReset = async () => {
    setIsResetting(true);
    try {
      await forceSessionSync();
    } catch (error) {
      console.error('Emergency reset failed:', error);
      toast({
        title: "❌ Error en reset",
        description: "Recarga la página manualmente",
        variant: "destructive"
      });
    } finally {
      setIsResetting(false);
    }
  };

  const getStatusIcon = (isValid: boolean) => {
    return isValid ? (
      <CheckCircle className="h-4 w-4 text-green-500" />
    ) : (
      <XCircle className="h-4 w-4 text-red-500" />
    );
  };

  const getStatusBadge = (isValid: boolean, label: string) => {
    return (
      <Badge variant={isValid ? "default" : "destructive"} className="text-xs">
        {isValid ? "✅" : "❌"} {label}
      </Badge>
    );
  };

  return (
    <Card className="border-blue-600 bg-blue-900/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-400">
          <Activity className="h-5 w-5" />
          Diagnóstico de Sesión
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        
        <div className="flex gap-2">
          <Button
            onClick={runDiagnostics}
            disabled={isChecking}
            variant="outline"
            size="sm"
            className="border-blue-600 text-blue-200 hover:bg-blue-900/20"
          >
            {isChecking ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Verificando...
              </>
            ) : (
              <>
                <Activity className="h-4 w-4 mr-2" />
                Ejecutar Diagnóstico
              </>
            )}
          </Button>

          {diagnostics && !diagnostics.tokenValidity && (
            <Button
              onClick={handleEmergencyReset}
              disabled={isResetting}
              variant="destructive"
              size="sm"
            >
              {isResetting ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Reseteando...
                </>
              ) : (
                <>
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Reset de Emergencia
                </>
              )}
            </Button>
          )}
        </div>

        {diagnostics && (
          <div className="space-y-3 mt-4 p-3 bg-gray-900/50 rounded-lg">
            <div className="text-sm text-gray-300">
              <strong>Último diagnóstico:</strong> {diagnostics.lastCheck?.toLocaleString('es-ES')}
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-blue-300">Cliente (Browser)</h4>
                <div className="space-y-1">
                  {getStatusBadge(diagnostics.clientSideSession.exists, "Sesión Existe")}
                  {getStatusBadge(diagnostics.clientSideSession.hasToken, "Token Presente")}
                  {diagnostics.clientSideSession.userEmail && (
                    <div className="text-xs text-gray-400">
                      Email: {diagnostics.clientSideSession.userEmail}
                    </div>
                  )}
                  {diagnostics.clientSideSession.error && (
                    <div className="text-xs text-red-400">
                      Error: {diagnostics.clientSideSession.error}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium text-green-300">Servidor (Supabase)</h4>
                <div className="space-y-1">
                  {getStatusBadge(diagnostics.tokenValidity, "Token Válido")}
                  {getStatusBadge(diagnostics.isAdmin, "Permisos Admin")}
                  {diagnostics.serverSideAuth?.valid === false && (
                    <div className="text-xs text-red-400">
                      Error: {diagnostics.serverSideAuth.error}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Problem identification */}
            {diagnostics.clientSideSession.exists && !diagnostics.tokenValidity && (
              <div className="p-2 bg-red-900/30 border border-red-600 rounded text-xs text-red-200">
                <div className="flex items-center gap-2 mb-1">
                  <AlertTriangle className="h-3 w-3" />
                  <strong>Problema Detectado:</strong>
                </div>
                <p>Sesión cliente válida pero auth.uid() es null en servidor.</p>
                <p>Esto indica desincronización de autenticación.</p>
                <p className="mt-1 font-medium">Solución: Usar Reset de Emergencia</p>
              </div>
            )}

            {diagnostics.tokenValidity && !diagnostics.isAdmin && (
              <div className="p-2 bg-yellow-900/30 border border-yellow-600 rounded text-xs text-yellow-200">
                <div className="flex items-center gap-2 mb-1">
                  <AlertTriangle className="h-3 w-3" />
                  <strong>Advertencia:</strong>
                </div>
                <p>Sesión válida pero sin permisos de administrador.</p>
              </div>
            )}

            {diagnostics.tokenValidity && diagnostics.isAdmin && (
              <div className="p-2 bg-green-900/30 border border-green-600 rounded text-xs text-green-200">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle className="h-3 w-3" />
                  <strong>Estado Óptimo:</strong>
                </div>
                <p>Sesión completamente funcional con permisos admin.</p>
              </div>
            )}
          </div>
        )}

        <div className="text-xs text-gray-400">
          Este diagnóstico verifica la sincronización entre la sesión del cliente y el servidor.
        </div>
      </CardContent>
    </Card>
  );
};