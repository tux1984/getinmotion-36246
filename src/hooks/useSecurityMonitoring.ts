import { useState, useCallback } from 'react';
import { logger } from '@/utils/logger';
import { supabase } from '@/integrations/supabase/client';

interface FailedAttempt {
  email: string;
  timestamp: number;
  ip?: string;
}

export const useSecurityMonitoring = () => {
  const [failedAttempts, setFailedAttempts] = useState<FailedAttempt[]>([]);

  const logAdminAction = useCallback(async (action: string, resourceType: string, resourceId?: string, details?: any) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.rpc('log_admin_action', {
          action_type: action,
          resource_type: resourceType,
          resource_id: resourceId,
          details: details || {}
        });
      }
    } catch (error) {
      console.error('Failed to log admin action:', error);
    }
  }, []);

  const recordFailedAttempt = useCallback((email: string, ip?: string) => {
    const attempt: FailedAttempt = {
      email,
      timestamp: Date.now(),
      ip
    };

    setFailedAttempts(prev => {
      // Keep only attempts from last 15 minutes
      const cutoff = Date.now() - (15 * 60 * 1000);
      const recent = prev.filter(a => a.timestamp > cutoff);
      
      // Add new attempt
      const updated = [...recent, attempt];
      
      // Check for suspicious activity (3+ failed attempts in 15 minutes - more strict)
      const emailAttempts = updated.filter(a => a.email === email);
      if (emailAttempts.length >= 3) {
        logger.security.suspiciousActivity('Multiple failed login attempts', {
          userEmail: email,
          attemptCount: emailAttempts.length,
          timeWindow: '15 minutes',
          ipAddress: ip
        });

        // Log to admin audit trail
        logAdminAction('SUSPICIOUS_LOGIN_ACTIVITY', 'auth', email, {
          attemptCount: emailAttempts.length,
          ipAddress: ip
        });
      }
      
      return updated;
    });

    logger.security.loginAttempt(email, false, ip);
  }, [logAdminAction]);

  const recordSuccessfulLogin = useCallback((email: string, ip?: string) => {
    // Clear failed attempts for this email on successful login
    setFailedAttempts(prev => prev.filter(a => a.email !== email));
    logger.security.loginAttempt(email, true, ip);
    
    // Log successful admin login
    logAdminAction('LOGIN_SUCCESS', 'auth', email, { ipAddress: ip });
  }, [logAdminAction]);

  const isRateLimited = useCallback((email: string): boolean => {
    const cutoff = Date.now() - (15 * 60 * 1000);
    const recentAttempts = failedAttempts.filter(
      a => a.email === email && a.timestamp > cutoff
    );
    
    // More strict rate limiting: 3 attempts in 15 minutes
    return recentAttempts.length >= 3;
  }, [failedAttempts]);

  return {
    recordFailedAttempt,
    recordSuccessfulLogin,
    isRateLimited,
    logAdminAction,
    failedAttemptsCount: failedAttempts.length
  };
};
