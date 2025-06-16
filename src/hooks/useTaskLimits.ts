
import { useMemo } from 'react';
import { AgentTask } from './useAgentTasks';

export const ACTIVE_TASKS_LIMIT = 30;

export const useTaskLimits = (tasks: AgentTask[]) => {
  const activeTasks = useMemo(() => 
    tasks.filter(task => task.status === 'pending' || task.status === 'in_progress'),
    [tasks]
  );

  const activeTasksCount = activeTasks.length;
  const isAtLimit = activeTasksCount >= ACTIVE_TASKS_LIMIT;
  const isNearLimit = activeTasksCount >= ACTIVE_TASKS_LIMIT - 5;
  const remainingSlots = ACTIVE_TASKS_LIMIT - activeTasksCount;
  
  const getProgressColor = () => {
    if (activeTasksCount >= ACTIVE_TASKS_LIMIT) return 'bg-red-500';
    if (activeTasksCount >= ACTIVE_TASKS_LIMIT - 5) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getProgressPercentage = () => {
    return Math.min((activeTasksCount / ACTIVE_TASKS_LIMIT) * 100, 100);
  };

  return {
    activeTasks,
    activeTasksCount,
    isAtLimit,
    isNearLimit,
    remainingSlots,
    getProgressColor,
    getProgressPercentage,
    limit: ACTIVE_TASKS_LIMIT
  };
};
