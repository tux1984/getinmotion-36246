
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { AgentTask, PaginatedTasks } from './types/agentTaskTypes';
import { useAgentTasksQueries } from './useAgentTasksQueries';
import { useAgentTasksOperations } from './useAgentTasksOperations';
import { useAgentTasksSpecialOperations } from './useAgentTasksSpecialOperations';

export function useAgentTasks(agentId?: string) {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<AgentTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  // Initialize query hooks
  const { fetchTasks, fetchPaginatedTasks } = useAgentTasksQueries(user, agentId);

  // Initialize operations hooks
  const { createTask, updateTask, deleteTask, deleteAllTasks } = useAgentTasksOperations(
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

  // Realtime subscription for tasks
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel(`realtime-tasks-user-${user.id}-agent-${agentId || 'all'}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'agent_tasks',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          console.log('Task change detected, refreshing...', payload);
          refreshTasks();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, agentId, refreshTasks]);

  return {
    tasks,
    totalCount,
    loading,
    createTask,
    updateTask,
    deleteTask,
    deleteAllTasks,
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
