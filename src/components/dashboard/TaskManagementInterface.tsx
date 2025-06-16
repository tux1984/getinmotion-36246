
import React, { useState } from 'react';
import { useAgentTasks, AgentTask } from '@/hooks/useAgentTasks';
import { useOptimizedRecommendedTasks, OptimizedRecommendedTask } from '@/hooks/useOptimizedRecommendedTasks';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  ListTodo, 
  Plus, 
  Lightbulb, 
  CheckCircle2, 
  Clock, 
  Trash2,
  Filter,
  Star
} from 'lucide-react';
import { CategoryScore } from '@/types/dashboard';

interface TaskManagementInterfaceProps {
  maturityScores: CategoryScore | null;
  profileData: any | null;
  enabledAgents: string[];
  language: 'en' | 'es';
  onSelectAgent: (agentId: string) => void;
}

export const TaskManagementInterface: React.FC<TaskManagementInterfaceProps> = ({
  maturityScores,
  profileData,
  enabledAgents,
  language,
  onSelectAgent
}) => {
  const { tasks: realTasks, loading: realTasksLoading, createTask, updateTask, deleteTask } = useAgentTasks();
  const { tasks: suggestedTasks, loading: suggestedLoading, convertToRealTask } = useOptimizedRecommendedTasks(
    maturityScores, 
    profileData, 
    enabledAgents
  );
  
  const [filter, setFilter] = useState<'all' | 'pending' | 'in_progress' | 'completed'>('all');

  const t = {
    en: {
      taskManagement: 'Task Management',
      realTasks: 'My Tasks',
      suggestions: 'Suggestions',
      createTask: 'Create Task',
      convertToTask: 'Create Task',
      markComplete: 'Complete',
      deleteTask: 'Delete',
      noTasks: 'No tasks yet',
      noSuggestions: 'No suggestions available',
      filterAll: 'All',
      filterPending: 'Pending',
      filterInProgress: 'In Progress',
      filterCompleted: 'Completed',
      chatWithAgent: 'Chat with Agent'
    },
    es: {
      taskManagement: 'Gestión de Tareas',
      realTasks: 'Mis Tareas',
      suggestions: 'Sugerencias',
      createTask: 'Crear Tarea',
      convertToTask: 'Crear Tarea',
      markComplete: 'Completar',
      deleteTask: 'Eliminar',
      noTasks: 'No hay tareas aún',
      noSuggestions: 'No hay sugerencias disponibles',
      filterAll: 'Todas',
      filterPending: 'Pendientes',
      filterInProgress: 'En Progreso',
      filterCompleted: 'Completadas',
      chatWithAgent: 'Chatear con Agente'
    }
  };

  const filteredRealTasks = realTasks.filter(task => {
    if (filter === 'all') return true;
    return task.status === filter;
  });

  const handleConvertSuggestedTask = async (suggestedTask: OptimizedRecommendedTask) => {
    await createTask({
      agent_id: suggestedTask.agentId,
      title: suggestedTask.title,
      description: suggestedTask.description,
      relevance: suggestedTask.priority as 'low' | 'medium' | 'high',
      priority: suggestedTask.priority === 'high' ? 1 : suggestedTask.priority === 'medium' ? 2 : 3
    });
  };

  const handleTaskStatusChange = async (taskId: string, newStatus: AgentTask['status']) => {
    const updates: Partial<AgentTask> = { status: newStatus };
    if (newStatus === 'completed') {
      updates.completed_at = new Date().toISOString();
      updates.progress_percentage = 100;
    }
    await updateTask(taskId, updates);
  };

  const getStatusBadge = (status: AgentTask['status']) => {
    const statusConfig = {
      pending: { variant: 'secondary' as const, color: 'text-yellow-600' },
      in_progress: { variant: 'default' as const, color: 'text-blue-600' },
      completed: { variant: 'default' as const, color: 'text-green-600' },
      cancelled: { variant: 'outline' as const, color: 'text-gray-600' }
    };
    return statusConfig[status] || statusConfig.pending;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ListTodo className="w-5 h-5" />
          {t[language].taskManagement}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="tasks" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="tasks" className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              {t[language].realTasks} ({realTasks.length})
            </TabsTrigger>
            <TabsTrigger value="suggestions" className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              {t[language].suggestions} ({suggestedTasks.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tasks" className="space-y-4">
            {/* Filtros para tareas reales */}
            <div className="flex items-center gap-2 flex-wrap">
              <Filter className="w-4 h-4 text-gray-500" />
              <Button 
                variant={filter === 'all' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setFilter('all')}
              >
                {t[language].filterAll}
              </Button>
              <Button 
                variant={filter === 'pending' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setFilter('pending')}
              >
                {t[language].filterPending}
              </Button>
              <Button 
                variant={filter === 'in_progress' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setFilter('in_progress')}
              >
                {t[language].filterInProgress}
              </Button>
              <Button 
                variant={filter === 'completed' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setFilter('completed')}
              >
                {t[language].filterCompleted}
              </Button>
            </div>

            <Separator />

            {realTasksLoading ? (
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-16 bg-gray-100 rounded animate-pulse" />
                ))}
              </div>
            ) : filteredRealTasks.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <ListTodo className="w-12 h-12 mx-auto mb-2 opacity-30" />
                <p>{t[language].noTasks}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredRealTasks.map((task) => (
                  <Card key={task.id} className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm mb-1">{task.title}</h4>
                        {task.description && (
                          <p className="text-xs text-gray-600 mb-2">{task.description}</p>
                        )}
                        <div className="flex items-center gap-2">
                          <Badge {...getStatusBadge(task.status)}>
                            {task.status}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {task.agent_id}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 ml-2">
                        {task.status !== 'completed' && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleTaskStatusChange(task.id, 'completed')}
                          >
                            <CheckCircle2 className="w-3 h-3" />
                          </Button>
                        )}
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => onSelectAgent(task.agent_id)}
                        >
                          {t[language].chatWithAgent}
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => deleteTask(task.id)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="suggestions" className="space-y-4">
            {suggestedLoading ? (
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-16 bg-gray-100 rounded animate-pulse" />
                ))}
              </div>
            ) : suggestedTasks.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Lightbulb className="w-12 h-12 mx-auto mb-2 opacity-30" />
                <p>{t[language].noSuggestions}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {suggestedTasks.map((task) => (
                  <Card key={task.id} className="p-4 border-l-4 border-l-yellow-400">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <h4 className="font-medium text-sm">{task.title}</h4>
                        </div>
                        <p className="text-xs text-gray-600 mb-2">{task.description}</p>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={`text-xs ${
                            task.priority === 'high' ? 'border-red-300 text-red-600' :
                            task.priority === 'medium' ? 'border-yellow-300 text-yellow-600' :
                            'border-green-300 text-green-600'
                          }`}>
                            {task.priority}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            <Clock className="w-3 h-3 mr-1" />
                            {task.estimatedTime}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 ml-2">
                        <Button 
                          size="sm" 
                          onClick={() => handleConvertSuggestedTask(task)}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white"
                        >
                          <Plus className="w-3 h-3 mr-1" />
                          {t[language].convertToTask}
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => onSelectAgent(task.agentId)}
                        >
                          {t[language].chatWithAgent}
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
