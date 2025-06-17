
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Plus, ArrowRight } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '@/context/LanguageContext';
import { UnifiedTaskWorkflowModal } from './UnifiedTaskWorkflowModal';
import { AgentTask } from '@/hooks/useAgentTasks';

interface Task {
  id: number;
  title: string;
  completed: boolean;
}

// Mock function to convert legacy task to AgentTask format
const convertToAgentTask = (task: Task): AgentTask => ({
  id: task.id.toString(),
  user_id: 'mock-user',
  agent_id: 'task-manager',
  conversation_id: null, // Add missing conversation_id field
  title: task.title,
  description: null,
  status: task.completed ? 'completed' : 'pending',
  relevance: 'medium',
  priority: 3,
  progress_percentage: task.completed ? 100 : 0,
  due_date: null,
  completed_at: task.completed ? new Date().toISOString() : null,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  subtasks: [],
  steps_completed: {},
  resources: [],
  time_spent: 0,
  notes: ''
});

export const TaskManager = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [selectedTask, setSelectedTask] = useState<AgentTask | null>(null);
  const [tasks, setTasks] = useState<Array<Task>>([
    { id: 1, title: language === 'en' ? 'Upload new content to social media' : 'Subir nuevo contenido a redes sociales', completed: false },
    { id: 2, title: language === 'en' ? 'Respond to email inquiries' : 'Responder consultas por email', completed: true },
  ]);

  const translations = {
    en: {
      yourTasks: "Your Tasks",
      addTask: "Add Task",
      viewAllTasks: "View All Tasks",
      taskComplete: "Task Complete",
      workWithAgent: "Work with Agent"
    },
    es: {
      yourTasks: "Tus Tareas",
      addTask: "Añadir Tarea",
      viewAllTasks: "Ver Todas las Tareas",
      taskComplete: "Tarea Completada",
      workWithAgent: "Trabajar con Agente"
    }
  };
  
  const t = translations[language];

  const handleToggleTask = (id: number) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
    
    const task = tasks.find(t => t.id === id);
    if (task && !task.completed) {
      toast({
        title: t.taskComplete,
        description: task.title,
      });
    }
  };

  const handleTaskClick = (task: Task) => {
    const agentTask = convertToAgentTask(task);
    setSelectedTask(agentTask);
  };

  const handleWorkWithAgent = (taskId: string, taskTitle: string) => {
    // In a real implementation, this would integrate with the agent chat system
    console.log('Working with agent on task:', taskId, taskTitle);
    toast({
      title: t.workWithAgent,
      description: `Iniciando trabajo en: ${taskTitle}`,
    });
  };

  return (
    <>
      <Card>
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-lg">{t.yourTasks}</CardTitle>
          <Button variant="ghost" size="sm">
            <Plus className="w-4 h-4 mr-1" />
            {t.addTask}
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {tasks.slice(0, 4).map(task => (
              <div 
                key={task.id} 
                className="flex items-center p-2 hover:bg-slate-50 rounded cursor-pointer group"
                onClick={() => handleTaskClick(task)}
              >
                <div 
                  className={`w-5 h-5 border rounded mr-3 flex items-center justify-center ${task.completed ? 'bg-green-100 border-green-300' : 'border-slate-300'}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleTask(task.id);
                  }}
                >
                  {task.completed && <Check className="w-3 h-3 text-green-500" />}
                </div>
                <span className={task.completed ? 'text-slate-400 line-through' : ''}>{task.title}</span>
              </div>
            ))}
          </div>
          
          {tasks.length > 4 && (
            <div className="mt-4">
              <Button variant="ghost" size="sm" className="w-full">
                {t.viewAllTasks}
                <ArrowRight className="w-3 h-3 ml-2" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Unified Task Modal */}
      {selectedTask && (
        <UnifiedTaskWorkflowModal
          task={selectedTask}
          language={language}
          isOpen={!!selectedTask}
          onClose={() => setSelectedTask(null)}
          onWorkWithAgent={handleWorkWithAgent}
          showWorkflowActions={false}
        />
      )}
    </>
  );
};
