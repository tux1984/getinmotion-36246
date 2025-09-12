
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, session, isAuthorized, loading, refreshAuth } = useAuth();
  const location = useLocation();
  const [isValidating, setIsValidating] = React.useState(false);

  if (loading || isValidating) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-foreground font-medium">
            {isValidating ? 'Validando sesión...' : 'Verificando autenticación...'}
          </p>
        </div>
      </div>
    );
  }

  // ENHANCED SESSION VALIDATION
  const validateSession = React.useCallback(async () => {
    if (!user || !session?.access_token) {
      console.log('🚫 ProtectedRoute: No session, redirecting to login');
      return false;
    }

    try {
      setIsValidating(true);
      // Verify session is still valid on server
      const { data: { session: currentSession }, error } = await supabase.auth.getSession();
      
      if (error || !currentSession?.access_token) {
        console.log('🚫 ProtectedRoute: Server session invalid, attempting refresh');
        await refreshAuth();
        return false;
      }

      if (!isAuthorized) {
        console.log('🚫 ProtectedRoute: User not authorized');
        return false;
      }

      return true;
    } catch (error) {
      console.error('❌ ProtectedRoute: Session validation failed:', error);
      return false;
    } finally {
      setIsValidating(false);
    }
  }, [user, session, isAuthorized, refreshAuth]);

  React.useEffect(() => {
    if (!loading) {
      validateSession().then(isValid => {
        if (!isValid) {
          // Small delay to prevent flash
          setTimeout(() => {
            if (!user || !session?.access_token || !isAuthorized) {
              // Will trigger redirect in render
            }
          }, 100);
        }
      });
    }
  }, [validateSession, loading]);

  // Final check before rendering
  if (!user || !session?.access_token || !isAuthorized) {
    console.log('🚫 ProtectedRoute: Final validation failed, redirecting to login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
