
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { AgentTask } from './types/agentTaskTypes';
import { convertToAgentTask, convertForDatabase } from './utils/agentTaskUtils';
import { ACTIVE_TASKS_LIMIT } from './useTaskLimits';
import { EnhancedErrorHandler, useEnhancedErrorHandler } from '@/utils/enhancedErrorHandling';
import { AIContentValidator } from '@/utils/contentValidation';

export function useAgentTasksOperations(
  user: any,
  tasks: AgentTask[],
  setTasks: React.Dispatch<React.SetStateAction<AgentTask[]>>,
  setTotalCount: React.Dispatch<React.SetStateAction<number>>
) {
  const { toast } = useToast();
  const { handleTaskError, handleAPICall } = useEnhancedErrorHandler();

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

    // Validar contenido de la tarea antes de crear
    if (taskData.title || taskData.description) {
      const taskValidation = AIContentValidator.validateTaskStructure(taskData);
      if (!taskValidation.isValid) {
        const enhancedError = handleTaskError(
          `Validación de tarea falló: ${taskValidation.errors.join(', ')}`,
          'create_task_validation',
          taskData
        );
        
        toast({
          title: 'Error de validación',
          description: 'Los datos de la tarea no son válidos. Por favor revisa el contenido.',
          variant: 'destructive',
        });
        return null;
      }
      
      // Usar datos validados si están disponibles
      if (taskValidation.validatedTask) {
        taskData = { ...taskData, ...taskValidation.validatedTask };
      }
    }

    return handleAPICall(
      async () => {
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

        if (error) {
          // Check if it's the task limit error from trigger
          if (error.message.includes('No puedes tener más de 15 tareas activas') || 
              error.message.includes('TASK_LIMIT_EXCEEDED')) {
            const isSpanish = true;
            const userMessage = isSpanish 
              ? error.message.split(':')[1]?.trim() || 'Has alcanzado el límite de tareas activas.'
              : 'You have reached the active tasks limit. Complete some tasks first.';
            
            toast({
              title: isSpanish ? 'Límite alcanzado' : 'Limit reached',
              description: userMessage,
              variant: 'destructive',
            });
            return null;
          }
          
          throw error;
        }
        
        const typedTask = convertToAgentTask(data);
        
        setTasks(prev => [typedTask, ...prev]);
        setTotalCount(prev => prev + 1);
        
        const newActiveCount = activeTasks.length + 1;
        toast({
          title: 'Tarea creada',
          description: `Nueva tarea creada. Tienes ${newActiveCount}/${ACTIVE_TASKS_LIMIT} tareas activas.`,
        });
        
        return typedTask;
      },
      {
        component: 'TaskManager',
        action: 'create_task',
        userId: user.id,
        additionalData: { taskData }
      },
      {
        maxAttempts: 2,
        baseDelay: 1000
      }
    ).catch(enhancedError => {
      // El error ya fue manejado por EnhancedErrorHandler
      toast({
        title: 'Error',
        description: enhancedError.message || 'No se pudo crear la tarea',
        variant: 'destructive',
      });
      return null;
    });
  };

  const updateTask = async (taskId: string, updates: Partial<AgentTask>) => {
    return handleAPICall(
      async () => {
        const dbUpdates = convertForDatabase(updates);
        
        const { data, error } = await supabase
          .from('agent_tasks')
          .update(dbUpdates)
          .eq('id', taskId as any)
          .select()
          .single();

        if (error) throw error;
        
        const typedTask = convertToAgentTask(data);
        
        setTasks(prev => prev.map(task => task.id === taskId ? typedTask : task));
        return typedTask;
      },
      {
        component: 'TaskManager',
        action: 'update_task',
        userId: user?.id,
        additionalData: { taskId, updates }
      }
    ).catch(enhancedError => {
      toast({
        title: 'Error',
        description: enhancedError.message || 'No se pudo actualizar la tarea',
        variant: 'destructive',
      });
      return null;
    });
  };

  const deleteTask = async (taskId: string) => {
    return handleAPICall(
      async () => {
        const { error } = await supabase
          .from('agent_tasks')
          .delete()
          .eq('id', taskId as any);

        if (error) throw error;
        
        setTasks(prev => prev.filter(task => task.id !== taskId));
        setTotalCount(prev => prev - 1);
      },
      {
        component: 'TaskManager',
        action: 'delete_task',
        userId: user?.id,
        additionalData: { taskId }
      }
    ).catch(enhancedError => {
      toast({
        title: 'Error',
        description: enhancedError.message || 'No se pudo eliminar la tarea',
        variant: 'destructive',
      });
    });
  };

  const deleteAllTasks = async (agentId?: string) => {
    if (!user) return false;

    try {
      let query = supabase
        .from('agent_tasks')
        .delete()
        .eq('user_id', user.id);

      if (agentId) {
        query = query.eq('agent_id', agentId as any);
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

  const archiveTask = async (taskId: string) => {
    try {
      const { data, error } = await supabase
        .from('agent_tasks')
        .update({ is_archived: true } as any)
        .eq('id', taskId as any)
        .select()
        .single();

      if (error) throw error;
      
      const typedTask = convertToAgentTask(data);
      setTasks(prev => prev.map(task => task.id === taskId ? typedTask : task));
      
      toast({
        title: 'Tarea archivada',
        description: 'La tarea se ha archivado exitosamente.',
      });
      
      return typedTask;
    } catch (error) {
      console.error('Error archiving task:', error);
      toast({
        title: 'Error',
        description: 'No se pudo archivar la tarea',
        variant: 'destructive',
      });
      return null;
    }
  };

  const unarchiveTask = async (taskId: string) => {
    try {
      const { data, error } = await supabase
        .from('agent_tasks')
        .update({ is_archived: false } as any)
        .eq('id', taskId as any)
        .select()
        .single();

      if (error) throw error;
      
      const typedTask = convertToAgentTask(data);
      setTasks(prev => prev.map(task => task.id === taskId ? typedTask : task));
      
      toast({
        title: 'Tarea desarchivada',
        description: 'La tarea se ha desarchivado exitosamente.',
      });
      
      return typedTask;
    } catch (error) {
      console.error('Error unarchiving task:', error);
      toast({
        title: 'Error',
        description: 'No se pudo desarchivar la tarea',
        variant: 'destructive',
      });
      return null;
    }
  };

  return {
    createTask,
    updateTask,
    deleteTask,
    deleteAllTasks,
    archiveTask,
    unarchiveTask
  };
}
