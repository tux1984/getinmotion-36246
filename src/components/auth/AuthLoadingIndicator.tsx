import React from 'react';
import { useAuth } from '@/context/AuthContext';

interface AuthLoadingIndicatorProps {
  children: React.ReactNode;
}

export const AuthLoadingIndicator: React.FC<AuthLoadingIndicatorProps> = ({ children }) => {
  const { loading, debugInfo } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <div className="space-y-2">
            <p className="text-foreground font-medium">Inicializando autenticación...</p>
            <p className="text-muted-foreground text-sm">
              Estado de sesión: {debugInfo.sessionStatus}
            </p>
            {debugInfo.lastAuthEvent && (
              <p className="text-muted-foreground text-xs">
                Último evento: {debugInfo.lastAuthEvent}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};