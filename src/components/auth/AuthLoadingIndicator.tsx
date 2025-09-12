import React from 'react';
import { useRobustAuth } from '@/hooks/useRobustAuth';

interface AuthLoadingIndicatorProps {
  children: React.ReactNode;
}

export const AuthLoadingIndicator: React.FC<AuthLoadingIndicatorProps> = ({ children }) => {
  const { loading } = useRobustAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-foreground font-medium">Inicializando autenticación...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};