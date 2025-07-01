
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, BarChart3, Zap, Settings } from 'lucide-react';

interface SimpleDashboardFallbackProps {
  onMaturityCalculatorClick: () => void;
}

export const SimpleDashboardFallback: React.FC<SimpleDashboardFallbackProps> = ({
  onMaturityCalculatorClick
}) => {
  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header Simple */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          ¡Bienvenido a tu Dashboard!
        </h1>
        <p className="text-gray-600">
          Tu espacio de trabajo creativo está listo para comenzar
        </p>
      </div>

      {/* Cards Básicas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Configurar Perfil</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground mb-3">
              Completa tu configuración inicial
            </p>
            <Button 
              onClick={onMaturityCalculatorClick}
              variant="outline"
              size="sm"
              className="w-full"
            >
              Comenzar Configuración
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Análisis de Madurez</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground mb-3">
              Evalúa tu proyecto creativo
            </p>
            <Button 
              onClick={onMaturityCalculatorClick}
              variant="outline"
              size="sm"
              className="w-full"
            >
              Hacer Evaluación
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Agentes IA</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground mb-3">
              Accede a herramientas de IA especializadas
            </p>
            <Button 
              variant="outline"
              size="sm"
              className="w-full"
              disabled
            >
              Próximamente
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Información Adicional */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="h-5 w-5 mr-2" />
            Primeros Pasos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-purple-600 text-sm font-semibold">1</span>
            </div>
            <div>
              <p className="text-sm font-medium">Configura tu perfil</p>
              <p className="text-xs text-gray-600">Completa la información básica de tu proyecto creativo</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-purple-600 text-sm font-semibold">2</span>
            </div>
            <div>
              <p className="text-sm font-medium">Realiza el análisis de madurez</p>
              <p className="text-xs text-gray-600">Evalúa el estado actual de tu proyecto</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-gray-600 text-sm font-semibold">3</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Accede a agentes IA personalizados</p>
              <p className="text-xs text-gray-600">Herramientas especializadas basadas en tu evaluación</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
