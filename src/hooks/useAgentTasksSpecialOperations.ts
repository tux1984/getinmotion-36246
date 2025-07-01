
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { AgentTask, TaskSubtask, TaskResource } from './types/agentTaskTypes';
import { convertToAgentTask } from './utils/agentTaskUtils';

export function useAgentTasksSpecialOperations(
  user: any,
  tasks: AgentTask[],
  setTasks: React.Dispatch<React.SetStateAction<AgentTask[]>>,
  updateTask: (taskId: string, updates: Partial<AgentTask>) => Promise<AgentTask | null>
) {
  const { toast } = useToast();

  const startTaskDevelopment = async (taskId: string) => {
    if (!user) return null;

    try {
      // Get the task to find its agent_id
      const task = tasks.find(t => t.id === taskId);
      if (!task) return null;

      // First pause any other task in_progress from the same agent
      const otherActiveTasks = tasks.filter(t => 
        t.agent_id === task.agent_id && 
        t.status === 'in_progress' && 
        t.id !== taskId
      );

      console.log('Pausing other active tasks for agent:', task.agent_id, otherActiveTasks);

      // Pause other tasks active from the same agent
      for (const otherTask of otherActiveTasks) {
        await supabase
          .from('agent_tasks')
          .update({ status: 'pending' })
          .eq('id', otherTask.id);
      }

      // Activate the selected task
      const { data, error } = await supabase
        .from('agent_tasks')
        .update({ 
          status: 'in_progress',
          progress_percentage: Math.max(10, task.progress_percentage || 0)
        })
        .eq('id', taskId)
        .select()
        .single();

      if (error) throw error;

      const updatedTask = convertToAgentTask(data);
      
      // Update local state
      setTasks(prev => prev.map(t => {
        if (t.agent_id === task.agent_id && t.status === 'in_progress' && t.id !== taskId) {
          return { ...t, status: 'pending' };
        }
        if (t.id === taskId) {
          return updatedTask;
        }
        return t;
      }));

      return updatedTask;
    } catch (error) {
      console.error('Error starting task development:', error);
      toast({
        title: 'Error',
        description: 'No se pudo iniciar el desarrollo de la tarea',
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

  return {
    startTaskDevelopment,
    updateSubtasks,
    updateNotes,
    updateResources,
    updateTimeSpent
  };
}
