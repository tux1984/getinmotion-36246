import React, { useState } from 'react';
import { SupabaseDiagnostics } from '@/components/admin/SupabaseDiagnostics';
import { JWTStatusIndicator } from '@/components/dashboard/JWTStatusIndicator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useRobustAuth } from '@/hooks/useRobustAuth';
import { robustSupabase } from '@/integrations/supabase/robust-client';
import { Settings, Database, Shield, AlertTriangle } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const { user, session, jwtIntegrity } = useRobustAuth();
  const [testResults, setTestResults] = useState<any>(null);
  const [testing, setTesting] = useState(false);

  const runConnectivityTest = async () => {
    setTesting(true);
    try {
      const startTime = Date.now();
      const { data, error } = await robustSupabase.rpc('is_admin');
      const endTime = Date.now();
      
      setTestResults({
        success: !error,
        data,
        error: error?.message,
        latency: endTime - startTime,
        timestamp: new Date().toISOString()
      });
    } catch (err) {
      setTestResults({
        success: false,
        error: err instanceof Error ? err.message : 'Unknown error',
        timestamp: new Date().toISOString()
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Panel de Administración</h1>
        <div className="flex items-center gap-4">
          <JWTStatusIndicator />
          <Badge variant="outline" className="text-sm">
            Modo Bypass Temporal
          </Badge>
        </div>
      </div>

      {/* Quick Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estado de Sesión</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {user && session ? 'Activa' : 'Inactiva'}
            </div>
            <p className="text-xs text-muted-foreground">
              Usuario: {user?.email || 'No autenticado'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">JWT Status</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">
              {jwtIntegrity || 'Desconocido'}
            </div>
            <p className="text-xs text-muted-foreground">
              Integridad del token de autenticación
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conectividad</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {testResults ? (testResults.success ? 'OK' : 'Error') : 'No probado'}
            </div>
            <p className="text-xs text-muted-foreground">
              {testResults?.latency ? `${testResults.latency}ms` : 'Latencia desconocida'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Warning Banner */}
      <Card className="border-orange-200 bg-orange-50">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            <div className="flex-1">
              <h3 className="font-medium text-orange-800">Modo Bypass Temporal Activo</h3>
              <p className="text-sm text-orange-700 mt-1">
                La validación JWT del servidor está siendo omitida temporalmente. 
                Usa los diagnósticos para resolver el problema de configuración de Supabase.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Tabs defaultValue="diagnostics" className="space-y-4">
        <TabsList>
          <TabsTrigger value="diagnostics">Diagnósticos</TabsTrigger>
          <TabsTrigger value="testing">Pruebas de Conectividad</TabsTrigger>
        </TabsList>

        <TabsContent value="diagnostics">
          <SupabaseDiagnostics />
        </TabsContent>

        <TabsContent value="testing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pruebas de Conectividad</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={runConnectivityTest} 
                disabled={testing}
                className="w-full md:w-auto"
              >
                {testing ? 'Probando...' : 'Probar Conexión a Supabase'}
              </Button>

              {testResults && (
                <Card className={testResults.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
                  <CardContent className="pt-6">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Estado:</span>
                        <Badge variant={testResults.success ? 'default' : 'destructive'}>
                          {testResults.success ? 'Éxito' : 'Error'}
                        </Badge>
                      </div>
                      {testResults.latency && (
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Latencia:</span>
                          <span>{testResults.latency}ms</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Resultado:</span>
                        <span className="font-mono text-sm">{JSON.stringify(testResults.data)}</span>
                      </div>
                      {testResults.error && (
                        <div className="mt-2 p-2 bg-red-100 rounded text-sm text-red-700">
                          Error: {testResults.error}
                        </div>
                      )}
                      <div className="text-xs text-muted-foreground">
                        Ejecutado: {new Date(testResults.timestamp).toLocaleString()}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;