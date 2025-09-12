import { useState, useEffect, useCallback } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';

interface SessionState {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  lastRefresh: number | null;
  sessionRestored: boolean;
}

interface SessionPersistenceHook {
  sessionState: SessionState;
  refreshSession: () => Promise<boolean>;
  clearSession: () => void;
  isSessionValid: () => boolean;
  forceSessionCheck: () => Promise<void>;
}

export const useSessionPersistence = (): SessionPersistenceHook => {
  const [sessionState, setSessionState] = useState<SessionState>({
    session: null,
    user: null,
    isLoading: true,
    lastRefresh: null,
    sessionRestored: false
  });

  const updateSessionState = useCallback((updates: Partial<SessionState>) => {
    setSessionState(prev => ({ ...prev, ...updates }));
  }, []);

  const isSessionValid = useCallback((): boolean => {
    if (!sessionState.session) return false;
    
    const expiresAt = sessionState.session.expires_at;
    if (!expiresAt) return false;
    
    // Consider session valid if it expires more than 5 minutes from now
    const expiryTime = expiresAt * 1000;
    const now = Date.now();
    const fiveMinutes = 5 * 60 * 1000;
    
    const isValid = expiryTime > (now + fiveMinutes);
    logger.debug('Session validity check', {
      expiresAt: new Date(expiryTime).toISOString(),
      now: new Date(now).toISOString(),
      isValid,
      timeUntilExpiry: Math.round((expiryTime - now) / 1000 / 60),
      component: 'session-persistence'
    });
    
    return isValid;
  }, [sessionState.session]);

  const refreshSession = useCallback(async (): Promise<boolean> => {
    try {
      logger.debug('Attempting to refresh session', { component: 'session-persistence' });
      
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error) {
        logger.error('Session refresh failed', error as Error, { component: 'session-persistence' });
        updateSessionState({
          session: null,
          user: null,
          lastRefresh: Date.now()
        });
        return false;
      }
      
      if (data?.session) {
        logger.debug('Session refreshed successfully', {
          userEmail: data.session.user?.email,
          expiresAt: data.session.expires_at ? new Date(data.session.expires_at * 1000).toISOString() : 'unknown',
          component: 'session-persistence'
        });
        
        updateSessionState({
          session: data.session,
          user: data.session.user,
          lastRefresh: Date.now()
        });
        return true;
      }
      
      logger.debug('Session refresh returned no session', { component: 'session-persistence' });
      return false;
    } catch (error) {
      logger.error('Exception during session refresh', error as Error, { component: 'session-persistence' });
      return false;
    }
  }, [updateSessionState]);

  const forceSessionCheck = useCallback(async (): Promise<void> => {
    try {
      logger.debug('Force checking session status', { component: 'session-persistence' });
      
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        logger.error('Force session check failed', error as Error, { component: 'session-persistence' });
        updateSessionState({
          session: null,
          user: null,
          isLoading: false
        });
        return;
      }
      
      logger.debug('Force session check result', {
        hasSession: !!data.session,
        userEmail: data.session?.user?.email,
        component: 'session-persistence'
      });
      
      updateSessionState({
        session: data.session,
        user: data.session?.user ?? null,
        isLoading: false,
        sessionRestored: !!data.session
      });
    } catch (error) {
      logger.error('Exception during force session check', error as Error, { component: 'session-persistence' });
      updateSessionState({
        session: null,
        user: null,
        isLoading: false
      });
    }
  }, [updateSessionState]);

  const clearSession = useCallback(() => {
    logger.debug('Clearing session state', { component: 'session-persistence' });
    updateSessionState({
      session: null,
      user: null,
      lastRefresh: null,
      sessionRestored: false
    });
  }, [updateSessionState]);

  // Session monitoring effect
  useEffect(() => {
    let sessionCheckInterval: NodeJS.Timeout;
    let visibilityChangeHandler: () => void;
    let focusHandler: () => void;

    const setupSessionMonitoring = () => {
      // Check session validity every 2 minutes
      sessionCheckInterval = setInterval(() => {
        if (sessionState.session && !isSessionValid()) {
          logger.debug('Session expired, attempting refresh', { component: 'session-persistence' });
          refreshSession();
        }
      }, 2 * 60 * 1000);

      // Refresh session when page becomes visible
      visibilityChangeHandler = () => {
        if (!document.hidden && sessionState.session) {
          logger.debug('Page became visible, checking session', { component: 'session-persistence' });
          if (!isSessionValid()) {
            refreshSession();
          }
        }
      };

      // Refresh session when window gains focus
      focusHandler = () => {
        if (sessionState.session && !isSessionValid()) {
          logger.debug('Window focused, checking session', { component: 'session-persistence' });
          refreshSession();
        }
      };

      document.addEventListener('visibilitychange', visibilityChangeHandler);
      window.addEventListener('focus', focusHandler);
    };

    if (sessionState.session) {
      setupSessionMonitoring();
    }

    return () => {
      if (sessionCheckInterval) {
        clearInterval(sessionCheckInterval);
      }
      if (visibilityChangeHandler) {
        document.removeEventListener('visibilitychange', visibilityChangeHandler);
      }
      if (focusHandler) {
        window.removeEventListener('focus', focusHandler);
      }
    };
  }, [sessionState.session, isSessionValid, refreshSession]);

  return {
    sessionState,
    refreshSession,
    clearSession,
    isSessionValid,
    forceSessionCheck
  };
};