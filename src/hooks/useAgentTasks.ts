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

// Helper function to safely parse JSON data from database
const parseJsonField = <T>(field: any, defaultValue: T): T => {
  if (field === null || field === undefined) return defaultValue;
  if (typeof field === 'string') {
    try {
      return JSON.parse(field);
    } catch {
      return defaultValue;
    }
  }
  if (Array.isArray(field) || typeof field === 'object') {
    return field as T;
  }
  return defaultValue;
};

// Helper function to convert database row to AgentTask
const convertToAgentTask = (data: any): AgentTask => ({
  ...data,
  relevance: data.relevance as 'low' | 'medium' | 'high',
  status: data.status as 'pending' | 'in_progress' | 'completed' | 'cancelled',
  subtasks: parseJsonField<TaskSubtask[]>(data.subtasks, []),
  notes: data.notes || '',
  steps_completed: parseJsonField<Record<string, boolean>>(data.steps_completed, {}),
  resources: parseJsonField<TaskResource[]>(data.resources, []),
  time_spent: data.time_spent || 0
});

// Helper function to convert AgentTask fields to database format
const convertForDatabase = (data: Partial<AgentTask>) => {
  const dbData: any = { ...data };
  
  // Remove fields that are auto-generated or managed by the database
  delete dbData.id;
  delete dbData.created_at;
  delete dbData.updated_at;
  
  return dbData;
};

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
      
      const typedTasks: AgentTask[] = (data || []).map(convertToAgentTask);
      
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
      
      const typedTasks: AgentTask[] = (data || []).map(convertToAgentTask);
      
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
      const dbData = convertForDatabase(taskData);
      
      // IMPORTANT: Ensure user_id is included for RLS policies
      const insertData = {
        ...dbData,
        user_id: user.id, // Explicitly include user_id for RLS
        relevance: dbData.relevance || 'medium',
        priority: dbData.priority || 3,
        subtasks: dbData.subtasks || [],
        notes: dbData.notes || '',
        steps_completed: dbData.steps_completed || {},
        resources: dbData.resources || [],
        time_spent: dbData.time_spent || 0
      };

      console.log('Creating task with data:', insertData);

      const { data, error } = await supabase
        .from('agent_tasks')
        .insert(insertData)
        .select()
        .single();

      if (error) throw error;
      
      const typedTask = convertToAgentTask(data);
      
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
      const dbUpdates = convertForDatabase(updates);
      
      const { data, error } = await supabase
        .from('agent_tasks')
        .update(dbUpdates)
        .eq('id', taskId)
        .select()
        .single();

      if (error) throw error;
      
      const typedTask = convertToAgentTask(data);
      
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
