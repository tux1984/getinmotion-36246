import { useState, useCallback } from 'react';
import { logger } from '@/utils/logger';

interface FailedAttempt {
  email: string;
  timestamp: number;
  ip?: string;
}

export const useSecurityMonitoring = () => {
  const [failedAttempts, setFailedAttempts] = useState<FailedAttempt[]>([]);

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
      
      // Check for suspicious activity (5+ failed attempts in 15 minutes)
      const emailAttempts = updated.filter(a => a.email === email);
      if (emailAttempts.length >= 5) {
        logger.security.suspiciousActivity('Multiple failed login attempts', {
          userEmail: email,
          attemptCount: emailAttempts.length,
          timeWindow: '15 minutes'
        });
      }
      
      return updated;
    });

    logger.security.loginAttempt(email, false, ip);
  }, []);

  const recordSuccessfulLogin = useCallback((email: string, ip?: string) => {
    // Clear failed attempts for this email on successful login
    setFailedAttempts(prev => prev.filter(a => a.email !== email));
    logger.security.loginAttempt(email, true, ip);
  }, []);

  const isRateLimited = useCallback((email: string): boolean => {
    const cutoff = Date.now() - (15 * 60 * 1000);
    const recentAttempts = failedAttempts.filter(
      a => a.email === email && a.timestamp > cutoff
    );
    
    return recentAttempts.length >= 5;
  }, [failedAttempts]);

  return {
    recordFailedAttempt,
    recordSuccessfulLogin,
    isRateLimited,
    failedAttemptsCount: failedAttempts.length
  };
};
