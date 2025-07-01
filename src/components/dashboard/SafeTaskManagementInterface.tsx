
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  User,
  Play,
  Edit,
  Eye,
  MessageSquare
} from 'lucide-react';
import { useAgentTasks } from '@/hooks/useAgentTasks';
import { CreateTaskModal } from './CreateTaskModal';
import { UnifiedTaskWorkflowModal } from './UnifiedTaskWorkflowModal';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface SafeTaskManagementInterfaceProps {
  language: 'en' | 'es';
  onTaskCreate?: () => void;
  onTaskUpdate?: () => void;
  maturityScores?: any;
  profileData?: any;
  enabledAgents?: string[];
  onSelectAgent?: (id: string) => void;
}

export const SafeTaskManagementInterface: React.FC<SafeTaskManagementInterfaceProps> = ({
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
  const [selectedTask, setSelectedTask] = useState<any>(null);

  const t = {
    en: {
      taskManagement: 'Your Next Steps 🎯',
      newTask: 'Add New Task',
      allTasks: 'All Tasks',
      inProgress: 'Working On',
      completed: 'Done',
      pending: 'To Do',
      noTasks: "Let's create your first task!",
      createFirst: 'I can help you get started with personalized recommendations',
      dueDate: 'Due',
      progress: 'Progress',
      execute: 'Start',
      complete: 'Finish',
      edit: 'Edit',
      viewDetails: 'View Details',
      workWithAgent: 'Get Help',
      getStarted: 'Based on your answers, I think you should start here:'
    },
    es: {
      taskManagement: 'Tus Próximos Pasos 🎯',
      newTask: 'Agregar Tarea',
      allTasks: 'Todas',
      inProgress: 'Trabajando',
      completed: 'Listas',
      pending: 'Por Hacer',
      noTasks: '¡Vamos a crear tu primera tarea!',
      createFirst: 'Te puedo ayudar a empezar con recomendaciones personalizadas',
      dueDate: 'Vence',
      progress: 'Progreso',
      execute: 'Empezar',
      complete: 'Terminar',
      edit: 'Editar',
      viewDetails: 'Ver Detalles',
      workWithAgent: 'Pedir Ayuda',
      getStarted: 'Basándome en tus respuestas, creo que deberías empezar por acá:'
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPersonalizedRecommendation = () => {
    if (!maturityScores) return '';
    
    const { ideaValidation, userExperience, marketFit, monetization } = maturityScores;
    
    if (language === 'es') {
      if (ideaValidation < 50) {
        return "Validar tu idea con potenciales usuarios - es súper importante antes de seguir";
      } else if (userExperience < 50) {
        return "Mejorar la experiencia que le das a tus usuarios - acá está la clave del éxito";
      } else if (marketFit < 50) {
        return "Investigar mejor tu mercado y competencia - conoce a quién le vendes";
      } else if (monetization < 50) {
        return "Definir cómo vas a generar ingresos - es hora de monetizar tu proyecto";
      } else {
        return "¡Estás muy bien! Ahora enfócate en escalar y optimizar lo que ya tienes";
      }
    } else {
      if (ideaValidation < 50) {
        return "Validate your idea with potential users - super important before moving forward";
      } else if (userExperience < 50) {
        return "Improve the experience you give your users - this is key to success";
      } else if (marketFit < 50) {
        return "Better research your market and competition - know who you're selling to";
      } else if (monetization < 50) {
        return "Define how you're going to generate income - time to monetize your project";
      } else {
        return "You're doing great! Now focus on scaling and optimizing what you already have";
      }
    }
  };

  const handleCreateTask = async (taskData: any) => {
    try {
      const newTask = await createTask({
        ...taskData,
        agent_id: 'general'
      });
      
      if (newTask && onTaskCreate) {
        onTaskCreate();
      }
      
      return newTask;
    } catch (error) {
      console.error('Error creating task:', error);
      return null;
    }
  };

  const handleExecuteTask = async (task: any) => {
    await updateTask(task.id, { 
      status: 'in_progress',
      progress_percentage: Math.max(task.progress_percentage, 10)
    });
    if (onTaskUpdate) onTaskUpdate();
  };

  const handleCompleteTask = async (task: any) => {
    await updateTask(task.id, { 
      status: 'completed',
      progress_percentage: 100,
      completed_at: new Date().toISOString()
    });
    if (onTaskUpdate) onTaskUpdate();
  };

  const handleWorkWithAgent = (task: any) => {
    if (onSelectAgent) {
      onSelectAgent(task.agent_id);
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
      <Card className="bg-white/10 backdrop-blur-xl border border-white/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-semibold text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-purple-400" />
              {t[language].taskManagement}
            </CardTitle>
            <Button 
              onClick={() => setShowCreateModal(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white"
              size="sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              {t[language].newTask}
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {/* Task Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white/5 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-white">{taskStats.total}</div>
              <div className="text-xs text-white/70">{t[language].allTasks}</div>
            </div>
            <div className="bg-yellow-500/20 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-yellow-300">{taskStats.pending}</div>
              <div className="text-xs text-yellow-200">{t[language].pending}</div>
            </div>
            <div className="bg-blue-500/20 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-blue-300">{taskStats.inProgress}</div>
              <div className="text-xs text-blue-200">{t[language].inProgress}</div>
            </div>
            <div className="bg-green-500/20 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-green-300">{taskStats.completed}</div>
              <div className="text-xs text-green-200">{t[language].completed}</div>
            </div>
          </div>

          {/* Recent Tasks */}
          {recentTasks.length === 0 ? (
            <div className="text-center py-8 text-white/60">
              <Target className="w-8 h-8 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium text-white mb-2">{t[language].noTasks}</h3>
              <p className="text-sm opacity-75 mb-4">{t[language].createFirst}</p>
              
              {/* Personalized recommendation */}
              {maturityScores && (
                <div className="bg-gradient-to-r from-purple-500/20 to-indigo-500/20 rounded-lg p-4 mt-4 border border-white/10">
                  <p className="text-sm font-medium text-purple-200 mb-2">
                    {t[language].getStarted}
                  </p>
                  <p className="text-white text-sm">
                    {getPersonalizedRecommendation()}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {recentTasks.map((task) => (
                <div
                  key={task.id}
                  className="p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white text-sm font-medium truncate">
                        {task.title}
                      </h4>
                      {task.description && (
                        <p className="text-white/70 text-xs mt-1 line-clamp-1">
                          {task.description}
                        </p>
                      )}
                    </div>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-white/60 hover:text-white h-6 w-6 p-0">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setSelectedTask(task)}>
                          <Eye className="w-4 h-4 mr-2" />
                          {t[language].viewDetails}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleWorkWithAgent(task)}>
                          <MessageSquare className="w-4 h-4 mr-2" />
                          {t[language].workWithAgent}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Progress Bar */}
                  {task.progress_percentage > 0 && (
                    <div className="mb-2">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs text-white/60">{t[language].progress}</span>
                        <span className="text-xs text-white/60">{task.progress_percentage}%</span>
                      </div>
                      <Progress value={task.progress_percentage} className="h-1 bg-white/20" />
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className={`text-xs ${getStatusColor(task.status)}`}>
                        {t[language][task.status] || task.status}
                      </Badge>
                      
                      {task.due_date && (
                        <div className="flex items-center gap-1 text-xs text-white/60">
                          <Calendar className="w-3 h-3" />
                          <span>{new Date(task.due_date).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 text-xs text-white/60">
                        <User className="w-3 h-3" />
                        <span>General</span>
                      </div>
                      
                      {/* Task CTAs */}
                      <div className="flex gap-1">
                        {task.status === 'pending' && (
                          <Button
                            size="sm"
                            onClick={() => handleExecuteTask(task)}
                            className="bg-green-600 hover:bg-green-700 text-white h-6 px-2"
                          >
                            <Play className="w-3 h-3 mr-1" />
                            <span className="text-xs">{t[language].execute}</span>
                          </Button>
                        )}
                        
                        {task.status === 'in_progress' && (
                          <Button
                            size="sm"
                            onClick={() => handleCompleteTask(task)}
                            className="bg-blue-600 hover:bg-blue-700 text-white h-6 px-2"
                          >
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            <span className="text-xs">{t[language].complete}</span>
                          </Button>
                        )}
                        
                        <Button
                          size="sm"
                          onClick={() => setSelectedTask(task)}
                          variant="outline"
                          className="border-white/20 text-white hover:bg-white/10 h-6 px-2"
                        >
                          <Edit className="w-3 h-3 mr-1" />
                          <span className="text-xs">{t[language].edit}</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Task Modal */}
      <CreateTaskModal
        agentId="general"
        language={language}
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreateTask={handleCreateTask}
      />

      {/* Task Details Modal */}
      {selectedTask && (
        <UnifiedTaskWorkflowModal
          task={selectedTask}
          language={language}
          isOpen={!!selectedTask}
          onClose={() => setSelectedTask(null)}
          onWorkWithAgent={() => handleWorkWithAgent(selectedTask)}
          onUpdateTask={async (updates) => {
            await updateTask(selectedTask.id, updates);
            if (onTaskUpdate) onTaskUpdate();
          }}
        />
      )}
    </>
  );
};
