import { useCallback } from 'react';
import { logger } from '@/utils/logger';
import { useAuth } from '@/context/AuthContext';

export const useSecureDataAccess = () => {
  const { user } = useAuth();

  const logDataAccess = useCallback((
    resource: string, 
    action: string, 
    success: boolean = true,
    additionalContext?: Record<string, any>
  ) => {
    logger.security.dataAccess(resource, action, user?.id, success);
    
    if (additionalContext) {
      logger.info(`Data access: ${action} on ${resource}`, {
        userId: user?.id,
        userEmail: user?.email,
        ...additionalContext
      });
    }
  }, [user]);

  const secureQuery = useCallback(async <T>(
    resource: string,
    queryFn: () => Promise<T>,
    action: string = 'read'
  ): Promise<T> => {
    try {
      logDataAccess(resource, action, true, { initiating: true });
      const result = await queryFn();
      logDataAccess(resource, action, true, { completed: true });
      return result;
    } catch (error) {
      logDataAccess(resource, action, false, { 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
      throw error;
    }
  }, [logDataAccess]);

  return {
    logDataAccess,
    secureQuery
  };
};