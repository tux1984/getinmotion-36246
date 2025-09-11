import { useState, useCallback, useEffect } from 'react';
import { logger } from '@/utils/logger';

interface FailedAttempt {
  email: string;
  timestamp: number;
  ip?: string;
  userAgent?: string;
}

interface SecurityAlert {
  id: string;
  type: 'rate_limit' | 'suspicious_activity' | 'security_violation';
  message: string;
  timestamp: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  metadata?: Record<string, any>;
}

export const useSecurityMonitoring = () => {
  const [failedAttempts, setFailedAttempts] = useState<FailedAttempt[]>([]);
  const [securityAlerts, setSecurityAlerts] = useState<SecurityAlert[]>([]);

  // Rate limiting configuration
  const RATE_LIMITS = {
    LOGIN_ATTEMPTS: { max: 5, window: 15 * 60 * 1000 }, // 5 attempts in 15 minutes
    API_CALLS: { max: 100, window: 60 * 1000 }, // 100 calls per minute
    DATA_ACCESS: { max: 50, window: 60 * 1000 } // 50 data access calls per minute
  };

  // Cleanup old security alerts
  useEffect(() => {
    const interval = setInterval(() => {
      const oneHourAgo = Date.now() - (60 * 60 * 1000);
      setSecurityAlerts(prev => prev.filter(alert => alert.timestamp > oneHourAgo));
    }, 5 * 60 * 1000); // Clean up every 5 minutes

    return () => clearInterval(interval);
  }, []);

  const addSecurityAlert = useCallback((alert: Omit<SecurityAlert, 'id' | 'timestamp'>) => {
    const newAlert: SecurityAlert = {
      ...alert,
      id: crypto.randomUUID(),
      timestamp: Date.now()
    };
    
    setSecurityAlerts(prev => [newAlert, ...prev.slice(0, 99)]); // Keep last 100 alerts
    
    // Log critical alerts
    if (alert.severity === 'critical' || alert.severity === 'high') {
      logger.critical('Security alert triggered', undefined, {
        alertType: alert.type,
        message: alert.message,
        severity: alert.severity,
        metadata: alert.metadata
      });
    }
  }, []);

  const recordFailedAttempt = useCallback((email: string, ip?: string, userAgent?: string) => {
    const attempt: FailedAttempt = {
      email,
      timestamp: Date.now(),
      ip,
      userAgent
    };

    setFailedAttempts(prev => {
      // Keep only attempts from last 15 minutes
      const cutoff = Date.now() - RATE_LIMITS.LOGIN_ATTEMPTS.window;
      const recent = prev.filter(a => a.timestamp > cutoff);
      
      // Add new attempt
      const updated = [...recent, attempt];
      
      // Check for suspicious activity
      const emailAttempts = updated.filter(a => a.email === email);
      if (emailAttempts.length >= RATE_LIMITS.LOGIN_ATTEMPTS.max) {
        logger.security.suspiciousActivity('Multiple failed login attempts', {
          userEmail: email,
          attemptCount: emailAttempts.length,
          timeWindow: '15 minutes',
          ip,
          userAgent
        });

        // Add security alert
        addSecurityAlert({
          type: 'rate_limit',
          message: `Multiple failed login attempts for ${email}`,
          severity: 'high',
          metadata: { email, attemptCount: emailAttempts.length, ip, userAgent }
        });
      }
      
      return updated;
    });

    logger.security.loginAttempt(email, false, ip, userAgent);
  }, [addSecurityAlert]);

  const recordSuccessfulLogin = useCallback((email: string, ip?: string, userAgent?: string) => {
    // Clear failed attempts for this email on successful login
    setFailedAttempts(prev => prev.filter(a => a.email !== email));
    logger.security.loginAttempt(email, true, ip, userAgent);
  }, []);

  const isRateLimited = useCallback((email: string): boolean => {
    const cutoff = Date.now() - RATE_LIMITS.LOGIN_ATTEMPTS.window;
    const recentAttempts = failedAttempts.filter(
      a => a.email === email && a.timestamp > cutoff
    );
    
    return recentAttempts.length >= RATE_LIMITS.LOGIN_ATTEMPTS.max;
  }, [failedAttempts]);

  const checkRateLimit = useCallback((
    identifier: string,
    limitType: keyof typeof RATE_LIMITS,
    currentCount: number
  ): boolean => {
    const limit = RATE_LIMITS[limitType];
    
    if (currentCount >= limit.max) {
      logger.security.rateLimitExceeded(identifier, limit.max, `${limit.window / 1000} seconds`);
      
      addSecurityAlert({
        type: 'rate_limit',
        message: `Rate limit exceeded for ${limitType}: ${currentCount}/${limit.max}`,
        severity: 'medium',
        metadata: { identifier, limitType, currentCount, maxAllowed: limit.max }
      });
      
      return true;
    }
    
    return false;
  }, [addSecurityAlert]);

  const getSecurityMetrics = useCallback(() => {
    const now = Date.now();
    const oneHour = 60 * 60 * 1000;
    const recentAlerts = securityAlerts.filter(alert => alert.timestamp > (now - oneHour));
    
    return {
      totalFailedAttempts: failedAttempts.length,
      recentSecurityAlerts: recentAlerts.length,
      criticalAlerts: recentAlerts.filter(a => a.severity === 'critical').length,
      highSeverityAlerts: recentAlerts.filter(a => a.severity === 'high').length,
      lastAlertTime: securityAlerts[0]?.timestamp || null
    };
  }, [failedAttempts, securityAlerts]);

  return {
    recordFailedAttempt,
    recordSuccessfulLogin,
    isRateLimited,
    checkRateLimit,
    addSecurityAlert,
    getSecurityMetrics,
    securityAlerts: securityAlerts.slice(0, 20), // Return only last 20 alerts
    failedAttemptsCount: failedAttempts.length,
    RATE_LIMITS
  };
};
