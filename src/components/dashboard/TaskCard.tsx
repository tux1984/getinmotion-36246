
import React from 'react';
import { Button } from '@/components/ui/button';
import { Clock, ArrowRight, CheckCircle } from 'lucide-react';
import { OptimizedRecommendedTask } from '@/hooks/useOptimizedRecommendedTasks';

interface TaskCardProps {
  task: OptimizedRecommendedTask;
  language: 'en' | 'es';
  onAction: () => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  language,
  onAction
}) => {
  const translations = {
    en: {
      startTask: 'Start Task',
      completed: 'Completed',
      with: 'with'
    },
    es: {
      startTask: 'Comenzar Tarea',
      completed: 'Completada',
      with: 'con'
    }
  };

  const t = translations[language];

  const getPriorityColor = () => {
    switch (task.priority) {
      case 'high': return 'border-red-200 bg-red-50';
      case 'medium': return 'border-yellow-200 bg-yellow-50';
      case 'low': return 'border-green-200 bg-green-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  const getPriorityBadgeColor = () => {
    switch (task.priority) {
      case 'high': return 'bg-red-100 text-red-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'low': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className={`border rounded-lg p-4 transition-all hover:shadow-md ${getPriorityColor()}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2">
            {task.title}
          </h3>
          <p className="text-xs text-gray-600 line-clamp-2 mb-2">
            {task.description}
          </p>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full font-medium ml-2 flex-shrink-0 ${getPriorityBadgeColor()}`}>
          {task.category}
        </span>
      </div>

      <div className="flex items-center text-xs text-gray-500 mb-3">
        <Clock className="w-3 h-3 mr-1" />
        <span>{task.estimatedTime}</span>
        <span className="mx-2">•</span>
        <span>{t.with} {task.agentName}</span>
      </div>

      <div className="flex items-center justify-between">
        {task.completed ? (
          <div className="flex items-center text-green-600 text-sm">
            <CheckCircle className="w-4 h-4 mr-2" />
            {t.completed}
          </div>
        ) : (
          <Button
            size="sm"
            onClick={onAction}
            className="bg-white border border-purple-200 text-purple-700 hover:bg-purple-50 text-xs px-3 py-1 h-8"
          >
            {t.startTask}
            <ArrowRight className="w-3 h-3 ml-1" />
          </Button>
        )}
      </div>
    </div>
  );
};
