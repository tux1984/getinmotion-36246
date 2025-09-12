import React from 'react';
import { useRobustAuth } from '@/hooks/useRobustAuth';
import { JWTStatusIndicator } from '@/components/dashboard/JWTStatusIndicator';
import { Button } from '@/components/ui/button';
import { AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export const DashboardJWTStatusBar: React.FC = () => {
  const { jwtIntegrity, lastIntegrityCheck, checkJWTIntegrity, recoverJWT } = useRobustAuth();

  // Only show if there are potential issues
  if (jwtIntegrity === 'valid') {
    return null;
  }

  return (
    <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border/40">
      <div className="container mx-auto px-4 py-2">
        <Alert className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/20">
          <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          <AlertDescription className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">
                Estado de autenticación:
              </span>
              <JWTStatusIndicator />
              {lastIntegrityCheck && (
                <span className="text-xs text-muted-foreground">
                  Última verificación: {lastIntegrityCheck.toLocaleTimeString()}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={checkJWTIntegrity}
                className="h-8 px-3"
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Verificar
              </Button>
              {jwtIntegrity === 'corrupted' && (
                <Button
                  variant="default"
                  size="sm"
                  onClick={recoverJWT}
                  className="h-8 px-3"
                >
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Reparar
                </Button>
              )}
            </div>
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
};