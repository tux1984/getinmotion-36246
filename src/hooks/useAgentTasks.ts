import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ACTIVE_TASKS_LIMIT } from './useTaskLimits';

export interface TaskSubtask {
  id: string;
  title: string;
  completed: boolean;
  created_at: string;
}

export interface TaskResource {
  id: string;
  title: string;
  url?: string;
  description?: string;
  type: 'link' | 'file' | 'note';
}

export interface AgentTask {
  id: string;
  user_id: string;
  agent_id: string;
  conversation_id: string | null;
  title: string;
  description: string | null;
  relevance: 'low' | 'medium' | 'high';
  progress_percentage: number;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority: number;
  due_date: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
  subtasks: TaskSubtask[];
  notes: string;
  steps_completed: Record<string, boolean>;
  resources: TaskResource[];
  time_spent: number;
}

export interface PaginatedTasks {
  tasks: AgentTask[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

export function useAgentTasks(agentId?: string) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [tasks, setTasks] = useState<AgentTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  const fetchTasks = useCallback(async () => {
    if (!user) {
      setTasks([]);
      setTotalCount(0);
      setLoading(false);
      return;
    }

    try {
      let query = supabase
        .from('agent_tasks')
        .select('*', { count: 'exact' })
        .eq('user_id', user.id);

      if (agentId) {
        query = query.eq('agent_id', agentId);
      }

      const { data, error, count } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      
      const typedTasks: AgentTask[] = (data || []).map(task => ({
        ...task,
        relevance: task.relevance as 'low' | 'medium' | 'high',
        status: task.status as 'pending' | 'in_progress' | 'completed' | 'cancelled',
        subtasks: task.subtasks || [],
        notes: task.notes || '',
        steps_completed: task.steps_completed || {},
        resources: task.resources || [],
        time_spent: task.time_spent || 0
      }));
      
      setTasks(typedTasks);
      setTotalCount(count || 0);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar las tareas',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [user, agentId, toast]);

  const fetchPaginatedTasks = useCallback(async (
    page: number = 1, 
    pageSize: number = 10, 
    filter: 'all' | 'pending' | 'in_progress' | 'completed' = 'all'
  ): Promise<PaginatedTasks> => {
    if (!user) {
      return { tasks: [], totalCount: 0, totalPages: 0, currentPage: page };
    }

    try {
      let query = supabase
        .from('agent_tasks')
        .select('*', { count: 'exact' })
        .eq('user_id', user.id);

      if (agentId) {
        query = query.eq('agent_id', agentId);
      }

      if (filter !== 'all') {
        query = query.eq('status', filter);
      }

      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      const { data, error, count } = await query
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) throw error;
      
      const typedTasks: AgentTask[] = (data || []).map(task => ({
        ...task,
        relevance: task.relevance as 'low' | 'medium' | 'high',
        status: task.status as 'pending' | 'in_progress' | 'completed' | 'cancelled',
        subtasks: task.subtasks || [],
        notes: task.notes || '',
        steps_completed: task.steps_completed || {},
        resources: task.resources || [],
        time_spent: task.time_spent || 0
      }));
      
      const totalPages = Math.ceil((count || 0) / pageSize);

      return {
        tasks: typedTasks,
        totalCount: count || 0,
        totalPages,
        currentPage: page
      };
    } catch (error) {
      console.error('Error fetching paginated tasks:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar las tareas',
        variant: 'destructive',
      });
      return { tasks: [], totalCount: 0, totalPages: 0, currentPage: page };
    }
  }, [user, agentId, toast]);

  const createTask = async (taskData: Partial<AgentTask>) => {
    if (!user) return null;

    // Check active tasks limit before creating
    const activeTasks = tasks.filter(task => 
      task.status === 'pending' || task.status === 'in_progress'
    );

    if (activeTasks.length >= ACTIVE_TASKS_LIMIT) {
      toast({
        title: 'Límite alcanzado',
        description: `No puedes crear más tareas. Tienes ${activeTasks.length}/${ACTIVE_TASKS_LIMIT} tareas activas. Completa algunas tareas pendientes primero.`,
        variant: 'destructive',
      });
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('agent_tasks')
        .insert({
          user_id: user.id,
          agent_id: taskData.agent_id,
          conversation_id: taskData.conversation_id,
          title: taskData.title,
          description: taskData.description,
          relevance: taskData.relevance || 'medium',
          priority: taskData.priority || 3,
          due_date: taskData.due_date,
          subtasks: taskData.subtasks || [],
          notes: taskData.notes || '',
          steps_completed: taskData.steps_completed || {},
          resources: taskData.resources || [],
          time_spent: taskData.time_spent || 0
        })
        .select()
        .single();

      if (error) throw error;
      
      const typedTask: AgentTask = {
        ...data,
        relevance: data.relevance as 'low' | 'medium' | 'high',
        status: data.status as 'pending' | 'in_progress' | 'completed' | 'cancelled',
        subtasks: data.subtasks || [],
        notes: data.notes || '',
        steps_completed: data.steps_completed || {},
        resources: data.resources || [],
        time_spent: data.time_spent || 0
      };
      
      setTasks(prev => [typedTask, ...prev]);
      setTotalCount(prev => prev + 1);
      
      toast({
        title: 'Tarea creada',
        description: `Nueva tarea creada. Tienes ${activeTasks.length + 1}/${ACTIVE_TASKS_LIMIT} tareas activas.`,
      });
      
      return typedTask;
    } catch (error) {
      console.error('Error creating task:', error);
      toast({
        title: 'Error',
        description: 'No se pudo crear la tarea',
        variant: 'destructive',
      });
      return null;
    }
  };

  const updateTask = async (taskId: string, updates: Partial<AgentTask>) => {
    try {
      const { data, error } = await supabase
        .from('agent_tasks')
        .update(updates)
        .eq('id', taskId)
        .select()
        .single();

      if (error) throw error;
      
      const typedTask: AgentTask = {
        ...data,
        relevance: data.relevance as 'low' | 'medium' | 'high',
        status: data.status as 'pending' | 'in_progress' | 'completed' | 'cancelled',
        subtasks: data.subtasks || [],
        notes: data.notes || '',
        steps_completed: data.steps_completed || {},
        resources: data.resources || [],
        time_spent: data.time_spent || 0
      };
      
      setTasks(prev => prev.map(task => task.id === taskId ? typedTask : task));
      return typedTask;
    } catch (error) {
      console.error('Error updating task:', error);
      toast({
        title: 'Error',
        description: 'No se pudo actualizar la tarea',
        variant: 'destructive',
      });
      return null;
    }
  };

  const updateSubtasks = async (taskId: string, subtasks: TaskSubtask[]) => {
    const completedSubtasks = subtasks.filter(st => st.completed).length;
    const progressPercentage = subtasks.length > 0 ? Math.round((completedSubtasks / subtasks.length) * 100) : 0;
    
    return updateTask(taskId, {
      subtasks,
      progress_percentage: progressPercentage,
      status: progressPercentage === 100 ? 'completed' : progressPercentage > 0 ? 'in_progress' : 'pending',
      completed_at: progressPercentage === 100 ? new Date().toISOString() : null
    });
  };

  const updateNotes = async (taskId: string, notes: string) => {
    return updateTask(taskId, { notes });
  };

  const updateResources = async (taskId: string, resources: TaskResource[]) => {
    return updateTask(taskId, { resources });
  };

  const updateTimeSpent = async (taskId: string, timeSpent: number) => {
    return updateTask(taskId, { time_spent: timeSpent });
  };

  const deleteTask = async (taskId: string) => {
    try {
      const { error } = await supabase
        .from('agent_tasks')
        .delete()
        .eq('id', taskId);

      if (error) throw error;
      
      setTasks(prev => prev.filter(task => task.id !== taskId));
      setTotalCount(prev => prev - 1);
    } catch (error) {
      console.error('Error deleting task:', error);
      toast({
        title: 'Error',
        description: 'No se pudo eliminar la tarea',
        variant: 'destructive',
      });
    }
  };

  const deleteAllTasks = async () => {
    if (!user) return false;

    try {
      let query = supabase
        .from('agent_tasks')
        .delete()
        .eq('user_id', user.id);

      if (agentId) {
        query = query.eq('agent_id', agentId);
      }

      const { error } = await query;

      if (error) throw error;
      
      setTasks([]);
      setTotalCount(0);
      
      toast({
        title: 'Todas las tareas eliminadas',
        description: 'Se han eliminado todas las tareas exitosamente.',
      });
      
      return true;
    } catch (error) {
      console.error('Error deleting all tasks:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron eliminar todas las tareas',
        variant: 'destructive',
      });
      return false;
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchTasks();
  }, [fetchTasks]);

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
          fetchTasks();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, agentId, fetchTasks]);

  return {
    tasks,
    totalCount,
    loading,
    createTask,
    updateTask,
    deleteTask,
    deleteAllTasks,
    fetchPaginatedTasks,
    refreshTasks: fetchTasks,
    updateSubtasks,
    updateNotes,
    updateResources,
    updateTimeSpent
  };
}
