
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useRobustAuth } from '@/hooks/useRobustAuth';
import { supabase } from '@/integrations/supabase/client';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, session, isAuthorized, loading } = useRobustAuth();
  const location = useLocation();

  console.log('🛡️ ProtectedRoute: Checking access', { 
    hasUser: !!user, 
    hasSession: !!session, 
    isAuthorized, 
    loading,
    accessToken: !!session?.access_token
  });

  // Show loading while auth is initializing
  if (loading) {
    console.log('⏳ ProtectedRoute: Still loading auth state');
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-foreground font-medium">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  // Simple validation: user + session + authorization
  if (!user || !session?.access_token || !isAuthorized) {
    console.log('🚫 ProtectedRoute: Access denied, redirecting to login', {
      missingUser: !user,
      missingSession: !session?.access_token,
      notAuthorized: !isAuthorized
    });
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  console.log('✅ ProtectedRoute: Access granted');
  return <>{children}</>;
};
