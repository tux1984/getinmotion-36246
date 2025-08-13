
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTranslations } from '@/hooks/useTranslations';
import { TaskDetailView } from './TaskDetailView';
import { TaskStepInterface } from './TaskStepInterface';
import { DeleteTaskDialog } from './DeleteTaskDialog';
import { 
  CheckCircle2, 
  Clock, 
  Trash2, 
  Play, 
  RotateCcw, 
  Eye,
  Target,
  Timer,
  MessageSquare,
  AlertCircle,
  Check,
  Archive,
  ArchiveRestore
} from 'lucide-react';
import { AgentTask } from '@/hooks/useAgentTasks';
import { useTaskLimits } from '@/hooks/useTaskLimits';

interface DetailedTaskCardProps {
  task: AgentTask;
  language: 'en' | 'es';
  onStartDevelopment?: (task: AgentTask) => void;
  onChatWithAgent?: (task: AgentTask) => void;
  onCompleteTask?: (task: AgentTask) => void;
  onDelete: (taskId: string) => void;
  onArchive?: (taskId: string) => void;
  onUnarchive?: (taskId: string) => void;
  isUpdating: boolean;
  allTasks?: AgentTask[];
}

export const DetailedTaskCard: React.FC<DetailedTaskCardProps> = ({
  task,
  language,
  onStartDevelopment,
  onChatWithAgent,
  onCompleteTask,
  onDelete,
  onArchive,
  onUnarchive,
  isUpdating,
  allTasks = []
}) => {
  const taskLimits = useTaskLimits(allTasks);
  const { t } = useTranslations();
  const [showTaskDetail, setShowTaskDetail] = useState(false);
  const [showStepInterface, setShowStepInterface] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const getStatusBadge = (status: AgentTask['status']) => {
    const statusConfig = {
      pending: { variant: 'secondary' as const, color: 'text-yellow-600', icon: Clock },
      in_progress: { variant: 'default' as const, color: 'text-blue-600', icon: Play },
      completed: { variant: 'default' as const, color: 'text-green-600', icon: CheckCircle2 },
      cancelled: { variant: 'outline' as const, color: 'text-gray-600', icon: RotateCcw }
    };
    return statusConfig[status] || statusConfig.pending;
  };

  const handleStartDevelopment = () => {
    if (taskLimits.isAtLimit && task.status === 'pending') {
      return; // Prevent action when at limit
    }
    onStartDevelopment?.(task);
  };

  const handleCompleteTask = () => {
    onCompleteTask?.(task);
  };

  const handleChatWithAgent = () => {
    onChatWithAgent?.(task);
  };

  const getMainCTA = () => {
    if (task.status === 'completed') {
      return {
        label: t.tasks.completed,
        icon: CheckCircle2,
        onClick: () => {},
        variant: 'default' as const,
        className: 'bg-green-600 text-white cursor-default',
        disabled: true
      };
    }
    
    if (task.status === 'in_progress') {
    return {
      label: t.dashboard.continueTask,
      icon: MessageSquare,
      onClick: () => setShowStepInterface(true),
      variant: 'default' as const,
      className: 'bg-blue-600 hover:bg-blue-700 text-white'
    };
    }
    
    // For pending tasks, check if we can start development
    const canStartDevelopment = !taskLimits.isAtLimit;
    
    return {
      label: t.tasks.activateTask,
      icon: Play,
      onClick: handleStartDevelopment,
      variant: 'default' as const,
      className: canStartDevelopment 
        ? 'bg-purple-600 hover:bg-purple-700 text-white' 
        : 'bg-gray-400 text-gray-600 cursor-not-allowed',
      disabled: !canStartDevelopment
    };
  };

  const getQuickCompleteButton = () => {
    // Show quick complete for pending tasks when at limit
    if (task.status === 'pending' || task.status === 'in_progress') {
      return {
        label: t.tasks.markCompleted,
        icon: Check,
        onClick: handleCompleteTask,
        variant: 'outline' as const,
        className: 'border-green-500 text-green-600 hover:bg-green-50'
      };
    }
    return null;
  };

  const statusBadge = getStatusBadge(task.status);
  const StatusIcon = statusBadge.icon;
  const mainCTA = getMainCTA();
  const quickComplete = getQuickCompleteButton();
  const QuickCompleteIcon = quickComplete?.icon;

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

            {/* Limit warning for pending tasks */}
            {task.status === 'pending' && taskLimits.isAtLimit && (
              <div className="flex items-center gap-1 text-xs text-red-600 mb-2 bg-red-50 p-2 rounded">
                <AlertCircle className="w-3 h-3" />
                <span>{t.tasks.limitReached} ({taskLimits.activeTasksCount}/{taskLimits.limit})</span>
              </div>
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
                  <span>{completedSubtasks}/{totalSubtasks} {t.tasks.subtasks}</span>
                </div>
              )}

              {/* Time spent */}
              {task.time_spent > 0 && (
                <div className="flex items-center gap-1">
                  <Timer className="w-3 h-3" />
                  <span>{task.time_spent} {t.time.minutes}</span>
                </div>
              )}

              {/* Due date */}
              {task.due_date && (
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{t.tasks.due}: {new Date(task.due_date).toLocaleDateString()}</span>
                </div>
              )}
            </div>

            {/* Show subtasks preview when in progress */}
            {task.status === 'in_progress' && task.subtasks && task.subtasks.length > 0 && (
              <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                <h5 className="text-xs font-medium text-gray-700 mb-2 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  {language === 'en' ? 'Subtasks' : 'Subtareas'} ({completedSubtasks}/{totalSubtasks})
                </h5>
                <div className="space-y-1">
                  {task.subtasks.slice(0, 3).map((subtask) => (
                    <div key={subtask.id} className="flex items-center gap-2 text-xs">
                      <div className={`w-2 h-2 rounded border ${
                        subtask.completed 
                          ? 'bg-green-500 border-green-500' 
                          : 'border-gray-300'
                      }`} />
                      <span className={`${subtask.completed ? 'line-through text-gray-500' : 'text-gray-700'} truncate`}>
                        {subtask.title}
                      </span>
                    </div>
                  ))}
                  {task.subtasks.length > 3 && (
                    <div className="text-xs text-gray-500 pl-4">
                      +{task.subtasks.length - 3} {language === 'en' ? 'more...' : 'más...'}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1 ml-3">
            {/* Main Unified CTA */}
            {mainCTA && (
              <Button 
                onClick={mainCTA.onClick}
                size="sm" 
                variant={mainCTA.variant}
                className={`${mainCTA.className} h-8 px-3`}
                disabled={isUpdating || mainCTA.disabled}
              >
                <mainCTA.icon className="w-3 h-3 mr-1" />
                <span className="text-xs">{mainCTA.label}</span>
              </Button>
            )}

            {/* Quick Complete - Show for in_progress tasks */}
            {quickComplete && QuickCompleteIcon && task.status === 'in_progress' && (
              <Button 
                onClick={quickComplete.onClick}
                size="sm" 
                variant={quickComplete.variant}
                className={`${quickComplete.className} h-8 px-2`}
                disabled={isUpdating}
                title={t.tasks.quickComplete}
              >
                <QuickCompleteIcon className="w-3 h-3" />
              </Button>
            )}

            {/* View Details - Only for in_progress tasks */}
            {task.status === 'in_progress' && (
              <Button 
                onClick={() => setShowTaskDetail(true)}
                size="sm" 
                variant="outline"
                className="h-8 px-2 border-blue-500 text-blue-600 hover:bg-blue-50"
                disabled={isUpdating}
                title={language === 'en' ? 'View Details' : 'Ver Detalles'}
              >
                <Eye className="w-3 h-3" />
              </Button>
            )}

            {/* Archive/Unarchive */}
            {task.is_archived ? (
              <Button 
                onClick={() => onUnarchive?.(task.id)}
                size="sm" 
                variant="ghost"
                className="h-8 px-2 text-blue-500 hover:text-blue-700"
                disabled={isUpdating}
                title={language === 'en' ? 'Unarchive' : 'Desarchivar'}
              >
                <ArchiveRestore className="w-3 h-3" />
              </Button>
            ) : (
              <Button 
                onClick={() => onArchive?.(task.id)}
                size="sm" 
                variant="ghost"
                className="h-8 px-2 text-gray-500 hover:text-gray-700"
                disabled={isUpdating}
                title={language === 'en' ? 'Archive' : 'Archivar'}
              >
                <Archive className="w-3 h-3" />
              </Button>
            )}

            {/* Delete */}
            <Button 
              onClick={() => setShowDeleteDialog(true)}
              size="sm" 
              variant="ghost"
              className="h-8 px-2 text-red-500 hover:text-red-700"
              disabled={isUpdating}
              title={language === 'en' ? 'Delete' : 'Eliminar'}
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        </div>

        {/* Task Detail Modal */}
        {showTaskDetail && (
          <TaskDetailView
            task={task}
            language={language}
            onUpdateSubtasks={() => Promise.resolve()}
            onUpdateNotes={() => Promise.resolve()}
            onUpdateResources={() => Promise.resolve()}
            onUpdateTimeSpent={() => Promise.resolve()}
            onClose={() => setShowTaskDetail(false)}
            onChatWithAgent={() => onChatWithAgent?.(task)}
          />
        )}

        {/* Task Step Interface Modal */}
        {showStepInterface && (
          <TaskStepInterface
            task={task}
            language={language}
            onClose={() => setShowStepInterface(false)}
            onComplete={() => {
              setShowStepInterface(false);
              onCompleteTask?.(task);
            }}
          />
        )}

        {/* Delete Task Confirmation Dialog */}
        <DeleteTaskDialog
          isOpen={showDeleteDialog}
          onClose={() => setShowDeleteDialog(false)}
          onConfirm={async () => {
            await onDelete(task.id);
            setShowDeleteDialog(false);
          }}
          task={task}
          language={language}
        />
      </CardContent>
    </Card>
  );
};
