import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useRobustAuth } from '@/hooks/useRobustAuth';

interface BypassProtectedRouteProps {
  children: React.ReactNode;
}

// Temporary bypass for JWT server-side validation issues
// Uses only client-side session validation until Supabase configuration is fixed
export const BypassProtectedRoute: React.FC<BypassProtectedRouteProps> = ({ children }) => {
  const { user, session, loading } = useRobustAuth();
  const location = useLocation();

  console.log('🔄 BypassProtectedRoute: Client-side validation only', { 
    hasUser: !!user, 
    hasSession: !!session, 
    loading,
    userEmail: user?.email,
    accessToken: !!session?.access_token
  });

  // Show loading while auth is initializing
  if (loading) {
    console.log('⏳ BypassProtectedRoute: Still loading auth state');
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-foreground font-medium">Verificando autenticación...</p>
          <p className="text-muted-foreground text-sm">Modo bypass temporal</p>
        </div>
      </div>
    );
  }

  // BYPASS: Only check client-side session, skip server-side JWT validation
  if (!user || !session?.access_token) {
    console.log('🚫 BypassProtectedRoute: No client session, redirecting to login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  console.log('✅ BypassProtectedRoute: Client session valid, allowing access');
  return <>{children}</>;
};