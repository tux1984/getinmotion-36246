import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Plus, 
  CheckCircle2, 
  Clock, 
  Target,
  MoreHorizontal,
  Calendar,
  User
} from 'lucide-react';
import { useAgentTasks } from '@/hooks/useAgentTasks';
import { CreateTaskModal } from './CreateTaskModal';
import { UnifiedTaskWorkflowModal } from './UnifiedTaskWorkflowModal';
import { AgentTask } from '@/hooks/useAgentTasks';
import { CategoryScore } from '@/types/dashboard';

interface TaskManagementInterfaceProps {
  language: 'en' | 'es';
  onTaskCreate?: () => void;
  onTaskUpdate?: () => void;
  maturityScores?: CategoryScore | null;
  profileData?: any;
  enabledAgents?: string[];
  onSelectAgent?: (id: string) => void;
}

export const TaskManagementInterface: React.FC<TaskManagementInterfaceProps> = ({
  language,
  onTaskCreate,
  onTaskUpdate,
  maturityScores,
  profileData,
  enabledAgents,
  onSelectAgent
}) => {
  const { tasks, createTask, updateTask, loading } = useAgentTasks();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<AgentTask | null>(null);

  const t = {
    en: {
      taskManagement: 'Task Management',
      newTask: 'New Task',
      allTasks: 'All Tasks',
      inProgress: 'In Progress',
      completed: 'Completed',
      pending: 'Pending',
      noTasks: 'No tasks yet',
      createFirst: 'Create your first task!',
      dueDate: 'Due',
      progress: 'Progress'
    },
    es: {
      taskManagement: 'Gestión de Tareas',
      newTask: 'Nueva Tarea',
      allTasks: 'Todas las Tareas',
      inProgress: 'En Progreso',
      completed: 'Completadas',
      pending: 'Pendientes',
      noTasks: 'No hay tareas aún',
      createFirst: '¡Crea tu primera tarea!',
      dueDate: 'Vence',
      progress: 'Progreso'
    }
  };

  const getStatusColor = (status: AgentTask['status']) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: number) => {
    if (priority === 1) return 'border-l-red-500';
    if (priority === 2) return 'border-l-yellow-500';
    return 'border-l-green-500';
  };

  const handleCreateTask = async (taskData: Partial<AgentTask>) => {
    const newTask = await createTask({
      ...taskData,
      agent_id: 'general' // Default agent for general tasks
    });
    
    if (newTask && onTaskCreate) {
      onTaskCreate();
    }
    
    return newTask;
  };

  const handleUpdateTask = async (updates: Partial<AgentTask>) => {
    if (selectedTask) {
      await updateTask(selectedTask.id, updates);
      if (onTaskUpdate) {
        onTaskUpdate();
      }
    }
  };

  // Get task statistics
  const taskStats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'pending').length,
    inProgress: tasks.filter(t => t.status === 'in_progress').length,
    completed: tasks.filter(t => t.status === 'completed').length
  };

  // Get recent tasks (last 5)
  const recentTasks = tasks.slice(0, 5);

  if (loading) {
    return (
      <Card className="bg-white/10 backdrop-blur-xl border border-white/20 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-white/20 rounded w-1/4"></div>
          <div className="space-y-2">
            <div className="h-3 bg-white/20 rounded"></div>
            <div className="h-3 bg-white/20 rounded w-3/4"></div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card className="bg-card/80 backdrop-blur-xl border border-border/50 shadow-lg">
        {/* Header */}
        <div className="p-6 border-b border-border/20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                {t[language].taskManagement}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Tareas generadas automáticamente basadas en tu perfil
              </p>
            </div>
            <Button 
              onClick={() => setShowCreateModal(true)}
              className="shrink-0"
              size="sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              {t[language].newTask}
            </Button>
          </div>
        </div>

        {/* Task Statistics */}
        <div className="p-6 pb-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="bg-background rounded-lg p-3 text-center border border-border/50">
              <div className="text-2xl font-bold text-foreground">{taskStats.total}</div>
              <div className="text-xs text-muted-foreground">{t[language].allTasks}</div>
            </div>
            <div className="bg-yellow-50 rounded-lg p-3 text-center border border-yellow-200">
              <div className="text-2xl font-bold text-yellow-700">{taskStats.pending}</div>
              <div className="text-xs text-yellow-600">{t[language].pending}</div>
            </div>
            <div className="bg-blue-50 rounded-lg p-3 text-center border border-blue-200">
              <div className="text-2xl font-bold text-blue-700">{taskStats.inProgress}</div>
              <div className="text-xs text-blue-600">{t[language].inProgress}</div>
            </div>
            <div className="bg-green-50 rounded-lg p-3 text-center border border-green-200">
              <div className="text-2xl font-bold text-green-700">{taskStats.completed}</div>
              <div className="text-xs text-green-600">{t[language].completed}</div>
            </div>
          </div>
        </div>

        {/* Recent Tasks */}
        <div className="px-6 pb-6">
          {recentTasks.length === 0 ? (
            <div className="text-center py-12">
              <Target className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
              <h3 className="text-lg font-medium mb-2">{t[language].noTasks}</h3>
              <p className="text-sm text-muted-foreground mb-4">{t[language].createFirst}</p>
              <p className="text-xs text-muted-foreground bg-muted/50 rounded-lg p-3 max-w-md mx-auto">
                💡 Las tareas se generan automáticamente después de completar la calculadora de madurez
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentTasks.map((task) => (
                <div
                  key={task.id}
                  className={`p-4 rounded-lg bg-background border border-border hover:border-primary/50 transition-all duration-200 cursor-pointer border-l-4 ${getPriorityColor(task.priority)}`}
                  onClick={() => setSelectedTask(task)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">
                        {task.title}
                      </h4>
                      {task.description && (
                        <p className="text-muted-foreground text-sm mt-1 line-clamp-2">
                          {task.description}
                        </p>
                      )}
                    </div>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 shrink-0">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Progress Bar */}
                  {task.progress_percentage > 0 && (
                    <div className="mb-3">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs text-muted-foreground">{t[language].progress}</span>
                        <span className="text-xs font-medium">{task.progress_percentage}%</span>
                      </div>
                      <Progress value={task.progress_percentage} className="h-2" />
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className={`text-xs ${getStatusColor(task.status)}`}>
                        {t[language][task.status] || task.status}
                      </Badge>
                      
                      {task.due_date && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          <span>{new Date(task.due_date).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <User className="w-3 h-3" />
                      <span>General</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* Create Task Modal */}
      <CreateTaskModal
        agentId="general"
        language={language}
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreateTask={handleCreateTask}
      />

      {/* Task Detail Modal */}
      {selectedTask && (
        <UnifiedTaskWorkflowModal
          task={selectedTask}
          language={language}
          isOpen={!!selectedTask}
          onClose={() => setSelectedTask(null)}
          onWorkWithAgent={() => {}}
          onUpdateTask={handleUpdateTask}
        />
      )}
    </>
  );
};
