// ============= FASE 3.2: MANEJO DE ERRORES FRONTEND MEJORADO =============

import { logger } from './logger';

export type ErrorSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface EnhancedError {
  id: string;
  message: string;
  severity: ErrorSeverity;
  context: string;
  timestamp: Date;
  stack?: string;
  userActions?: string[];
  metadata?: Record<string, any>;
}

export interface ErrorContext {
  component: string;
  action: string;
  userId?: string;
  additionalData?: Record<string, any>;
}

export interface RetryOptions {
  maxAttempts: number;
  baseDelay: number;
  backoffMultiplier: number;
  shouldRetry?: (error: Error, attempt: number) => boolean;
}

export class EnhancedErrorHandler {
  private static errorQueue: EnhancedError[] = [];
  private static maxQueueSize = 100;
  private static notificationCallbacks: Array<(error: EnhancedError) => void> = [];

  // Registrar callback para notificaciones
  static onError(callback: (error: EnhancedError) => void) {
    this.notificationCallbacks.push(callback);
  }

  // Crear error mejorado con contexto
  static createError(
    error: Error | string,
    context: ErrorContext,
    severity: ErrorSeverity = 'medium'
  ): EnhancedError {
    const errorMessage = typeof error === 'string' ? error : error.message;
    const stack = typeof error === 'object' ? error.stack : undefined;

    const enhancedError: EnhancedError = {
      id: `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      message: errorMessage,
      severity,
      context: `${context.component}:${context.action}`,
      timestamp: new Date(),
      stack,
      userActions: this.generateUserActions(errorMessage, context),
      metadata: {
        userId: context.userId,
        ...context.additionalData
      }
    };

    this.addToQueue(enhancedError);
    this.logError(enhancedError);
    this.notifyCallbacks(enhancedError);

    return enhancedError;
  }

  // Manejar errores específicos de tareas
  static handleTaskError(
    error: Error | string,
    action: string,
    taskData?: any
  ): EnhancedError {
    const errorMessage = typeof error === 'string' ? error : error.message;
    let severity: ErrorSeverity = 'medium';
    
    // Determinar severidad basada en el tipo de error
    if (errorMessage.includes('TASK_LIMIT_EXCEEDED')) {
      severity = 'low';
    } else if (errorMessage.includes('network') || errorMessage.includes('timeout')) {
      severity = 'medium';
    } else if (errorMessage.includes('permission') || errorMessage.includes('unauthorized')) {
      severity = 'high';
    } else if (errorMessage.includes('database') || errorMessage.includes('fatal')) {
      severity = 'critical';
    }

    return this.createError(error, {
      component: 'TaskManager',
      action,
      additionalData: { taskData }
    }, severity);
  }

  // Manejar errores de API con reintentos automáticos
  static async handleAPIError<T>(
    apiCall: () => Promise<T>,
    context: ErrorContext,
    retryOptions?: Partial<RetryOptions>
  ): Promise<T> {
    const options: RetryOptions = {
      maxAttempts: 3,
      baseDelay: 1000,
      backoffMultiplier: 2,
      shouldRetry: (error) => this.isRetryableError(error),
      ...retryOptions
    };

    let lastError: Error;
    
    for (let attempt = 1; attempt <= options.maxAttempts; attempt++) {
      try {
        return await apiCall();
      } catch (error) {
        lastError = error as Error;
        
        const enhancedError = this.createError(lastError, {
          ...context,
          action: `${context.action}_attempt_${attempt}`
        });

        // Si no es reintentable o es el último intento, lanzar error
        if (!options.shouldRetry!(lastError, attempt) || attempt === options.maxAttempts) {
          throw enhancedError;
        }

        // Esperar antes del siguiente intento
        const delay = options.baseDelay * Math.pow(options.backoffMultiplier, attempt - 1);
        await this.sleep(delay);
        
        logger.system.retry(`Retry attempt ${attempt} for ${context.action}`, {
          delay,
          error: lastError.message
        });
      }
    }

    throw lastError!;
  }

  // Validar si un error es reintentable
  private static isRetryableError(error: Error): boolean {
    const retryablePatterns = [
      /network/i,
      /timeout/i,
      /connection/i,
      /5\d{2}/,  // Server errors
      /429/,     // Rate limit
      /502|503|504/  // Gateway errors
    ];

    return retryablePatterns.some(pattern => 
      pattern.test(error.message) || 
      pattern.test(error.name)
    );
  }

  // Generar acciones sugeridas para el usuario
  private static generateUserActions(errorMessage: string, context: ErrorContext): string[] {
    const actions: string[] = [];

    // Acciones específicas por tipo de error
    if (errorMessage.includes('network') || errorMessage.includes('connection')) {
      actions.push('Verifica tu conexión a internet');
      actions.push('Intenta nuevamente en unos momentos');
    }

    if (errorMessage.includes('limit') || errorMessage.includes('límite')) {
      actions.push('Reduce el número de elementos');
      actions.push('Completa algunas tareas pendientes');
    }

    if (errorMessage.includes('permission') || errorMessage.includes('unauthorized')) {
      actions.push('Verifica que tienes los permisos necesarios');
      actions.push('Intenta cerrar sesión y volver a iniciar');
    }

    if (errorMessage.includes('validation') || errorMessage.includes('format')) {
      actions.push('Revisa el formato de los datos ingresados');
      actions.push('Verifica que todos los campos requeridos estén completos');
    }

    // Acciones genéricas si no hay específicas
    if (actions.length === 0) {
      actions.push('Intenta recargar la página');
      actions.push('Si el problema persiste, contacta soporte');
    }

    return actions;
  }

  // Agregar error a la cola
  private static addToQueue(error: EnhancedError) {
    this.errorQueue.push(error);
    
    // Mantener tamaño de cola
    if (this.errorQueue.length > this.maxQueueSize) {
      this.errorQueue = this.errorQueue.slice(-this.maxQueueSize);
    }
  }

  // Logging estructurado del error
  private static logError(error: EnhancedError) {
    const logData = {
      errorId: error.id,
      context: error.context,
      severity: error.severity,
      timestamp: error.timestamp.toISOString(),
      ...error.metadata
    };

    switch (error.severity) {
      case 'critical':
        logger.system.critical(error.message, logData);
        break;
      case 'high':
        logger.system.error(error.message, logData);
        break;
      case 'medium':
        logger.system.warning(error.message, logData);
        break;
      case 'low':
        logger.system.info(error.message, logData);
        break;
    }
  }

  // Notificar a callbacks registrados
  private static notifyCallbacks(error: EnhancedError) {
    this.notificationCallbacks.forEach(callback => {
      try {
        callback(error);
      } catch (callbackError) {
        console.error('Error in error notification callback:', callbackError);
      }
    });
  }

  // Utilidad para sleep
  private static sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Obtener errores recientes para debugging
  static getRecentErrors(limit: number = 10): EnhancedError[] {
    return this.errorQueue.slice(-limit);
  }

  // Limpiar cola de errores
  static clearErrorQueue() {
    this.errorQueue = [];
  }

  // Obtener estadísticas de errores
  static getErrorStats() {
    const stats = {
      total: this.errorQueue.length,
      bySeverity: {
        critical: 0,
        high: 0,
        medium: 0,
        low: 0
      },
      byContext: {} as Record<string, number>,
      recentTrends: this.getRecentTrends()
    };

    this.errorQueue.forEach(error => {
      stats.bySeverity[error.severity]++;
      stats.byContext[error.context] = (stats.byContext[error.context] || 0) + 1;
    });

    return stats;
  }

  // Analizar tendencias recientes
  private static getRecentTrends() {
    const last24h = this.errorQueue.filter(
      error => Date.now() - error.timestamp.getTime() < 24 * 60 * 60 * 1000
    );

    const trends = {
      totalLast24h: last24h.length,
      averagePerHour: last24h.length / 24,
      mostCommonContext: '',
      mostCommonError: ''
    };

    // Encontrar contexto más común
    const contextCounts = {} as Record<string, number>;
    const messageCounts = {} as Record<string, number>;

    last24h.forEach(error => {
      contextCounts[error.context] = (contextCounts[error.context] || 0) + 1;
      messageCounts[error.message] = (messageCounts[error.message] || 0) + 1;
    });

    trends.mostCommonContext = Object.keys(contextCounts).reduce((a, b) => 
      contextCounts[a] > contextCounts[b] ? a : b, ''
    );

    trends.mostCommonError = Object.keys(messageCounts).reduce((a, b) => 
      messageCounts[a] > messageCounts[b] ? a : b, ''
    );

    return trends;
  }
}

// Hook para manejo de errores en React
export function useEnhancedErrorHandler() {
  const handleError = (
    error: Error | string,
    context: ErrorContext,
    severity?: ErrorSeverity
  ) => {
    return EnhancedErrorHandler.createError(error, context, severity);
  };

  const handleTaskError = (
    error: Error | string,
    action: string,
    taskData?: any
  ) => {
    return EnhancedErrorHandler.handleTaskError(error, action, taskData);
  };

  const handleAPICall = async <T>(
    apiCall: () => Promise<T>,
    context: ErrorContext,
    retryOptions?: Partial<RetryOptions>
  ): Promise<T> => {
    return EnhancedErrorHandler.handleAPIError(apiCall, context, retryOptions);
  };

  return {
    handleError,
    handleTaskError,
    handleAPICall,
    getRecentErrors: EnhancedErrorHandler.getRecentErrors,
    getErrorStats: EnhancedErrorHandler.getErrorStats
  };
}