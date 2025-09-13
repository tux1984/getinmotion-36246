
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useRobustAuth } from '@/hooks/useRobustAuth';
import { supabase } from '@/integrations/supabase/client';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, session, isAuthorized, loading, authorizationLoading } = useRobustAuth();
  const location = useLocation();

  console.log('🛡️ ProtectedRoute: Checking access', { 
    hasUser: !!user, 
    hasSession: !!session, 
    isAuthorized, 
    loading,
    authorizationLoading,
    accessToken: !!session?.access_token
  });

  // Show loading while auth is initializing or authorization is being checked
  if (loading || authorizationLoading) {
    console.log('⏳ ProtectedRoute: Still loading auth state', { loading, authorizationLoading });
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-foreground font-medium">
            {loading ? 'Verificando autenticación...' : 'Verificando autorización...'}
          </p>
        </div>
      </div>
    );
  }

  // Complete validation: user + session + authorization
  // Only deny access if authorization has been explicitly calculated and is false
  if (!user || !session?.access_token || isAuthorized === false) {
    console.log('🚫 ProtectedRoute: Access denied, redirecting to login', {
      missingUser: !user,
      missingSession: !session?.access_token,
      isAuthorized,
      authorizationStatus: isAuthorized === null ? 'not-calculated' : isAuthorized ? 'authorized' : 'denied'
    });
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // If authorization is still null (being calculated), keep showing loading
  if (isAuthorized === null) {
    console.log('⏳ ProtectedRoute: Authorization still being calculated');
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-foreground font-medium">Verificando permisos...</p>
        </div>
      </div>
    );
  }

  console.log('✅ ProtectedRoute: Access granted');
  return <>{children}</>;
};
