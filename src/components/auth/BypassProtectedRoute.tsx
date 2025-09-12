import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useRobustAuth } from '@/hooks/useRobustAuth';
import { AuthRecoveryUI } from './AuthRecoveryUI';

interface BypassProtectedRouteProps {
  children: React.ReactNode;
}

// Temporary bypass for JWT server-side validation issues
// Uses only client-side session validation until Supabase configuration is fixed
export const BypassProtectedRoute: React.FC<BypassProtectedRouteProps> = ({ children }) => {
  const { user, session, loading, jwtIntegrity, recoverJWT } = useRobustAuth();
  const location = useLocation();
  const [showRecovery, setShowRecovery] = useState(false);
  const [authTimeout, setAuthTimeout] = useState(false);

  console.log('🔄 BypassProtectedRoute: Client-side validation only', { 
    hasUser: !!user, 
    hasSession: !!session, 
    loading,
    userEmail: user?.email,
    accessToken: !!session?.access_token
  });

  // Add timeout to prevent infinite loading
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (loading && !user && !session) {
        console.log('⚠️ BypassProtectedRoute: Auth timeout');
        setAuthTimeout(true);
      }
    }, 10000); // 10 second timeout
    
    return () => clearTimeout(timeout);
  }, [loading, user, session]);

  // Show recovery UI if timeout or JWT issues
  if (authTimeout || showRecovery || jwtIntegrity === 'corrupted') {
    return (
      <AuthRecoveryUI
        onRetry={() => {
          setAuthTimeout(false);
          setShowRecovery(false);
          window.location.reload();
        }}
        onForceLogin={() => {
          window.location.href = '/login';
        }}
        onRecoverJWT={async () => {
          const success = await recoverJWT();
          if (!success) {
            setShowRecovery(true);
          }
        }}
        isRecovering={jwtIntegrity === 'recovering'}
      />
    );
  }

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