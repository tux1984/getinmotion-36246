import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  Target, 
  Clock, 
  CheckCircle2,
  Brain,
  Bot,
  AlertCircle,
  ArrowRight,
  Play,
  Calculator,
  Users
} from 'lucide-react';

interface BasicDashboardFallbackProps {
  onMaturityCalculatorClick: () => void;
  onAgentManagerClick?: () => void;
  tasks?: any[];
  currentScores?: any;
  completedTasksCount?: number;
  activeTasksCount?: number;
}

export const BasicDashboardFallback: React.FC<BasicDashboardFallbackProps> = ({
  onMaturityCalculatorClick,
  onAgentManagerClick,
  tasks = [],
  currentScores,
  completedTasksCount = 0,
  activeTasksCount = 0
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Status Banner */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="border-orange-200 bg-orange-50 dark:bg-orange-950/20 dark:border-orange-900">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-orange-600" />
                <div>
                  <h3 className="font-semibold text-orange-900 dark:text-orange-200">
                    Modo Básico Activado
                  </h3>
                  <p className="text-sm text-orange-700 dark:text-orange-300">
                    El coordinador inteligente está temporalmente no disponible. Todas tus funciones están activas.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200/50 dark:from-blue-950/20 dark:to-cyan-950/20 dark:border-blue-800/30">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {activeTasksCount}/15
                </div>
              </div>
              <div className="text-sm text-blue-700 dark:text-blue-300">
                Tareas Activas
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200/50 dark:from-green-950/20 dark:to-emerald-950/20 dark:border-green-800/30">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {completedTasksCount}
                </div>
              </div>
              <div className="text-sm text-green-700 dark:text-green-300">
                Completadas
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200/50 dark:from-purple-950/20 dark:to-violet-950/20 dark:border-purple-800/30">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {currentScores ? Math.round((currentScores.ideaValidation + currentScores.userExperience + currentScores.marketFit + currentScores.monetization) / 4) : '-'}
                </div>
              </div>
              <div className="text-sm text-purple-700 dark:text-purple-300">
                Nivel de Madurez
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200/50 dark:from-amber-950/20 dark:to-orange-950/20 dark:border-amber-800/30">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                  {tasks.length > 0 ? Math.round((completedTasksCount / tasks.length) * 100) : 0}%
                </div>
              </div>
              <div className="text-sm text-amber-700 dark:text-amber-300">
                Progreso General
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Action Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="h-full hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-primary" />
                  Evaluar tu Negocio
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Conoce el nivel de madurez de tu emprendimiento y recibe recomendaciones personalizadas.
                </p>
                <Button 
                  onClick={onMaturityCalculatorClick}
                  className="w-full"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Empezar Evaluación
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="h-full hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  Gestionar Agentes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Configura y personaliza tus agentes de IA especializados para cada área de negocio.
                </p>
                <Button 
                  onClick={onAgentManagerClick}
                  variant="outline"
                  className="w-full"
                >
                  <Bot className="w-4 h-4 mr-2" />
                  Ver Agentes
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="h-full hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" />
                  Mis Tareas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Gestiona tus tareas pendientes y completa los próximos pasos de tu negocio.
                </p>
                <Button 
                  onClick={() => window.location.href = '/dashboard/tasks'}
                  variant="outline"
                  className="w-full"
                >
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Ver Tareas
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Recent Activity */}
        {tasks.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Actividad Reciente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {tasks.slice(0, 5).map((task, index) => (
                    <div key={task.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${
                          task.status === 'completed' ? 'bg-green-500' :
                          task.status === 'in_progress' ? 'bg-blue-500' :
                          'bg-gray-400'
                        }`} />
                        <div>
                          <p className="font-medium">{task.title}</p>
                          <p className="text-sm text-muted-foreground capitalize">{task.status.replace('_', ' ')}</p>
                        </div>
                      </div>
                      <Badge variant={
                        task.relevance === 'high' ? 'destructive' :
                        task.relevance === 'medium' ? 'default' : 'secondary'
                      }>
                        {task.relevance}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};