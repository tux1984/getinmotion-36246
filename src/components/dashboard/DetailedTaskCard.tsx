
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle2, 
  Clock, 
  Trash2, 
  Play, 
  RotateCcw, 
  Eye,
  Target,
  Timer,
  MessageSquare
} from 'lucide-react';
import { AgentTask } from '@/hooks/useAgentTasks';

interface DetailedTaskCardProps {
  task: AgentTask;
  language: 'en' | 'es';
  onStatusChange: (taskId: string, status: AgentTask['status']) => void;
  onDelete: (taskId: string) => void;
  onStartTask: (task: AgentTask) => void;
  onChatWithAgent: (task: AgentTask) => void;
  isUpdating: boolean;
}

export const DetailedTaskCard: React.FC<DetailedTaskCardProps> = ({
  task,
  language,
  onStatusChange,
  onDelete,
  onStartTask,
  onChatWithAgent,
  isUpdating
}) => {
  const t = {
    en: {
      startTask: 'Start Task',
      continueTask: 'Continue',
      reviewTask: 'Review',
      completed: 'Completed',
      delete: 'Delete',
      chatWithAgent: 'Chat with Agent',
      subtasks: 'subtasks',
      timeSpent: 'Time spent',
      minutes: 'min',
      dueDate: 'Due',
      progress: 'Progress'
    },
    es: {
      startTask: 'Empezar Tarea',
      continueTask: 'Continuar',
      reviewTask: 'Revisar',
      completed: 'Completada',
      delete: 'Eliminar',
      chatWithAgent: 'Chatear con Agente',
      subtasks: 'subtareas',
      timeSpent: 'Tiempo dedicado',
      minutes: 'min',
      dueDate: 'Vence',
      progress: 'Progreso'
    }
  };

  const getStatusBadge = (status: AgentTask['status']) => {
    const statusConfig = {
      pending: { variant: 'secondary' as const, color: 'text-yellow-600', icon: Clock },
      in_progress: { variant: 'default' as const, color: 'text-blue-600', icon: Play },
      completed: { variant: 'default' as const, color: 'text-green-600', icon: CheckCircle2 },
      cancelled: { variant: 'outline' as const, color: 'text-gray-600', icon: RotateCcw }
    };
    return statusConfig[status] || statusConfig.pending;
  };

  const getMainCTA = () => {
    switch (task.status) {
      case 'pending':
        return {
          label: t[language].startTask,
          icon: Play,
          onClick: () => onStartTask(task),
          variant: 'default' as const,
          className: 'bg-green-600 hover:bg-green-700 text-white'
        };
      case 'in_progress':
        return {
          label: t[language].continueTask,
          icon: Target,
          onClick: () => onStartTask(task),
          variant: 'default' as const,
          className: 'bg-blue-600 hover:bg-blue-700 text-white'
        };
      case 'completed':
        return {
          label: t[language].reviewTask,
          icon: Eye,
          onClick: () => onStartTask(task),
          variant: 'outline' as const,
          className: ''
        };
      default:
        return null;
    }
  };

  const statusBadge = getStatusBadge(task.status);
  const StatusIcon = statusBadge.icon;
  const mainCTA = getMainCTA();
  const MainCTAIcon = mainCTA?.icon;

  const completedSubtasks = task.subtasks?.filter(st => st.completed)?.length || 0;
  const totalSubtasks = task.subtasks?.length || 0;

  return (
    <Card className="group hover:shadow-md transition-all duration-200 border-l-4 border-l-purple-400">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h4 className="font-semibold text-sm truncate">{task.title}</h4>
              <Badge variant={statusBadge.variant} className={`text-xs ${statusBadge.color}`}>
                <StatusIcon className="w-3 h-3 mr-1" />
                {task.status}
              </Badge>
            </div>
            
            {task.description && (
              <p className="text-xs text-gray-600 mb-3 line-clamp-2">{task.description}</p>
            )}

            <div className="flex items-center gap-4 text-xs text-gray-500">
              {/* Progress */}
              <div className="flex items-center gap-1">
                <div className="w-16 bg-gray-200 rounded-full h-1.5">
                  <div 
                    className="bg-green-500 h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${task.progress_percentage}%` }}
                  />
                </div>
                <span>{task.progress_percentage}%</span>
              </div>

              {/* Subtasks count */}
              {totalSubtasks > 0 && (
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>{completedSubtasks}/{totalSubtasks} {t[language].subtasks}</span>
                </div>
              )}

              {/* Time spent */}
              {task.time_spent > 0 && (
                <div className="flex items-center gap-1">
                  <Timer className="w-3 h-3" />
                  <span>{task.time_spent} {t[language].minutes}</span>
                </div>
              )}

              {/* Due date */}
              {task.due_date && (
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{t[language].dueDate}: {new Date(task.due_date).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1 ml-3">
            {/* Main CTA */}
            {mainCTA && MainCTAIcon && (
              <Button 
                onClick={mainCTA.onClick}
                size="sm" 
                variant={mainCTA.variant}
                className={`${mainCTA.className} h-8 px-3`}
                disabled={isUpdating}
              >
                <MainCTAIcon className="w-3 h-3 mr-1" />
                <span className="text-xs">{mainCTA.label}</span>
              </Button>
            )}

            {/* Chat with Agent */}
            <Button 
              onClick={() => onChatWithAgent(task)}
              size="sm" 
              variant="outline"
              className="h-8 px-2"
            >
              <MessageSquare className="w-3 h-3" />
            </Button>

            {/* Quick status actions */}
            {task.status !== 'completed' && (
              <Button 
                onClick={() => onStatusChange(task.id, 'completed')}
                size="sm" 
                variant="ghost"
                className="h-8 px-2 text-green-600 hover:text-green-700"
                disabled={isUpdating}
              >
                <CheckCircle2 className="w-3 h-3" />
              </Button>
            )}

            {/* Delete */}
            <Button 
              onClick={() => onDelete(task.id)}
              size="sm" 
              variant="ghost"
              className="h-8 px-2 text-red-500 hover:text-red-700"
              disabled={isUpdating}
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
