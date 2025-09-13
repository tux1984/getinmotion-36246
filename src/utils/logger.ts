type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  userId?: string;
  userEmail?: string;
  action?: string;
  component?: string;
  [key: string]: any;
}

class Logger {
  private isDevelopment = import.meta.env.DEV;

  private formatMessage(level: LogLevel, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString();
    const contextStr = context ? ` | Context: ${JSON.stringify(context)}` : '';
    return `[${timestamp}] ${level.toUpperCase()}: ${message}${contextStr}`;
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
    const errorContext = error ? { ...context, error: error.message, stack: error.stack } : context;
    console.error(this.formatMessage('error', message, errorContext));
  }

  // Security-specific logging methods
  security = {
    loginAttempt: (email: string, success: boolean, ip?: string) => {
      this.info('Login attempt', {
        action: 'login_attempt',
        userEmail: email,
        success,
        ip,
        component: 'auth'
      });
    },

    authError: (error: string, email?: string, context?: LogContext) => {
      this.error('Authentication error', new Error(error), {
        action: 'auth_error',
        userEmail: email,
        component: 'auth',
        ...context
      });
    },

    adminAction: (action: string, userId?: string, details?: any) => {
      this.info('Admin action performed', {
        action: 'admin_action',
        adminAction: action,
        userId,
        details,
        component: 'admin'
      });
    },

    suspiciousActivity: (activity: string, context?: LogContext) => {
      this.warn('Suspicious activity detected', {
        action: 'suspicious_activity',
        activity,
        component: 'security',
        ...context
      });
    }
  };
}

export const logger = new Logger();