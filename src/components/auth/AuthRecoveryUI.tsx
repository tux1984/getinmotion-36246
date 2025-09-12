import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, RefreshCw, LogIn } from 'lucide-react';

interface AuthRecoveryUIProps {
  onRetry: () => void;
  onForceLogin: () => void;
  onRecoverJWT: () => void;
  isRecovering: boolean;
}

export const AuthRecoveryUI: React.FC<AuthRecoveryUIProps> = ({
  onRetry,
  onForceLogin,
  onRecoverJWT,
  isRecovering
}) => {
  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertTriangle className="h-6 w-6 text-destructive" />
          </div>
          <CardTitle>Problema de Autenticación</CardTitle>
          <CardDescription>
            Detectamos un problema con tu sesión. Elige una opción para continuar:
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={onRetry} 
            variant="outline" 
            className="w-full"
            disabled={isRecovering}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Reintentar Conexión
          </Button>
          
          <Button 
            onClick={onRecoverJWT} 
            variant="outline" 
            className="w-full"
            disabled={isRecovering}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isRecovering ? 'animate-spin' : ''}`} />
            {isRecovering ? 'Reparando...' : 'Reparar Sesión'}
          </Button>
          
          <Button 
            onClick={onForceLogin} 
            className="w-full"
            disabled={isRecovering}
          >
            <LogIn className="mr-2 h-4 w-4" />
            Iniciar Sesión de Nuevo
          </Button>
          
          <div className="text-center pt-4">
            <p className="text-xs text-muted-foreground">
              Tu sesión puede haberse corrompido o expirado.
              <br />
              Estas opciones te ayudarán a recuperar el acceso.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};