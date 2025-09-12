// ============= FASE 3.4: SISTEMA DE MONITOREO Y LOGGING =============

import { logger } from './logger';

export interface SystemMetrics {
  timestamp: Date;
  userId?: string;
  sessionId: string;
  metrics: {
    performance: PerformanceMetrics;
    errors: ErrorMetrics;
    usage: UsageMetrics;
    system: SystemHealthMetrics;
  };
}

export interface PerformanceMetrics {
  apiResponseTime: number;
  uiRenderTime: number;
  memoryUsage: number;
  taskOperationTime: number;
  databaseQueryTime: number;
}

export interface ErrorMetrics {
  errorCount: number;
  criticalErrors: number;
  errorRate: number;
  mostCommonError: string;
  errorTrends: Array<{ timestamp: Date; count: number }>;
}

export interface UsageMetrics {
  activeUsers: number;
  tasksCreated: number;
  tasksCompleted: number;
  apiCallsCount: number;
  sessionDuration: number;
}

export interface SystemHealthMetrics {
  uptime: number;
  responseLatency: number;
  throughput: number;
  errorRate: number;
  systemLoad: 'low' | 'medium' | 'high' | 'critical';
}

export interface Alert {
  id: string;
  type: 'performance' | 'error' | 'usage' | 'security';
  severity: 'info' | 'warning' | 'critical';
  message: string;
  timestamp: Date;
  metrics: any;
  acknowledged: boolean;
}

export class SystemMonitor {
  private static metrics: SystemMetrics[] = [];
  private static alerts: Alert[] = [];
  private static isMonitoring = false;
  private static monitoringInterval?: NodeJS.Timeout;
  private static sessionId = this.generateSessionId();
  
  // Configuración de umbrales para alertas
  private static thresholds = {
    performance: {
      apiResponseTime: 5000, // 5 segundos
      uiRenderTime: 1000,    // 1 segundo
      memoryUsage: 100,      // 100MB
    },
    errors: {
      errorRate: 0.05,       // 5% de operaciones
      criticalErrorCount: 3, // 3 errores críticos
    },
    usage: {
      maxTasksPerUser: 15,
      maxApiCallsPerMinute: 60,
    }
  };

  // Iniciar monitoreo del sistema
  static startMonitoring(intervalMs: number = 30000) {
    if (this.isMonitoring) return;
    
    this.isMonitoring = true;
    this.monitoringInterval = setInterval(() => {
      this.collectMetrics();
    }, intervalMs);

    logger.system.info('System monitoring started', { 
      sessionId: this.sessionId,
      interval: intervalMs 
    });
  }

  // Detener monitoreo
  static stopMonitoring() {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = undefined;
    }
    this.isMonitoring = false;
    
    logger.system.info('System monitoring stopped', { 
      sessionId: this.sessionId 
    });
  }

  // Recopilar métricas del sistema
  private static collectMetrics() {
    const timestamp = new Date();
    
    const metrics: SystemMetrics = {
      timestamp,
      sessionId: this.sessionId,
      metrics: {
        performance: this.collectPerformanceMetrics(),
        errors: this.collectErrorMetrics(),
        usage: this.collectUsageMetrics(),
        system: this.collectSystemHealthMetrics()
      }
    };

    this.metrics.push(metrics);
    this.checkThresholds(metrics);
    
    // Mantener solo las últimas 1000 métricas
    if (this.metrics.length > 1000) {
      this.metrics = this.metrics.slice(-1000);
    }
  }

  // Recopilar métricas de rendimiento
  private static collectPerformanceMetrics(): PerformanceMetrics {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const memory = (performance as any).memory;

    return {
      apiResponseTime: this.getAverageAPIResponseTime(),
      uiRenderTime: navigation ? navigation.loadEventEnd - navigation.loadEventStart : 0,
      memoryUsage: memory ? memory.usedJSHeapSize / 1024 / 1024 : 0, // MB
      taskOperationTime: this.getAverageTaskOperationTime(),
      databaseQueryTime: this.getAverageDatabaseQueryTime()
    };
  }

  // Recopilar métricas de errores
  private static collectErrorMetrics(): ErrorMetrics {
    const recentErrors = this.getRecentErrors();
    const errorCount = recentErrors.length;
    const criticalErrors = recentErrors.filter(e => e.severity === 'critical').length;
    
    return {
      errorCount,
      criticalErrors,
      errorRate: errorCount / Math.max(this.getTotalOperations(), 1),
      mostCommonError: this.getMostCommonError(recentErrors),
      errorTrends: this.getErrorTrends()
    };
  }

  // Recopilar métricas de uso
  private static collectUsageMetrics(): UsageMetrics {
    return {
      activeUsers: this.getActiveUsersCount(),
      tasksCreated: this.getTasksCreatedCount(),
      tasksCompleted: this.getTasksCompletedCount(),
      apiCallsCount: this.getAPICallsCount(),
      sessionDuration: Date.now() - this.getSessionStartTime()
    };
  }

  // Recopilar métricas de salud del sistema
  private static collectSystemHealthMetrics(): SystemHealthMetrics {
    const responseLatency = this.getAverageResponseLatency();
    const errorRate = this.getSystemErrorRate();
    
    let systemLoad: SystemHealthMetrics['systemLoad'] = 'low';
    if (errorRate > 0.1 || responseLatency > 3000) systemLoad = 'critical';
    else if (errorRate > 0.05 || responseLatency > 2000) systemLoad = 'high';
    else if (errorRate > 0.02 || responseLatency > 1000) systemLoad = 'medium';

    return {
      uptime: Date.now() - this.getSessionStartTime(),
      responseLatency,
      throughput: this.getThroughput(),
      errorRate,
      systemLoad
    };
  }

  // Verificar umbrales y generar alertas
  private static checkThresholds(metrics: SystemMetrics) {
    const { performance, errors, usage, system } = metrics.metrics;

    // Alertas de rendimiento
    if (performance.apiResponseTime > this.thresholds.performance.apiResponseTime) {
      this.createAlert('performance', 'warning', 
        `API response time is high: ${performance.apiResponseTime}ms`, 
        { apiResponseTime: performance.apiResponseTime }
      );
    }

    if (performance.memoryUsage > this.thresholds.performance.memoryUsage) {
      this.createAlert('performance', 'warning',
        `Memory usage is high: ${performance.memoryUsage.toFixed(2)}MB`,
        { memoryUsage: performance.memoryUsage }
      );
    }

    // Alertas de errores
    if (errors.criticalErrors >= this.thresholds.errors.criticalErrorCount) {
      this.createAlert('error', 'critical',
        `Critical error threshold reached: ${errors.criticalErrors} errors`,
        { criticalErrors: errors.criticalErrors }
      );
    }

    if (errors.errorRate > this.thresholds.errors.errorRate) {
      this.createAlert('error', 'warning',
        `Error rate is high: ${(errors.errorRate * 100).toFixed(2)}%`,
        { errorRate: errors.errorRate }
      );
    }

    // Alertas de salud del sistema
    if (system.systemLoad === 'critical') {
      this.createAlert('performance', 'critical',
        'System load is critical - immediate attention required',
        { systemLoad: system.systemLoad, responseLatency: system.responseLatency }
      );
    }
  }

  // Crear alerta
  private static createAlert(
    type: Alert['type'],
    severity: Alert['severity'],
    message: string,
    metrics: any
  ) {
    const alert: Alert = {
      id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      severity,
      message,
      timestamp: new Date(),
      metrics,
      acknowledged: false
    };

    this.alerts.push(alert);
    
    // Logging de alerta
    logger.system.alert(message, {
      alertId: alert.id,
      type,
      severity,
      metrics
    });

    // Mantener solo las últimas 100 alertas
    if (this.alerts.length > 100) {
      this.alerts = this.alerts.slice(-100);
    }
  }

  // Métodos auxiliares para obtener datos
  private static getAverageAPIResponseTime(): number {
    // Implementar basado en métricas reales de la aplicación
    return Math.random() * 2000 + 500; // Placeholder
  }

  private static getAverageTaskOperationTime(): number {
    return Math.random() * 1000 + 200; // Placeholder
  }

  private static getAverageDatabaseQueryTime(): number {
    return Math.random() * 500 + 100; // Placeholder
  }

  private static getRecentErrors(): Array<{ severity: string }> {
    // Obtener errores de EnhancedErrorHandler si está disponible
    return []; // Placeholder
  }

  private static getTotalOperations(): number {
    return 100; // Placeholder
  }

  private static getMostCommonError(errors: any[]): string {
    return errors.length > 0 ? 'Generic error' : 'No errors'; // Placeholder
  }

  private static getErrorTrends(): Array<{ timestamp: Date; count: number }> {
    return []; // Placeholder
  }

  private static getActiveUsersCount(): number {
    return 1; // Placeholder
  }

  private static getTasksCreatedCount(): number {
    return Math.floor(Math.random() * 50); // Placeholder
  }

  private static getTasksCompletedCount(): number {
    return Math.floor(Math.random() * 30); // Placeholder
  }

  private static getAPICallsCount(): number {
    return Math.floor(Math.random() * 200); // Placeholder
  }

  private static getSessionStartTime(): number {
    return Date.now() - 3600000; // 1 hora atrás como placeholder
  }

  private static getAverageResponseLatency(): number {
    return Math.random() * 1500 + 200; // Placeholder
  }

  private static getSystemErrorRate(): number {
    return Math.random() * 0.02; // 0-2% como placeholder
  }

  private static getThroughput(): number {
    return Math.random() * 100 + 50; // requests/minute como placeholder
  }

  private static generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Métodos públicos para obtener información del sistema
  static getSystemStatus(): {
    isHealthy: boolean;
    currentLoad: SystemHealthMetrics['systemLoad'];
    recentAlerts: Alert[];
    uptime: number;
  } {
    const latestMetrics = this.metrics[this.metrics.length - 1];
    const recentAlerts = this.alerts.filter(alert => 
      Date.now() - alert.timestamp.getTime() < 24 * 60 * 60 * 1000 // Últimas 24h
    );

    return {
      isHealthy: !recentAlerts.some(alert => alert.severity === 'critical'),
      currentLoad: latestMetrics?.metrics.system.systemLoad || 'low',
      recentAlerts: recentAlerts.slice(-10),
      uptime: latestMetrics?.metrics.system.uptime || 0
    };
  }

  static getPerformanceReport(): {
    averageResponseTime: number;
    errorRate: number;
    throughput: number;
    trends: SystemMetrics[];
  } {
    const recentMetrics = this.metrics.slice(-24); // Últimas 24 mediciones
    
    const avgResponseTime = recentMetrics.reduce((sum, m) => 
      sum + m.metrics.performance.apiResponseTime, 0
    ) / Math.max(recentMetrics.length, 1);

    const avgErrorRate = recentMetrics.reduce((sum, m) => 
      sum + m.metrics.errors.errorRate, 0
    ) / Math.max(recentMetrics.length, 1);

    const avgThroughput = recentMetrics.reduce((sum, m) => 
      sum + m.metrics.system.throughput, 0
    ) / Math.max(recentMetrics.length, 1);

    return {
      averageResponseTime: avgResponseTime,
      errorRate: avgErrorRate,
      throughput: avgThroughput,
      trends: recentMetrics
    };
  }

  static acknowledgeAlert(alertId: string): boolean {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.acknowledged = true;
      logger.system.info('Alert acknowledged', { alertId });
      return true;
    }
    return false;
  }

  static getUnacknowledgedAlerts(): Alert[] {
    return this.alerts.filter(alert => !alert.acknowledged);
  }
}