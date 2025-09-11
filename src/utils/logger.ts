type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'critical';

interface LogContext {
  userId?: string;
  userEmail?: string;
  action?: string;
  component?: string;
  ip?: string;
  userAgent?: string;
  sessionId?: string;
  requestId?: string;
  [key: string]: any;
}

interface AuditLogEntry {
  timestamp: string;
  userId?: string;
  userEmail?: string;
  action: string;
  resource?: string;
  oldValue?: any;
  newValue?: any;
  ip?: string;
  userAgent?: string;
  success: boolean;
  errorMessage?: string;
}

class Logger {
  private isDevelopment = import.meta.env.DEV;
  private auditLog: AuditLogEntry[] = [];

  private formatMessage(level: LogLevel, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString();
    const contextStr = context ? ` | Context: ${JSON.stringify(context)}` : '';
    return `[${timestamp}] ${level.toUpperCase()}: ${message}${contextStr}`;
  }

  private getClientInfo(): { ip?: string; userAgent?: string } {
    if (typeof window === 'undefined') return {};
    
    return {
      userAgent: navigator.userAgent,
      // IP will be captured server-side
    };
  }

  private sendToRemoteLogging(level: LogLevel, message: string, context?: LogContext): void {
    // In production, send critical logs to remote logging service
    if (!this.isDevelopment && (level === 'error' || level === 'critical')) {
      // This would integrate with your logging service (DataDog, Sentry, etc.)
      console.warn('Remote logging not configured for production');
    }
  }

  debug(message: string, context?: LogContext): void {
    if (this.isDevelopment) {
      console.log(this.formatMessage('debug', message, context));
    }
  }

  info(message: string, context?: LogContext): void {
    if (this.isDevelopment) {
      console.info(this.formatMessage('info', message, context));
    }
  }

  warn(message: string, context?: LogContext): void {
    console.warn(this.formatMessage('warn', message, context));
  }

  error(message: string, error?: Error, context?: LogContext): void {
    const clientInfo = this.getClientInfo();
    const errorContext = error ? { 
      ...context, 
      ...clientInfo,
      error: error.message, 
      stack: error.stack 
    } : { ...context, ...clientInfo };
    
    console.error(this.formatMessage('error', message, errorContext));
    this.sendToRemoteLogging('error', message, errorContext);
  }

  critical(message: string, error?: Error, context?: LogContext): void {
    const clientInfo = this.getClientInfo();
    const criticalContext = error ? { 
      ...context, 
      ...clientInfo,
      error: error.message, 
      stack: error.stack 
    } : { ...context, ...clientInfo };
    
    console.error(this.formatMessage('critical', message, criticalContext));
    this.sendToRemoteLogging('critical', message, criticalContext);
  }

  // Audit logging for compliance and security
  audit = {
    logAction: (entry: Omit<AuditLogEntry, 'timestamp'>) => {
      const auditEntry: AuditLogEntry = {
        ...entry,
        timestamp: new Date().toISOString(),
        ...this.getClientInfo()
      };
      
      this.auditLog.push(auditEntry);
      
      // Keep only last 1000 audit entries in memory
      if (this.auditLog.length > 1000) {
        this.auditLog = this.auditLog.slice(-1000);
      }
      
      // Log the audit entry
      this.info('Audit log entry', auditEntry);
      
      // In production, send to audit logging service
      if (!this.isDevelopment) {
        this.sendToRemoteLogging('info', 'Audit log entry', auditEntry);
      }
    },

    getAuditLog: (): AuditLogEntry[] => {
      return [...this.auditLog];
    },

    clearAuditLog: (): void => {
      this.auditLog = [];
    }
  };

  // Enhanced security-specific logging methods
  security = {
    loginAttempt: (email: string, success: boolean, ip?: string, userAgent?: string) => {
      const clientInfo = this.getClientInfo();
      const context = {
        action: 'login_attempt',
        userEmail: email,
        success,
        ip: ip || clientInfo.ip,
        userAgent: userAgent || clientInfo.userAgent,
        component: 'auth'
      };
      
      this.info('Login attempt', context);
      
      // Also create audit log entry
      this.audit.logAction({
        userEmail: email,
        action: 'login_attempt',
        resource: 'auth_system',
        success,
        ip: ip || clientInfo.ip,
        userAgent: userAgent || clientInfo.userAgent
      });
    },

    authError: (error: string, email?: string, context?: LogContext) => {
      const clientInfo = this.getClientInfo();
      const errorContext = {
        action: 'auth_error',
        userEmail: email,
        component: 'auth',
        ...clientInfo,
        ...context
      };
      
      this.error('Authentication error', new Error(error), errorContext);
      
      // Create audit log entry for failed auth
      this.audit.logAction({
        userEmail: email,
        action: 'auth_error',
        resource: 'auth_system',
        success: false,
        errorMessage: error,
        ...clientInfo
      });
    },

    adminAction: (action: string, userId?: string, details?: any, targetResource?: string) => {
      const clientInfo = this.getClientInfo();
      const context = {
        action: 'admin_action',
        adminAction: action,
        userId,
        details,
        component: 'admin',
        ...clientInfo
      };
      
      this.info('Admin action performed', context);
      
      // Create audit log entry for admin actions
      this.audit.logAction({
        userId,
        action: `admin_${action}`,
        resource: targetResource || 'admin_panel',
        oldValue: details?.oldValue,
        newValue: details?.newValue,
        success: true,
        ...clientInfo
      });
    },

    suspiciousActivity: (activity: string, context?: LogContext) => {
      const clientInfo = this.getClientInfo();
      const suspiciousContext = {
        action: 'suspicious_activity',
        activity,
        component: 'security',
        ...clientInfo,
        ...context
      };
      
      this.warn('Suspicious activity detected', suspiciousContext);
      
      // Create audit log entry for suspicious activity
      this.audit.logAction({
        userId: context?.userId,
        userEmail: context?.userEmail,
        action: 'suspicious_activity',
        resource: 'security_monitor',
        success: false,
        errorMessage: activity,
        ...clientInfo
      });
    },

    dataAccess: (resource: string, action: string, userId?: string, success: boolean = true) => {
      const clientInfo = this.getClientInfo();
      const context = {
        action: 'data_access',
        resource,
        accessAction: action,
        userId,
        success,
        component: 'data_access',
        ...clientInfo
      };
      
      this.info('Data access attempt', context);
      
      // Create audit log entry for data access
      this.audit.logAction({
        userId,
        action: `data_${action}`,
        resource,
        success,
        ...clientInfo
      });
    },

    rateLimitExceeded: (identifier: string, limit: number, timeWindow: string) => {
      const clientInfo = this.getClientInfo();
      const context = {
        action: 'rate_limit_exceeded',
        identifier,
        limit,
        timeWindow,
        component: 'security',
        ...clientInfo
      };
      
      this.warn('Rate limit exceeded', context);
      
      // Create audit log entry for rate limiting
      this.audit.logAction({
        action: 'rate_limit_exceeded',
        resource: 'rate_limiter',
        success: false,
        errorMessage: `Rate limit exceeded: ${limit} requests in ${timeWindow}`,
        ...clientInfo
      });
    }
  };
}

export const logger = new Logger();