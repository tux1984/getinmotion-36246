import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Clock, CheckCircle2, AlertCircle, TrendingUp, Target, Calendar } from 'lucide-react';
import { useRobustAuth } from '@/hooks/useRobustAuth';
import { safeSupabase } from '@/utils/supabase-safe';
import { CategoryScore } from '@/types/dashboard';
import { toast } from 'sonner';

interface AgentTask {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority: number;
  agent_id: string;
  progress_percentage: number;
  due_date?: string;
  created_at: string;
}

interface OptimizedMasterCoordinatorProps {
  maturityScores: CategoryScore | null;
}

export const OptimizedMasterCoordinator: React.FC<OptimizedMasterCoordinatorProps> = ({ 
  maturityScores 
}) => {
  const { user } = useRobustAuth();
  const [tasks, setTasks] = useState<AgentTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [isGeneratingTasks, setIsGeneratingTasks] = useState(false);

  // Cargar tareas del usuario
  const loadTasks = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await safeSupabase
        .from('agent_tasks')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_archived', false)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setTasks(data || []);
    } catch (error) {
      console.error('Error loading tasks:', error);
      toast.error('Error al cargar las tareas');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  // Generar tareas basadas en puntuaciones de madurez
  const generateTasks = useCallback(async () => {
    if (!user || !maturityScores) {
      toast.error('No se pueden generar tareas sin puntuaciones de madurez');
      return;
    }

    setIsGeneratingTasks(true);
    try {
      const tasksToCreate = [];

      // Generar tareas basadas en puntuaciones bajas
      if (maturityScores.ideaValidation < 60) {
        tasksToCreate.push({
          title: 'Validar idea de negocio',
          description: 'Realizar entrevistas con 10 clientes potenciales para validar tu propuesta de valor',
          agent_id: 'validation-agent',
          priority: 5,
          status: 'pending' as const
        });
      }

      if (maturityScores.userExperience < 60) {
        tasksToCreate.push({
          title: 'Mejorar experiencia de usuario',
          description: 'Crear prototipos de baja fidelidad y obtener feedback de usuarios',
          agent_id: 'ux-agent',
          priority: 4,
          status: 'pending' as const
        });
      }

      if (maturityScores.marketFit < 60) {
        tasksToCreate.push({
          title: 'Investigar mercado objetivo',
          description: 'Analizar competidores y definir tu posicionamiento único en el mercado',
          agent_id: 'market-agent',
          priority: 4,
          status: 'pending' as const
        });
      }

      if (maturityScores.monetization < 60) {
        tasksToCreate.push({
          title: 'Definir modelo de monetización',
          description: 'Crear un plan de ingresos con al menos 3 fuentes diferentes',
          agent_id: 'monetization-agent',
          priority: 3,
          status: 'pending' as const
        });
      }

      // Insertar tareas en la base de datos
      for (const task of tasksToCreate) {
        const { error } = await safeSupabase
          .from('agent_tasks')
          .insert({
            ...task,
            user_id: user.id,
            progress_percentage: 0
          });

        if (error) {
          console.error('Error creating task:', error);
        }
      }

      toast.success(`${tasksToCreate.length} tareas generadas exitosamente`);
      await loadTasks();
    } catch (error) {
      console.error('Error generating tasks:', error);
      toast.error('Error al generar tareas');
    } finally {
      setIsGeneratingTasks(false);
    }
  }, [user, maturityScores, loadTasks]);

  // Actualizar estado de tarea
  const updateTaskStatus = useCallback(async (taskId: string, status: string) => {
    try {
      const updates: any = { status };
      if (status === 'completed') {
        updates.progress_percentage = 100;
        updates.completed_at = new Date().toISOString();
      }

      const { error } = await safeSupabase
        .from('agent_tasks')
        .update(updates)
        .eq('id', taskId);

      if (error) throw error;

      setTasks(prev => prev.map(task => 
        task.id === taskId ? { ...task, ...updates } : task
      ));

      toast.success('Tarea actualizada');
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Error al actualizar tarea');
    }
  }, []);

  const pendingTasks = tasks.filter(t => t.status === 'pending');
  const inProgressTasks = tasks.filter(t => t.status === 'in_progress');
  const completedTasks = tasks.filter(t => t.status === 'completed');
  const overallProgress = tasks.length > 0 ? (completedTasks.length / tasks.length) * 100 : 0;

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
            <div className="h-4 bg-muted rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header con estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-orange-500" />
              <div>
                <p className="text-sm text-muted-foreground">Pendientes</p>
                <p className="text-2xl font-bold">{pendingTasks.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">En Progreso</p>
                <p className="text-2xl font-bold">{inProgressTasks.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Completadas</p>
                <p className="text-2xl font-bold">{completedTasks.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target className="h-4 w-4 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">Progreso</p>
                <p className="text-2xl font-bold">{Math.round(overallProgress)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progreso general */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Progreso General</CardTitle>
            <Button 
              onClick={generateTasks}
              disabled={isGeneratingTasks || !maturityScores}
            >
              {isGeneratingTasks ? 'Generando...' : 'Generar Tareas'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Progress value={overallProgress} className="h-3" />
          <p className="text-sm text-muted-foreground mt-2">
            {completedTasks.length} de {tasks.length} tareas completadas
          </p>
        </CardContent>
      </Card>

      {/* Lista de tareas */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="pending">Pendientes</TabsTrigger>
          <TabsTrigger value="progress">En Progreso</TabsTrigger>
          <TabsTrigger value="completed">Completadas</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {tasks.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No hay tareas</h3>
                <p className="text-muted-foreground mb-4">
                  Genera tareas basadas en tu evaluación de madurez para comenzar
                </p>
                <Button onClick={generateTasks} disabled={!maturityScores}>
                  Generar Tareas Iniciales
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {tasks.slice(0, 5).map(task => (
                <TaskCard 
                  key={task.id} 
                  task={task} 
                  onStatusChange={updateTaskStatus}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          {pendingTasks.map(task => (
            <TaskCard 
              key={task.id} 
              task={task} 
              onStatusChange={updateTaskStatus}
            />
          ))}
        </TabsContent>

        <TabsContent value="progress" className="space-y-4">
          {inProgressTasks.map(task => (
            <TaskCard 
              key={task.id} 
              task={task} 
              onStatusChange={updateTaskStatus}
            />
          ))}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {completedTasks.map(task => (
            <TaskCard 
              key={task.id} 
              task={task} 
              onStatusChange={updateTaskStatus}
            />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

const TaskCard: React.FC<{
  task: AgentTask;
  onStatusChange: (id: string, status: string) => void;
}> = ({ task, onStatusChange }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-orange-100 text-orange-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'Pendiente';
      case 'in_progress': return 'En Progreso';
      case 'completed': return 'Completada';
      default: return status;
    }
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h4 className="font-medium">{task.title}</h4>
            <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
          </div>
          <Badge className={getStatusColor(task.status)}>
            {getStatusLabel(task.status)}
          </Badge>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <span className="text-xs text-muted-foreground">
              Prioridad: {task.priority}/5
            </span>
            {task.progress_percentage > 0 && (
              <span className="text-xs text-muted-foreground">
                {task.progress_percentage}% completado
              </span>
            )}
          </div>

          <div className="flex space-x-2">
            {task.status === 'pending' && (
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => onStatusChange(task.id, 'in_progress')}
              >
                Iniciar
              </Button>
            )}
            {task.status === 'in_progress' && (
              <Button 
                size="sm"
                onClick={() => onStatusChange(task.id, 'completed')}
              >
                Completar
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};