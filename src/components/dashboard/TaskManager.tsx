
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Check, Plus, ArrowRight, X } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '@/context/LanguageContext';

interface Task {
  id: number;
  title: string;
  completed: boolean;
}

export const TaskManager = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
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
      cancel: "Cancel",
      save: "Save",
      enterTaskTitle: "Enter task title",
      taskDescription: "Task description (optional)",
      taskAdded: "Task Added",
      taskAddedDesc: "Your new task has been created"
    },
    es: {
      yourTasks: "Tus Tareas",
      addTask: "Añadir Tarea",
      viewAllTasks: "Ver Todas las Tareas",
      taskComplete: "Tarea Completada",
      cancel: "Cancelar",
      save: "Guardar",
      enterTaskTitle: "Ingresa el título de la tarea",
      taskDescription: "Descripción de la tarea (opcional)",
      taskAdded: "Tarea Añadida",
      taskAddedDesc: "Tu nueva tarea ha sido creada"
    }
  };
  
  const t = translations[language];

  const handleAddTask = () => {
    if (!taskTitle.trim()) return;
    
    const newTask = {
      id: Date.now(),
      title: taskTitle,
      completed: false
    };
    
    setTasks(prev => [...prev, newTask]);
    setTaskTitle('');
    setTaskDescription('');
    setShowTaskForm(false);
    
    toast({
      title: t.taskAdded,
      description: t.taskAddedDesc,
    });
  };

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

  return (
    <Card>
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-lg">{t.yourTasks}</CardTitle>
        <Button variant="ghost" size="sm" onClick={() => setShowTaskForm(true)}>
          <Plus className="w-4 h-4 mr-1" />
          {t.addTask}
        </Button>
      </CardHeader>
      <CardContent>
        {showTaskForm ? (
          <div className="space-y-4">
            <Input
              placeholder={t.enterTaskTitle}
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
            />
            <Textarea
              placeholder={t.taskDescription}
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowTaskForm(false)}
              >
                {t.cancel}
              </Button>
              <Button 
                size="sm"
                onClick={handleAddTask}
              >
                {t.save}
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="space-y-2">
              {tasks.slice(0, 4).map(task => (
                <div 
                  key={task.id} 
                  className="flex items-center p-2 hover:bg-slate-50 rounded cursor-pointer group"
                  onClick={() => handleToggleTask(task.id)}
                >
                  <div className={`w-5 h-5 border rounded mr-3 flex items-center justify-center ${task.completed ? 'bg-green-100 border-green-300' : 'border-slate-300'}`}>
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
          </>
        )}
      </CardContent>
    </Card>
  );
};
