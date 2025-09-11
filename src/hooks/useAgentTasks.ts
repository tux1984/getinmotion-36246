
import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { AgentTask, PaginatedTasks } from './types/agentTaskTypes';
import { useAgentTasksQueries } from './useAgentTasksQueries';
import { useAgentTasksOperations } from './useAgentTasksOperations';
import { useAgentTasksSpecialOperations } from './useAgentTasksSpecialOperations';
import { replaceGoalArrayInText } from './utils/agentTaskUtils';

export function useAgentTasks(agentId?: string) {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<AgentTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  // Initialize query hooks
  const { fetchTasks, fetchPaginatedTasks } = useAgentTasksQueries(user, agentId);

  // Initialize operations hooks
  const { createTask, updateTask, deleteTask, deleteAllTasks, archiveTask, unarchiveTask } = useAgentTasksOperations(
    user, tasks, setTasks, setTotalCount
  );

  // Initialize special operations hooks
  const { 
    startTaskDevelopment,
    completeTaskQuickly,
    updateSubtasks,
    updateNotes,
    updateResources,
    updateTimeSpent
  } = useAgentTasksSpecialOperations(user, tasks, setTasks, updateTask);

  // Wrapper for fetchTasks to handle state management
  const refreshTasks = useCallback(() => {
    setLoading(true);
    fetchTasks(setTasks, setTotalCount, setLoading);
  }, [fetchTasks]);

  useEffect(() => {
    refreshTasks();
  }, [refreshTasks]);

  // Note: Realtime subscription temporarily disabled to fix SecurityError
  // Manual refresh can be triggered via refreshTasks() function

  const hasSanitizedOnce = useRef(false);
  useEffect(() => {
    if (hasSanitizedOnce.current || tasks.length === 0) return;
    const pattern = /\["[a-z_]+(?:","[a-z_]+)*"\]/;
    const toFix = tasks.filter(t => (typeof t.title === 'string' && pattern.test(t.title)) || (typeof t.description === 'string' && pattern.test(t.description)));
    if (toFix.length === 0) return;
    hasSanitizedOnce.current = true;
    toFix.forEach(async (t) => {
      const newTitle = replaceGoalArrayInText(t.title);
      const newDescription = replaceGoalArrayInText(t.description || '');
      if (newTitle !== t.title || newDescription !== (t.description || '')) {
        try {
          await updateTask(t.id, { title: newTitle, description: newDescription });
        } catch (err) {
          console.error('Failed to sanitize task text', { id: t.id, err });
        }
      }
    });
  }, [tasks, updateTask]);

  return {
    tasks,
    totalCount,
    loading,
    createTask,
    updateTask,
    deleteTask,
    deleteAllTasks,
    archiveTask,
    unarchiveTask,
    fetchPaginatedTasks,
    refreshTasks,
    updateSubtasks,
    updateNotes,
    updateResources,
    updateTimeSpent,
    startTaskDevelopment,
    completeTaskQuickly
  };
}

// Re-export types for backward compatibility
export type { AgentTask, TaskSubtask, TaskResource, PaginatedTasks } from './types/agentTaskTypes';
