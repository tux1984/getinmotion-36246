import React, { Component, ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, RefreshCw, Shield, User, Zap } from 'lucide-react';
import { User as SupabaseUser } from '@supabase/supabase-js';

interface DashboardErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface DashboardErrorBoundaryProps {
  children?: ReactNode;
  fallback?: ReactNode;
  user?: SupabaseUser | null;
  onRefreshAuth?: () => Promise<void>;
  isRetrying?: boolean;
  retryCount?: number;
}

// Error Boundary for runtime errors
export class DashboardErrorBoundary extends Component<
  DashboardErrorBoundaryProps,
  DashboardErrorBoundaryState
> {
  constructor(props: DashboardErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): DashboardErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Dashboard Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    // If there's a runtime error and we have a fallback, show it
    if (this.state.hasError && this.props.fallback) {
      return this.props.fallback;
    }

    // If there's a runtime error but no fallback, show default error UI
    if (this.state.hasError) {
      return <DefaultErrorUI onRetry={() => this.setState({ hasError: false })} />;
    }

    // If no runtime error but we're being used as a recovery component
    if (!this.props.children) {
      return <RecoveryMode {...this.props} />;
    }

    // Normal case: render children
    return this.props.children;
  }
}

// Recovery Mode for authorization issues
const RecoveryMode: React.FC<DashboardErrorBoundaryProps> = ({ 
  user, 
  onRefreshAuth, 
  isRetrying, 
  retryCount = 0 
}) => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center">
            <Shield className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
          </div>
          <CardTitle className="text-xl">Verificando Acceso</CardTitle>
          <p className="text-muted-foreground text-sm">
            Configurando tu experiencia personalizada...
          </p>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* User Info */}
          {user && (
            <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{user.email}</p>
                <p className="text-sm text-muted-foreground">Usuario autenticado</p>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                Conectado
              </Badge>
            </div>
          )}

          {/* Status */}
          <div className="text-center space-y-3">
            {retryCount > 0 && (
              <p className="text-sm text-muted-foreground">
                Reintento {retryCount}/3 completado
              </p>
            )}
            
            {retryCount >= 3 && (
              <div className="p-3 bg-yellow-50 dark:bg-yellow-900/10 rounded-lg border border-yellow-200 dark:border-yellow-800/30">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  El sistema está optimizando tu configuración. 
                  Esto puede tomar unos segundos debido a las mejoras de seguridad recientes.
                </p>
              </div>
            )}
          </div>

          {/* Action Button */}
          <Button 
            onClick={onRefreshAuth}
            disabled={isRetrying}
            className="w-full"
            variant="default"
          >
            {isRetrying ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Verificando...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 mr-2" />
                Activar Dashboard
              </>
            )}
          </Button>

          {/* Help Text */}
          <div className="text-center pt-2">
            <p className="text-xs text-muted-foreground">
              Si el problema persiste, contacta al soporte técnico
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Default error UI for runtime errors
const DefaultErrorUI: React.FC<{ onRetry: () => void }> = ({ onRetry }) => {
  return (
    <div className="min-h-[40vh] flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <CardTitle className="text-xl">Algo salió mal</CardTitle>
          <p className="text-muted-foreground text-sm">
            Ocurrió un error inesperado
          </p>
        </CardHeader>
        
        <CardContent>
          <Button onClick={onRetry} className="w-full">
            <RefreshCw className="w-4 h-4 mr-2" />
            Reintentar
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};