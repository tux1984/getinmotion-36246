
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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
}

export function useAgentTasks(agentId?: string) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [tasks, setTasks] = useState<AgentTask[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    if (!user) return;

    try {
      let query = supabase
        .from('agent_tasks')
        .select('*')
        .eq('user_id', user.id);

      if (agentId) {
        query = query.eq('agent_id', agentId);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      setTasks(data || []);
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
  };

  const createTask = async (taskData: Partial<AgentTask>) => {
    if (!user) return null;

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
          due_date: taskData.due_date
        })
        .select()
        .single();

      if (error) throw error;
      
      setTasks(prev => [data, ...prev]);
      return data;
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
      
      setTasks(prev => prev.map(task => task.id === taskId ? data : task));
      return data;
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

  const deleteTask = async (taskId: string) => {
    try {
      const { error } = await supabase
        .from('agent_tasks')
        .delete()
        .eq('id', taskId);

      if (error) throw error;
      
      setTasks(prev => prev.filter(task => task.id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
      toast({
        title: 'Error',
        description: 'No se pudo eliminar la tarea',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [user, agentId]);

  return {
    tasks,
    loading,
    createTask,
    updateTask,
    deleteTask,
    refreshTasks: fetchTasks
  };
}
