import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useRobustAuth } from '@/hooks/useRobustAuth';
import { robustSupabase, robustQuery } from '@/integrations/supabase/robust-client';
import { AlertTriangle, CheckCircle, XCircle, RefreshCw, Copy } from 'lucide-react';
import { toast } from 'sonner';

export const SupabaseDiagnostics: React.FC = () => {
  const { user, session } = useRobustAuth();
  const [diagnostics, setDiagnostics] = useState<any>({});
  const [testing, setTesting] = useState(false);

  const runDiagnostics = async () => {
    setTesting(true);
    const results: any = {};

    try {
      // Test 1: Basic client session
      results.clientSession = {
        hasUser: !!user,
        hasSession: !!session,
        hasAccessToken: !!session?.access_token,
        userEmail: user?.email,
        tokenExpiry: session?.expires_at ? new Date(session.expires_at * 1000) : null
      };

      // Test 2: Server-side auth.uid()
      try {
        const { data: serverUid, error } = await robustSupabase.rpc('is_admin');
        results.serverAuth = {
          success: !error,
          result: serverUid,
          error: error?.message
        };
      } catch (err) {
        results.serverAuth = {
          success: false,
          error: err instanceof Error ? err.message : 'Unknown error'
        };
      }

      // Test 3: Network headers diagnostic
      const originalFetch = window.fetch;
      let capturedHeaders: any = {};
      
      window.fetch = async (input, init) => {
        if (typeof input === 'string' && input.includes('supabase.co')) {
          capturedHeaders = init?.headers || {};
          console.log('🔍 Captured Supabase request headers:', capturedHeaders);
        }
        return originalFetch(input, init);
      };

      // Make a test request to capture headers
      await robustSupabase.rpc('is_admin');
      
      // Restore fetch
      window.fetch = originalFetch;

      results.networkHeaders = {
        authorization: capturedHeaders.authorization ? 'Present' : 'Missing',
        apikey: capturedHeaders.apikey ? 'Present' : 'Missing',
        contentType: capturedHeaders['content-type'] || 'Not set',
        clientInfo: capturedHeaders['x-client-info'] || 'Not set'
      };

      // Test 4: Current environment info
      results.environment = {
        currentUrl: window.location.href,
        origin: window.location.origin,
        userAgent: navigator.userAgent.substring(0, 50) + '...',
        timestamp: new Date().toISOString()
      };

      setDiagnostics(results);
    } catch (error) {
      console.error('Diagnostics error:', error);
      results.error = error instanceof Error ? error.message : 'Unknown error';
      setDiagnostics(results);
    } finally {
      setTesting(false);
    }
  };

  useEffect(() => {
    runDiagnostics();
  }, []);

  const copyDiagnostics = () => {
    const diagnosticsText = JSON.stringify(diagnostics, null, 2);
    navigator.clipboard.writeText(diagnosticsText);
    toast.success('Diagnósticos copiados al portapapeles');
  };

  const getStatusIcon = (status: boolean | undefined) => {
    if (status === true) return <CheckCircle className="h-4 w-4 text-green-500" />;
    if (status === false) return <XCircle className="h-4 w-4 text-red-500" />;
    return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Diagnóstico de Supabase</CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={copyDiagnostics}
              disabled={!diagnostics.clientSession}
            >
              <Copy className="h-4 w-4 mr-2" />
              Copiar
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={runDiagnostics}
              disabled={testing}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${testing ? 'animate-spin' : ''}`} />
              Ejecutar
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Client Session */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  {getStatusIcon(diagnostics.clientSession?.hasUser && diagnostics.clientSession?.hasSession)}
                  Sesión Cliente
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Usuario:</span>
                  <Badge variant={diagnostics.clientSession?.hasUser ? 'default' : 'destructive'}>
                    {diagnostics.clientSession?.hasUser ? 'Presente' : 'Ausente'}
                  </Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Sesión:</span>
                  <Badge variant={diagnostics.clientSession?.hasSession ? 'default' : 'destructive'}>
                    {diagnostics.clientSession?.hasSession ? 'Presente' : 'Ausente'}
                  </Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Token:</span>
                  <Badge variant={diagnostics.clientSession?.hasAccessToken ? 'default' : 'destructive'}>
                    {diagnostics.clientSession?.hasAccessToken ? 'Presente' : 'Ausente'}
                  </Badge>
                </div>
                {diagnostics.clientSession?.userEmail && (
                  <div className="text-xs text-muted-foreground break-all">
                    Email: {diagnostics.clientSession.userEmail}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Server Auth */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  {getStatusIcon(diagnostics.serverAuth?.success)}
                  Validación Servidor
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Estado:</span>
                  <Badge variant={diagnostics.serverAuth?.success ? 'default' : 'destructive'}>
                    {diagnostics.serverAuth?.success ? 'Éxito' : 'Error'}
                  </Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Resultado:</span>
                  <Badge variant={diagnostics.serverAuth?.result ? 'default' : 'secondary'}>
                    {String(diagnostics.serverAuth?.result || 'null')}
                  </Badge>
                </div>
                {diagnostics.serverAuth?.error && (
                  <div className="text-xs text-red-600 break-words">
                    Error: {diagnostics.serverAuth.error}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Network Headers */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                {getStatusIcon(diagnostics.networkHeaders?.authorization === 'Present')}
                Headers de Red
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex justify-between">
                  <span>Authorization:</span>
                  <Badge variant={diagnostics.networkHeaders?.authorization === 'Present' ? 'default' : 'destructive'}>
                    {diagnostics.networkHeaders?.authorization || 'Missing'}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>API Key:</span>
                  <Badge variant={diagnostics.networkHeaders?.apikey === 'Present' ? 'default' : 'destructive'}>
                    {diagnostics.networkHeaders?.apikey || 'Missing'}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Content-Type:</span>
                  <Badge variant="secondary">
                    {diagnostics.networkHeaders?.contentType || 'Not set'}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Client-Info:</span>
                  <Badge variant="secondary">
                    {diagnostics.networkHeaders?.clientInfo || 'Not set'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Environment */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Información del Entorno</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-2">
              <div className="text-xs space-y-1">
                <div><strong>URL:</strong> {diagnostics.environment?.currentUrl}</div>
                <div><strong>Origin:</strong> {diagnostics.environment?.origin}</div>
                <div><strong>Timestamp:</strong> {diagnostics.environment?.timestamp}</div>
              </div>
            </CardContent>
          </Card>

          {/* Configuration Recommendations */}
          <Card className="border-yellow-200 bg-yellow-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-yellow-800">Configuración Recomendada</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 text-sm text-yellow-700 space-y-2">
              <div><strong>Site URL:</strong> {diagnostics.environment?.origin}</div>
              <div><strong>Redirect URLs:</strong></div>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>{diagnostics.environment?.origin}/dashboard</li>
                <li>{diagnostics.environment?.origin}/admin</li>
                <li>{diagnostics.environment?.origin}/auth/callback</li>
              </ul>
              <div className="mt-4 p-3 bg-yellow-100 rounded border border-yellow-300">
                <div className="font-medium">Verificar en Supabase Dashboard:</div>
                <div>Authentication → URL Configuration</div>
                <div>Asegurar que Site URL coincida EXACTAMENTE</div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};