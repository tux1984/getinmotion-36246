import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Zap, TrendingUp, CheckCircle } from 'lucide-react';

interface DashboardFallbackModeProps {
  onMaturityCalculatorClick: () => void;
  onAgentManagerClick: () => void;
}

export const DashboardFallbackMode: React.FC<DashboardFallbackModeProps> = ({
  onMaturityCalculatorClick,
  onAgentManagerClick
}) => {
  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <Alert className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/20">
        <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
        <AlertDescription>
          <strong>Modo Fallback Activado:</strong> Algunas funcionalidades avanzadas están temporalmente limitadas 
          mientras se resuelve la configuración del servidor. El dashboard básico permanece funcional.
        </AlertDescription>
      </Alert>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Calculadora de Madurez
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Evalúa el nivel de madurez de tu negocio y obtén recomendaciones personalizadas.
            </p>
            <Button 
              onClick={onMaturityCalculatorClick}
              className="w-full"
              variant="default"
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              Abrir Calculadora
            </Button>
          </CardContent>
        </Card>

        <Card className="border-secondary/20 bg-gradient-to-br from-secondary/5 to-secondary/10">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-secondary" />
              Gestor de Agentes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Administra y configura los agentes de IA disponibles para tu negocio.
            </p>
            <Button 
              onClick={onAgentManagerClick}
              className="w-full"
              variant="secondary"
            >
              <Zap className="h-4 w-4 mr-2" />
              Gestionar Agentes
            </Button>
          </CardContent>
        </Card>

        <Card className="border-accent/20 bg-gradient-to-br from-accent/5 to-accent/10">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-accent" />
              Estado del Sistema
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Sesión Cliente:</span>
                <span className="text-green-600 dark:text-green-400 font-medium">✓ Activa</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Conectividad:</span>
                <span className="text-green-600 dark:text-green-400 font-medium">✓ Conectado</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>JWT Server:</span>
                <span className="text-amber-600 dark:text-amber-400 font-medium">⚠ En proceso</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Información del Sistema</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <p>
              <strong>Estado:</strong> Funcionando en modo de compatibilidad mejorada
            </p>
            <p>
              <strong>Autenticación:</strong> Validación únicamente del lado del cliente
            </p>
            <p>
              <strong>Funcionalidades:</strong> Acceso completo a herramientas principales
            </p>
            <p className="text-muted-foreground">
              Este modo garantiza que puedas continuar trabajando mientras se completa la configuración del backend.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};