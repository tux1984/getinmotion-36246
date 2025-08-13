
import React, { useState } from 'react';
import { useAgentTasks, AgentTask } from '@/hooks/useAgentTasks';
import { useUserBusinessProfile } from '@/hooks/useUserBusinessProfile';
import { formatTaskTitleForDisplay } from '@/hooks/utils/agentTaskUtils';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Target, Plus, Loader2 } from 'lucide-react';
import { DetailedTaskCard } from './DetailedTaskCard';

interface AgentTasksManagerProps {
  agentId: string;
  language: 'en' | 'es';
  onChatWithAgent?: (taskId: string, taskTitle: string) => void;
}

export const AgentTasksManager: React.FC<AgentTasksManagerProps> = ({
  agentId,
  language,
  onChatWithAgent
}) => {
  const { 
    tasks, 
    loading, 
    updateTask, 
    deleteTask, 
    startTaskDevelopment,
    archiveTask,
    unarchiveTask
  } = useAgentTasks(agentId);
  const { businessProfile } = useUserBusinessProfile();
  const [updatingTasks, setUpdatingTasks] = useState<Set<string>>(new Set());

  const t = {
    en: {
      tasks: "Tasks",
      noTasks: "No tasks yet",
      createFirst: "Tasks will appear here when created by the agent",
      chatWithAgent: "Chat with Agent",
    },
    es: {
      tasks: "Tareas",
      noTasks: "No hay tareas aún",
      createFirst: "Las tareas aparecerán aquí cuando las cree el agente",
      chatWithAgent: "Chatear con Agente",
    }
  };

  const handleStartDevelopment = async (task: AgentTask) => {
    setUpdatingTasks(prev => new Set(prev).add(task.id));
    
    try {
      const updatedTask = await startTaskDevelopment(task.id);
      
      if (updatedTask && onChatWithAgent) {
        // Open chat immediately after starting development
        onChatWithAgent(task.id, task.title);
      }
    } catch (error) {
      console.error('Error starting task development:', error);
    } finally {
      setUpdatingTasks(prev => {
        const newSet = new Set(prev);
        newSet.delete(task.id);
        return newSet;
      });
    }
  };

  const handleCompleteTask = async (task: AgentTask) => {
    setUpdatingTasks(prev => new Set(prev).add(task.id));
    
    await updateTask(task.id, { 
      status: 'completed',
      progress_percentage: 100,
      completed_at: new Date().toISOString()
    });
    
    setUpdatingTasks(prev => {
      const newSet = new Set(prev);
      newSet.delete(task.id);
      return newSet;
    });
  };

  const handleDelete = async (taskId: string) => {
    setUpdatingTasks(prev => new Set(prev).add(taskId));
    await deleteTask(taskId);
    // No need to remove from setUpdatingTasks as the component will disappear
  };

  const handleChatWithAgent = (task: AgentTask) => {
    if (onChatWithAgent) {
      onChatWithAgent(task.id, task.title);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Target className="w-5 h-5 text-purple-600" />
          {t[language].tasks}
        </h3>
        <Badge variant="secondary" className="text-xs">
          {tasks.length} {tasks.length === 1 ? 'tarea' : 'tareas'}
        </Badge>
      </div>

      {tasks.length === 0 ? (
        <Card className="border-dashed border-2 border-slate-200">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Target className="w-12 h-12 text-slate-400 mb-4" />
            <p className="text-slate-600 font-medium mb-2">{t[language].noTasks}</p>
            <p className="text-sm text-slate-500 text-center">
              {t[language].createFirst}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {tasks.map((task) => (
            <DetailedTaskCard
              key={task.id}
              task={task}
              language={language}
              onStartDevelopment={handleStartDevelopment}
              onCompleteTask={handleCompleteTask}
              onChatWithAgent={handleChatWithAgent}
              onDelete={handleDelete}
              onArchive={archiveTask}
              onUnarchive={unarchiveTask}
              isUpdating={updatingTasks.has(task.id)}
              allTasks={tasks}
            />
          ))}
        </div>
      )}
    </div>
  );
};
