import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle, Loader2, RefreshCw } from 'lucide-react';
import { useRobustAuth } from '@/hooks/useRobustAuth';

export const JWTStatusIndicator: React.FC = () => {
  const { jwtIntegrity, lastIntegrityCheck, checkJWTIntegrity, recoverJWT } = useRobustAuth();

  const getStatusConfig = () => {
    switch (jwtIntegrity) {
      case 'valid':
        return {
          icon: CheckCircle,
          text: 'JWT Válido',
          variant: 'default' as const,
          className: 'text-green-600'
        };
      case 'corrupted':
        return {
          icon: AlertCircle,
          text: 'JWT Corrompido',
          variant: 'destructive' as const,
          className: 'text-red-600'
        };
      case 'recovering':
        return {
          icon: Loader2,
          text: 'Recuperando...',
          variant: 'secondary' as const,
          className: 'text-yellow-600 animate-spin'
        };
      default:
        return {
          icon: Loader2,
          text: 'Verificando...',
          variant: 'outline' as const,
          className: 'text-muted-foreground animate-spin'
        };
    }
  };

  const config = getStatusConfig();
  const IconComponent = config.icon;

  return (
    <div className="flex items-center gap-2 p-2 rounded-lg bg-background/50 border">
      <Badge variant={config.variant} className="flex items-center gap-1">
        <IconComponent className={`h-3 w-3 ${config.className}`} />
        {config.text}
      </Badge>
      
      {lastIntegrityCheck && (
        <span className="text-xs text-muted-foreground">
          {lastIntegrityCheck.toLocaleTimeString()}
        </span>
      )}
      
      <div className="flex gap-1">
        <Button
          size="sm"
          variant="outline"
          onClick={checkJWTIntegrity}
          disabled={jwtIntegrity === 'checking' || jwtIntegrity === 'recovering'}
        >
          <RefreshCw className="h-3 w-3" />
        </Button>
        
        {jwtIntegrity === 'corrupted' && (
          <Button
            size="sm"
            variant="destructive"
            onClick={recoverJWT}
          >
            Reparar
          </Button>
        )}
      </div>
    </div>
  );
};