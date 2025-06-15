
import React from 'react';
import { useAgentTasks, AgentTask } from '@/hooks/useAgentTasks';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, CheckCircle2, Loader, ListTodo } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface AgentTasksPanelProps {
  agentId: string;
  language: 'en' | 'es';
}

export const AgentTasksPanel: React.FC<AgentTasksPanelProps> = ({ agentId, language }) => {
  const { tasks, loading, createTask } = useAgentTasks(agentId);

  const t = {
    en: {
      tasks: "Agent Tasks",
      newTask: "New Task",
      noTasks: "No tasks for this agent yet.",
      createOne: "Create the first one!",
      pending: "Pending",
      in_progress: "In Progress",
      completed: "Completed",
      cancelled: "Cancelled",
    },
    es: {
      tasks: "Tareas del Agente",
      newTask: "Nueva Tarea",
      noTasks: "Aún no hay tareas para este agente.",
      createOne: "¡Crea la primera!",
      pending: "Pendiente",
      in_progress: "En Progreso",
      completed: "Completada",
      cancelled: "Cancelada",
    }
  };

  const getStatusLabel = (status: AgentTask['status']) => {
    return t[language][status] || status;
  }

  const handleCreateTask = () => {
    // This would typically open a form/modal to create a detailed task.
    createTask({
      agent_id: agentId,
      title: `Nueva tarea para agente`,
      description: 'Detalles de la tarea...'
    });
  }

  return (
    <div className="h-full flex flex-col bg-transparent">
        <Button 
          onClick={handleCreateTask}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white mb-3 flex-shrink-0"
          size="sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          {t[language].newTask}
        </Button>
      
      <div className="flex-1 min-h-0">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <Loader className="w-6 h-6 animate-spin text-purple-400" />
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-8 text-white/60 flex flex-col items-center justify-center h-full">
            <ListTodo className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">{t[language].noTasks}</p>
            <p className="text-xs opacity-75">{t[language].createOne}</p>
          </div>
        ) : (
          <ScrollArea className="h-full pr-3">
            <div className="space-y-2">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="p-3 rounded-lg bg-white/5 border border-white/10"
                >
                  <p className="text-white text-sm font-medium truncate">
                    {task.title}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                     <Badge 
                        variant={task.status === 'completed' ? 'default' : 'secondary'}
                        className={`text-xs ${task.status === 'completed' ? 'bg-green-500/20 text-green-300' : task.status === 'in_progress' ? 'bg-yellow-500/20 text-yellow-300' : 'bg-gray-500/20 text-gray-300'}`}
                      >
                       {getStatusLabel(task.status)}
                     </Badge>
                     {task.status === 'completed' && <CheckCircle2 className="w-4 h-4 text-green-400" />}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </div>
    </div>
  );
};
