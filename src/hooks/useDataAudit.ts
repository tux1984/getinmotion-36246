import { useCallback } from 'react';
import { logger } from '@/utils/logger';
import { useRobustAuth } from '@/hooks/useRobustAuth';
import { safeSupabase } from '@/utils/supabase-safe';

interface AuditLogEntry {
  resource_type: string;
  resource_id?: string;
  action: string;
  ip_address?: string;
  user_agent?: string;
  success?: boolean;
  metadata?: Record<string, any>;
}

export const useDataAudit = () => {
  const { user } = useRobustAuth();

  const logDataAccess = useCallback(async (entry: AuditLogEntry) => {
    try {
      // Get client info if available
      const clientInfo = {
        ip_address: entry.ip_address || 'unknown',
        user_agent: entry.user_agent || navigator.userAgent || 'unknown'
      };

      // Log to audit table
      const { error } = await safeSupabase
        .from('data_access_audit')
        .insert({
          user_id: user?.id || null,
          resource_type: entry.resource_type,
          resource_id: entry.resource_id || null,
          action: entry.action,
          ip_address: clientInfo.ip_address || null,
          user_agent: clientInfo.user_agent || null,
          success: entry.success ?? true,
          metadata: entry.metadata || {}
        });

      if (error) {
        logger.warn('Failed to log audit entry', { error: error.message });
      }

      // Also log to security logger
      logger.security.dataAccess(
        entry.resource_type, 
        entry.action, 
        user?.id, 
        entry.success ?? true
      );

    } catch (error) {
      logger.warn('Exception logging audit entry', { 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  }, [user]);

  const logPublicDataAccess = useCallback(async (
    resourceType: string, 
    resourceId: string, 
    action: string = 'view'
  ) => {
    await logDataAccess({
      resource_type: resourceType,
      resource_id: resourceId,
      action,
      success: true,
      metadata: {
        public_access: true,
        timestamp: new Date().toISOString()
      }
    });
  }, [logDataAccess]);

  return {
    logDataAccess,
    logPublicDataAccess
  };
};