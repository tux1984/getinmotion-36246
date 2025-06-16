
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { useTaskLimits } from '@/hooks/useTaskLimits';
import { AgentTask } from '@/hooks/useAgentTasks';

interface TaskLimitIndicatorProps {
  tasks: AgentTask[];
  language: 'en' | 'es';
  compact?: boolean;
}

export const TaskLimitIndicator: React.FC<TaskLimitIndicatorProps> = ({
  tasks,
  language,
  compact = false
}) => {
  const { 
    activeTasksCount, 
    isAtLimit, 
    isNearLimit, 
    remainingSlots, 
    getProgressColor, 
    getProgressPercentage,
    limit 
  } = useTaskLimits(tasks);

  const t = {
    en: {
      activeTasks: 'Active Tasks',
      remaining: 'remaining slots',
      limit: 'Task Limit',
      atLimit: 'At Limit',
      nearLimit: 'Near Limit',
      completeFirst: 'Complete pending tasks to create new ones'
    },
    es: {
      activeTasks: 'Tareas Activas',
      remaining: 'espacios restantes',
      limit: 'Límite de Tareas',
      atLimit: 'En el Límite',
      nearLimit: 'Cerca del Límite',
      completeFirst: 'Completa tareas pendientes para crear nuevas'
    }
  };

  // Only show if user actually has active tasks or is near/at limit
  if (activeTasksCount === 0) {
    return null;
  }

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <Badge 
          variant={isAtLimit ? 'destructive' : isNearLimit ? 'secondary' : 'default'}
          className="text-xs"
        >
          {activeTasksCount}/{limit}
        </Badge>
        {isAtLimit && <AlertTriangle className="w-4 h-4 text-red-500" />}
      </div>
    );
  }

  return (
    <div className="bg-slate-50 rounded-lg p-4 border">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">
            {t[language].activeTasks}
          </span>
        </div>
        <Badge 
          variant={isAtLimit ? 'destructive' : isNearLimit ? 'secondary' : 'default'}
          className="text-xs"
        >
          {activeTasksCount}/{limit}
        </Badge>
      </div>
      
      <Progress 
        value={getProgressPercentage()} 
        className="h-2 mb-2"
      />
      
      <div className="flex items-center justify-between text-xs text-gray-600">
        <span>
          {remainingSlots} {t[language].remaining}
        </span>
        {isAtLimit && (
          <div className="flex items-center gap-1 text-red-600">
            <AlertTriangle className="w-3 h-3" />
            <span>{t[language].completeFirst}</span>
          </div>
        )}
      </div>
    </div>
  );
};
