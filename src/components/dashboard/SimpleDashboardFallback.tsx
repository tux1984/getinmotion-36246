
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { 
  Calculator, 
  Brain, 
  Target, 
  Users, 
  TrendingUp,
  ArrowRight,
  Sparkles,
  Settings,
  BarChart3,
  Zap
} from 'lucide-react';

interface SimpleDashboardFallbackProps {
  onMaturityCalculatorClick: () => void;
}

export const SimpleDashboardFallback: React.FC<SimpleDashboardFallbackProps> = ({
  onMaturityCalculatorClick
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6 space-y-8">
        
        {/* Welcome Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-6">
            <Brain className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            ¡Bienvenido a tu Dashboard!
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Tu espacio de trabajo está listo. Comencemos evaluando tu negocio para desbloquear recomendaciones personalizadas.
          </p>
        </motion.div>

        {/* Quick Actions */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid md:grid-cols-2 gap-6"
        >
          <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <Calculator className="w-8 h-8 text-primary" />
                <CardTitle className="text-xl">Análisis de Madurez</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Evalúa tu negocio en áreas clave: validación de idea, experiencia de usuario, encaje en el mercado y monetización.
              </p>
              <Button 
                onClick={onMaturityCalculatorClick}
                className="w-full"
                size="lg"
              >
                Hacer Evaluación
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-accent/5 to-accent/10 border-accent/20">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <Sparkles className="w-8 h-8 text-accent" />
                <CardTitle className="text-xl">Insights con IA</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Obtén recomendaciones personalizadas y sugerencias de tareas inteligentes basadas en tu perfil empresarial.
              </p>
              <Button 
                variant="outline" 
                className="w-full"
                size="lg"
                disabled
              >
                Completa la Evaluación Primero
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Features Preview */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          <h2 className="text-2xl font-semibold text-center">Qué Desbloquearás</h2>
          
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="text-center p-6 bg-card/50">
              <Target className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Tareas Personalizadas</h3>
              <p className="text-sm text-muted-foreground">
                Obtén tareas específicas y accionables adaptadas a la etapa y objetivos de tu negocio.
              </p>
            </Card>
            
            <Card className="text-center p-6 bg-card/50">
              <Users className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Agentes IA</h3>
              <p className="text-sm text-muted-foreground">
                Accede a agentes de IA especializados en marketing, ventas, desarrollo y más.
              </p>
            </Card>
            
            <Card className="text-center p-6 bg-card/50">
              <TrendingUp className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Seguimiento de Progreso</h3>
              <p className="text-sm text-muted-foreground">
                Monitorea el crecimiento de tu negocio con análisis detallados e insights.
              </p>
            </Card>
          </div>
        </motion.div>

        {/* Getting Started Steps */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="h-5 w-5 mr-2 text-primary" />
                Primeros Pasos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-primary text-sm font-semibold">1</span>
                </div>
                <div>
                  <p className="font-medium">Completa el Análisis de Madurez</p>
                  <p className="text-sm text-muted-foreground">Evalúa el estado actual de tu negocio en 4 áreas clave</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-muted-foreground text-sm font-semibold">2</span>
                </div>
                <div>
                  <p className="font-medium text-muted-foreground">Recibe Recomendaciones Personalizadas</p>
                  <p className="text-sm text-muted-foreground">Obtén tareas específicas basadas en tu evaluación</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-muted-foreground text-sm font-semibold">3</span>
                </div>
                <div>
                  <p className="font-medium text-muted-foreground">Accede a Agentes IA Especializados</p>
                  <p className="text-sm text-muted-foreground">Herramientas de IA personalizadas para hacer crecer tu negocio</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center bg-primary/5 rounded-lg p-8"
        >
          <h3 className="text-xl font-semibold mb-4">¿Listo para Comenzar?</h3>
          <p className="text-muted-foreground mb-6">
            La evaluación toma solo 5 minutos y desbloqueará tu dashboard empresarial personalizado.
          </p>
          <Button 
            onClick={onMaturityCalculatorClick}
            className="px-8 py-3"
            size="lg"
          >
            Comenzar Evaluación
            <Calculator className="w-4 h-4 ml-2" />
          </Button>
        </motion.div>
      </div>
    </div>
  );
};
