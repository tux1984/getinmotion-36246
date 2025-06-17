
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Target } from 'lucide-react';
import { AgentTask } from '@/hooks/useAgentTasks';

interface CreateTaskModalProps {
  agentId: string;
  language: 'en' | 'es';
  isOpen: boolean;
  onClose: () => void;
  onCreateTask: (taskData: Partial<AgentTask>) => Promise<void>;
}

export const CreateTaskModal: React.FC<CreateTaskModalProps> = ({
  agentId,
  language,
  isOpen,
  onClose,
  onCreateTask
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    relevance: 'medium' as 'low' | 'medium' | 'high',
    priority: 3,
    due_date: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const t = {
    en: {
      createTask: 'Create New Task',
      title: 'Title',
      titlePlaceholder: 'Enter task title...',
      description: 'Description',
      descriptionPlaceholder: 'Describe what needs to be done...',
      relevance: 'Relevance',
      priority: 'Priority',
      dueDate: 'Due Date',
      create: 'Create Task',
      cancel: 'Cancel',
      high: 'High',
      medium: 'Medium',
      low: 'Low',
      titleRequired: 'Title is required'
    },
    es: {
      createTask: 'Crear Nueva Tarea',
      title: 'Título',
      titlePlaceholder: 'Ingresa el título de la tarea...',
      description: 'Descripción',
      descriptionPlaceholder: 'Describe qué necesita ser hecho...',
      relevance: 'Relevancia',
      priority: 'Prioridad',
      dueDate: 'Fecha Límite',
      create: 'Crear Tarea',
      cancel: 'Cancelar',
      high: 'Alta',
      medium: 'Media',
      low: 'Baja',
      titleRequired: 'El título es requerido'
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onCreateTask({
        agent_id: agentId,
        title: formData.title.trim(),
        description: formData.description.trim() || null,
        relevance: formData.relevance,
        priority: formData.priority,
        due_date: formData.due_date ? new Date(formData.due_date).toISOString() : null
      });
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        relevance: 'medium',
        priority: 3,
        due_date: ''
      });
      
      onClose();
    } catch (error) {
      console.error('Error creating task:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            {t[language].createTask}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">{t[language].title} *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder={t[language].titlePlaceholder}
              className="mt-1"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">{t[language].description}</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder={t[language].descriptionPlaceholder}
              className="mt-1"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>{t[language].relevance}</Label>
              <Select 
                value={formData.relevance} 
                onValueChange={(value: 'low' | 'medium' | 'high') => 
                  setFormData(prev => ({ ...prev, relevance: value }))
                }
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">{t[language].high}</SelectItem>
                  <SelectItem value="medium">{t[language].medium}</SelectItem>
                  <SelectItem value="low">{t[language].low}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>{t[language].priority}</Label>
              <Select 
                value={formData.priority.toString()} 
                onValueChange={(value) => 
                  setFormData(prev => ({ ...prev, priority: parseInt(value) }))
                }
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">{t[language].high} (1)</SelectItem>
                  <SelectItem value="2">{t[language].medium} (2)</SelectItem>
                  <SelectItem value="3">{t[language].low} (3)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="due_date">{t[language].dueDate}</Label>
            <Input
              id="due_date"
              type="date"
              value={formData.due_date}
              onChange={(e) => setFormData(prev => ({ ...prev, due_date: e.target.value }))}
              className="mt-1"
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={isSubmitting || !formData.title.trim()} className="flex-1">
              <Plus className="w-4 h-4 mr-2" />
              {isSubmitting ? 'Creando...' : t[language].create}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              {t[language].cancel}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
