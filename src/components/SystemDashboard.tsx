// ============= FASE 3.4: DASHBOARD DE MONITOREO DEL SISTEMA =============

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  TrendingDown,
  Activity,
  Database,
  Zap,
  Users,
  RefreshCw
} from 'lucide-react';
import { SystemMonitor, Alert } from '@/utils/systemMonitoring';
import { EnhancedErrorHandler } from '@/utils/enhancedErrorHandling';
import { useNotifications } from '@/components/EnhancedNotifications';
import { supabase } from '@/integrations/supabase/client';

interface SystemDashboardProps {
  className?: string;
}

export function SystemDashboard({ className }: SystemDashboardProps) {
  const [systemStatus, setSystemStatus] = useState<any>(null);
  const [performanceReport, setPerformanceReport] = useState<any>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [validationStats, setValidationStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { info, warning, error } = useNotifications();

  useEffect(() => {
    initializeMonitoring();
    loadSystemData();
  }, []);

  const initializeMonitoring = () => {
    // Iniciar monitoreo del sistema
    SystemMonitor.startMonitoring(30000); // Cada 30 segundos

    return () => {
      SystemMonitor.stopMonitoring();
    };
  };

  const loadSystemData = async () => {
    try {
      setIsLoading(true);

      // Obtener estado del sistema
      const status = SystemMonitor.getSystemStatus();
      setSystemStatus(status);

      // Obtener reporte de rendimiento
      const report = SystemMonitor.getPerformanceReport();
      setPerformanceReport(report);

      // Obtener alertas no reconocidas
      const unacknowledgedAlerts = SystemMonitor.getUnacknowledgedAlerts();
      setAlerts(unacknowledgedAlerts);

      // Obtener estadísticas de validación de la base de datos
      await loadValidationStats();

    } catch (err) {
      console.error('Error loading system data:', err);
      error('Error del sistema', 'No se pudieron cargar las métricas del sistema');
    } finally {
      setIsLoading(false);
    }
  };

  const loadValidationStats = async () => {
    try {
      const { data, error: dbError } = await supabase
        .rpc('get_validation_stats');

      if (dbError) throw dbError;
      setValidationStats(data);
    } catch (err) {
      console.error('Error loading validation stats:', err);
    }
  };

  const handleAcknowledgeAlert = (alertId: string) => {
    SystemMonitor.acknowledgeAlert(alertId);
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
    info('Alerta reconocida', 'La alerta ha sido marcada como reconocida');
  };

  const handleRefreshData = () => {
    loadSystemData();
    info('Datos actualizados', 'Las métricas del sistema se han actualizado');
  };

  const getSystemHealthColor = (load: string) => {
    switch (load) {
      case 'low': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'high': return 'bg-orange-500';
      case 'critical': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getAlertVariant = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'warning': return 'secondary';
      case 'info': return 'outline';
      default: return 'outline';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="w-6 h-6 animate-spin mr-2" />
        <span>Cargando métricas del sistema...</span>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Monitoreo del Sistema</h2>
          <p className="text-muted-foreground">
            Estado de salud y métricas de rendimiento en tiempo real
          </p>
        </div>
        <Button onClick={handleRefreshData} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Actualizar
        </Button>
      </div>

      {/* Estado General del Sistema */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${getSystemHealthColor(systemStatus?.currentLoad)}`} />
              <div>
                <p className="text-sm font-medium">Estado del Sistema</p>
                <p className="text-2xl font-bold">
                  {systemStatus?.isHealthy ? 'Saludable' : 'Degradado'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Tiempo Activo</p>
                <p className="text-2xl font-bold">
                  {Math.floor((systemStatus?.uptime || 0) / (1000 * 60 * 60))}h
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-yellow-500" />
              <div>
                <p className="text-sm font-medium">Alertas Activas</p>
                <p className="text-2xl font-bold">{alerts.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-sm font-medium">Rendimiento</p>
                <p className="text-2xl font-bold">
                  {performanceReport?.averageResponseTime ? 
                    `${Math.round(performanceReport.averageResponseTime)}ms` : 'N/A'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="alerts" className="space-y-4">
        <TabsList>
          <TabsTrigger value="alerts">Alertas</TabsTrigger>
          <TabsTrigger value="performance">Rendimiento</TabsTrigger>
          <TabsTrigger value="validation">Validación</TabsTrigger>
          <TabsTrigger value="errors">Errores</TabsTrigger>
        </TabsList>

        {/* Tab de Alertas */}
        <TabsContent value="alerts">
          <Card>
            <CardHeader>
              <CardTitle>Alertas del Sistema</CardTitle>
              <CardDescription>
                Alertas que requieren atención inmediata
              </CardDescription>
            </CardHeader>
            <CardContent>
              {alerts.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                  <p className="text-lg font-medium">Sin alertas activas</p>
                  <p className="text-muted-foreground">
                    El sistema está funcionando correctamente
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {alerts.map((alert) => (
                    <div
                      key={alert.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <AlertTriangle className="w-5 h-5 text-yellow-500" />
                        <div>
                          <div className="flex items-center space-x-2">
                            <p className="font-medium">{alert.message}</p>
                            <Badge variant={getAlertVariant(alert.severity)}>
                              {alert.severity}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {new Date(alert.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleAcknowledgeAlert(alert.id)}
                      >
                        Reconocer
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab de Rendimiento */}
        <TabsContent value="performance">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Tiempo de Respuesta</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm">
                      <span>Promedio</span>
                      <span>{Math.round(performanceReport?.averageResponseTime || 0)}ms</span>
                    </div>
                    <Progress 
                      value={Math.min((performanceReport?.averageResponseTime || 0) / 3000 * 100, 100)} 
                      className="mt-2"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tasa de Errores</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm">
                      <span>Porcentaje</span>
                      <span>{((performanceReport?.errorRate || 0) * 100).toFixed(2)}%</span>
                    </div>
                    <Progress 
                      value={(performanceReport?.errorRate || 0) * 100} 
                      className="mt-2"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab de Validación */}
        <TabsContent value="validation">
          <Card>
            <CardHeader>
              <CardTitle>Estadísticas de Validación</CardTitle>
              <CardDescription>
                Métricas de validación de datos y límites del sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              {validationStats ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold">{validationStats.total_tasks}</p>
                    <p className="text-sm text-muted-foreground">Tareas Totales</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">{validationStats.active_tasks}</p>
                    <p className="text-sm text-muted-foreground">Tareas Activas</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">{validationStats.users_with_tasks}</p>
                    <p className="text-sm text-muted-foreground">Usuarios Activos</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">{validationStats.tasks_over_limit}</p>
                    <p className="text-sm text-muted-foreground">Usuarios Sobre Límite</p>
                  </div>
                </div>
              ) : (
                <p className="text-center text-muted-foreground">
                  No se pudieron cargar las estadísticas de validación
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab de Errores */}
        <TabsContent value="errors">
          <Card>
            <CardHeader>
              <CardTitle>Estadísticas de Errores</CardTitle>
              <CardDescription>
                Análisis de errores recientes y tendencias
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ErrorStatistics />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Componente para estadísticas de errores
function ErrorStatistics() {
  const [errorStats, setErrorStats] = useState<any>(null);

  useEffect(() => {
    const stats = EnhancedErrorHandler.getErrorStats();
    setErrorStats(stats);
  }, []);

  if (!errorStats) {
    return <p className="text-center text-muted-foreground">No hay datos de errores disponibles</p>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center p-4 bg-red-50 rounded-lg">
          <p className="text-2xl font-bold text-red-700">{errorStats.bySeverity.critical}</p>
          <p className="text-sm text-red-600">Críticos</p>
        </div>
        <div className="text-center p-4 bg-orange-50 rounded-lg">
          <p className="text-2xl font-bold text-orange-700">{errorStats.bySeverity.high}</p>
          <p className="text-sm text-orange-600">Alto</p>
        </div>
        <div className="text-center p-4 bg-yellow-50 rounded-lg">
          <p className="text-2xl font-bold text-yellow-700">{errorStats.bySeverity.medium}</p>
          <p className="text-sm text-yellow-600">Medio</p>
        </div>
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <p className="text-2xl font-bold text-blue-700">{errorStats.bySeverity.low}</p>
          <p className="text-sm text-blue-600">Bajo</p>
        </div>
      </div>

      <div>
        <h4 className="font-medium mb-3">Errores por Contexto</h4>
        <div className="space-y-2">
          {Object.entries(errorStats.byContext).map(([context, count]) => (
            <div key={context} className="flex justify-between items-center">
              <span className="text-sm">{context}</span>
              <Badge variant="outline">{count as number}</Badge>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium mb-2">Tendencias (Últimas 24h)</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Total: </span>
            <span className="font-medium">{errorStats.recentTrends.totalLast24h}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Promedio/hora: </span>
            <span className="font-medium">{errorStats.recentTrends.averagePerHour.toFixed(1)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}