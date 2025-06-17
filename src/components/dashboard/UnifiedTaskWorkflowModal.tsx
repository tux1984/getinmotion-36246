import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CheckCircle2, 
  Clock, 
  Plus, 
  Trash2, 
  Play, 
  Pause, 
  MessageSquare,
  Link as LinkIcon,
  FileText,
  Save,
  Timer,
  Target,
  Calendar,
  TrendingUp,
  X
} from 'lucide-react';
import { AgentTask, TaskSubtask, TaskResource } from '@/hooks/useAgentTasks';

interface UnifiedTaskWorkflowModalProps {
  task: AgentTask;
  language: 'en' | 'es';
  isOpen: boolean;
  onClose: () => void;
  onWorkWithAgent: (taskId: string, taskTitle: string) => void;
  onUpdateTask?: (updates: Partial<AgentTask>) => Promise<void>;
  onStartTask?: (task: AgentTask) => void;
  showWorkflowActions?: boolean;
}

export const UnifiedTaskWorkflowModal: React.FC<UnifiedTaskWorkflowModalProps> = ({
  task,
  language,
  isOpen,
  onClose,
  onWorkWithAgent,
  onUpdateTask,
  onStartTask,
  showWorkflowActions = true
}) => {
  const [subtasks, setSubtasks] = useState<TaskSubtask[]>(task.subtasks || []);
  const [notes, setNotes] = useState(task.notes || '');
  const [resources, setResources] = useState<TaskResource[]>(task.resources || []);
  const [newSubtask, setNewSubtask] = useState('');
  const [newResource, setNewResource] = useState({ title: '', url: '', type: 'link' as const });
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [currentSession, setCurrentSession] = useState(0);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const t = {
    en: {
      taskDetails: 'Task Details',
      workWithAgent: 'Work with Agent',
      startTask: 'Start Task',
      overview: 'Overview',
      subtasks: 'Subtasks',
      addSubtask: 'Add Subtask',
      notes: 'Notes',
      resources: 'Resources',
      addResource: 'Add Resource',
      timeTracking: 'Time Tracking',
      totalTime: 'Total Time',
      currentSession: 'Current Session',
      startTimer: 'Start Timer',
      stopTimer: 'Stop Timer',
      save: 'Save Changes',
      close: 'Close',
      minutes: 'minutes',
      resourceTitle: 'Resource Title',
      resourceUrl: 'URL (optional)',
      completed: 'Completed',
      pending: 'Pending',
      progress: 'Progress',
      status: 'Status',
      priority: 'Priority',
      dueDate: 'Due Date',
      description: 'Description',
      high: 'High',
      medium: 'Medium',
      low: 'Low',
      title: 'Title',
      in_progress: 'In Progress'
    },
    es: {
      taskDetails: 'Detalles de la Tarea',
      workWithAgent: 'Trabajar con Agente',
      startTask: 'Iniciar Tarea',
      overview: 'Resumen',
      subtasks: 'Subtareas',
      addSubtask: 'Añadir Subtarea',
      notes: 'Notas',
      resources: 'Recursos',
      addResource: 'Añadir Recurso',
      timeTracking: 'Seguimiento de Tiempo',
      totalTime: 'Tiempo Total',
      currentSession: 'Sesión Actual',
      startTimer: 'Iniciar Timer',
      stopTimer: 'Parar Timer',
      save: 'Guardar Cambios',
      close: 'Cerrar',
      minutes: 'minutos',
      resourceTitle: 'Título del Recurso',
      resourceUrl: 'URL (opcional)',
      completed: 'Completada',
      pending: 'Pendiente',
      progress: 'Progreso',
      status: 'Estado',
      priority: 'Prioridad',
      dueDate: 'Fecha Límite',
      description: 'Descripción',
      high: 'Alta',
      medium: 'Media',
      low: 'Baja',
      title: 'Título',
      in_progress: 'En Progreso'
    }
  };

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setCurrentSession(prev => prev + 1);
      }, 60000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const handleAddSubtask = () => {
    if (!newSubtask.trim()) return;
    
    const newSub: TaskSubtask = {
      id: Date.now().toString(),
      title: newSubtask,
      completed: false,
      created_at: new Date().toISOString()
    };
    
    const updatedSubtasks = [...subtasks, newSub];
    setSubtasks(updatedSubtasks);
    setNewSubtask('');
    setHasUnsavedChanges(true);
  };

  const handleToggleSubtask = (subtaskId: string) => {
    const updatedSubtasks = subtasks.map(st => 
      st.id === subtaskId ? { ...st, completed: !st.completed } : st
    );
    setSubtasks(updatedSubtasks);
    setHasUnsavedChanges(true);
  };

  const handleDeleteSubtask = (subtaskId: string) => {
    const updatedSubtasks = subtasks.filter(st => st.id !== subtaskId);
    setSubtasks(updatedSubtasks);
    setHasUnsavedChanges(true);
  };

  const handleAddResource = () => {
    if (!newResource.title.trim()) return;
    
    const resource: TaskResource = {
      id: Date.now().toString(),
      title: newResource.title,
      url: newResource.url || undefined,
      type: newResource.type
    };
    
    const updatedResources = [...resources, resource];
    setResources(updatedResources);
    setNewResource({ title: '', url: '', type: 'link' });
    setHasUnsavedChanges(true);
  };

  const handleDeleteResource = (resourceId: string) => {
    const updatedResources = resources.filter(r => r.id !== resourceId);
    setResources(updatedResources);
    setHasUnsavedChanges(true);
  };

  const handleSaveChanges = async () => {
    if (!onUpdateTask) return;
    
    await onUpdateTask({
      subtasks,
      notes,
      resources,
      time_spent: (task.time_spent || 0) + currentSession
    });
    setHasUnsavedChanges(false);
    setCurrentSession(0);
  };

  const toggleTimer = () => {
    setIsTimerRunning(!isTimerRunning);
  };

  const handleWorkWithAgent = () => {
    onWorkWithAgent(task.id, task.title);
    onClose();
  };

  const handleStartTask = () => {
    if (onStartTask) {
      onStartTask(task);
    }
    onClose();
  };

  const completedSubtasks = subtasks.filter(st => st.completed).length;
  const progress = subtasks.length > 0 ? Math.round((completedSubtasks / subtasks.length) * 100) : task.progress_percentage || 0;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: number) => {
    if (priority === 1) return 'bg-red-100 text-red-800';
    if (priority === 2) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  const getPriorityLabel = (priority: number) => {
    if (priority === 1) return t[language].high;
    if (priority === 2) return t[language].medium;
    return t[language].low;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
        {/* Header */}
        <CardHeader className="pb-4 border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-semibold">
              {t[language].taskDetails}
            </CardTitle>
            <div className="flex items-center gap-2">
              {showWorkflowActions && (
                <>
                  <Button onClick={handleWorkWithAgent} className="bg-purple-600 hover:bg-purple-700 text-white">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    {t[language].workWithAgent}
                  </Button>
                  {task.status === 'pending' && onStartTask && (
                    <Button onClick={handleStartTask} className="bg-green-600 hover:bg-green-700 text-white">
                      <Play className="w-4 h-4 mr-2" />
                      {t[language].startTask}
                    </Button>
                  )}
                </>
              )}
              <Button onClick={onClose} variant="ghost" size="sm">
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Statistics Cards */}
          <div className="grid grid-cols-4 gap-3">
            <div className="bg-gray-50 p-3 rounded-lg border">
              <div className="text-xs text-gray-600 mb-1">{t[language].progress}</div>
              <div className="text-lg font-semibold">{progress}%</div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg border">
              <div className="text-xs text-gray-600 mb-1">{t[language].status}</div>
              <Badge className={`text-xs ${getStatusColor(task.status)}`}>
                {t[language][task.status] || task.status}
              </Badge>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg border">
              <div className="text-xs text-gray-600 mb-1">{t[language].priority}</div>
              <Badge className={`text-xs ${getPriorityColor(task.priority)}`}>
                {getPriorityLabel(task.priority)}
              </Badge>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg border">
              <div className="text-xs text-gray-600 mb-1">{t[language].totalTime}</div>
              <div className="text-lg font-semibold">{(task.time_spent || 0) + currentSession}</div>
              <div className="text-xs text-gray-500">{t[language].minutes}</div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-gray-100">
              <TabsTrigger value="overview">{t[language].overview}</TabsTrigger>
              <TabsTrigger value="subtasks">{t[language].subtasks}</TabsTrigger>
              <TabsTrigger value="notes">{t[language].notes}</TabsTrigger>
              <TabsTrigger value="resources">{t[language].resources}</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-4 mt-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">{t[language].title}</label>
                  <Input value={task.title} readOnly className="bg-gray-50" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">{t[language].status}</label>
                  <Input value={t[language][task.status] || task.status} readOnly className="bg-gray-50" />
                </div>
                <div className="space-y-2 col-span-2">
                  <label className="text-sm font-medium text-gray-700">{t[language].description}</label>
                  <Textarea value={task.description || ''} readOnly className="bg-gray-50" rows={3} />
                </div>
                {task.due_date && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">{t[language].dueDate}</label>
                    <Input value={new Date(task.due_date).toLocaleDateString()} readOnly className="bg-gray-50" />
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Subtasks Tab */}
            <TabsContent value="subtasks" className="space-y-4 mt-6">
              <div className="flex gap-2">
                <Input
                  placeholder={t[language].addSubtask}
                  value={newSubtask}
                  onChange={(e) => setNewSubtask(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddSubtask()}
                />
                <Button onClick={handleAddSubtask} size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto">
                {subtasks.map((subtask) => (
                  <div key={subtask.id} className="flex items-center gap-3 p-3 border rounded-lg bg-white">
                    <button
                      onClick={() => handleToggleSubtask(subtask.id)}
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                        subtask.completed 
                          ? 'bg-green-500 border-green-500 text-white' 
                          : 'border-gray-300 hover:border-green-500'
                      }`}
                    >
                      {subtask.completed && <CheckCircle2 className="w-3 h-3" />}
                    </button>
                    <span className={`flex-1 ${subtask.completed ? 'line-through text-gray-500' : ''}`}>
                      {subtask.title}
                    </span>
                    <Button
                      onClick={() => handleDeleteSubtask(subtask.id)}
                      size="sm"
                      variant="ghost"
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                {subtasks.length === 0 && (
                  <div className="text-center text-gray-500 py-8">
                    No hay subtareas creadas
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Notes Tab */}
            <TabsContent value="notes" className="space-y-4 mt-6">
              <div className="space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  {t[language].notes}
                </h3>
                <Textarea
                  placeholder="Añade notas sobre tu progreso..."
                  value={notes}
                  onChange={(e) => {
                    setNotes(e.target.value);
                    setHasUnsavedChanges(true);
                  }}
                  rows={8}
                  className="min-h-32"
                />
              </div>
            </TabsContent>

            {/* Resources Tab */}
            <TabsContent value="resources" className="space-y-4 mt-6">
              <div className="space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <LinkIcon className="w-4 h-4" />
                  {t[language].resources}
                </h3>
                
                <div className="space-y-2">
                  <Input
                    placeholder={t[language].resourceTitle}
                    value={newResource.title}
                    onChange={(e) => setNewResource({...newResource, title: e.target.value})}
                  />
                  <div className="flex gap-2">
                    <Input
                      placeholder={t[language].resourceUrl}
                      value={newResource.url}
                      onChange={(e) => setNewResource({...newResource, url: e.target.value})}
                    />
                    <Button onClick={handleAddResource} size="sm">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {resources.map((resource) => (
                    <div key={resource.id} className="flex items-center gap-3 p-3 border rounded-lg bg-white">
                      <LinkIcon className="w-4 h-4 text-blue-500 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{resource.title}</p>
                        {resource.url && (
                          <a 
                            href={resource.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline text-sm truncate block"
                          >
                            {resource.url}
                          </a>
                        )}
                      </div>
                      <Button
                        onClick={() => handleDeleteResource(resource.id)}
                        size="sm"
                        variant="ghost"
                        className="text-red-500 hover:text-red-700 flex-shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  {resources.length === 0 && (
                    <div className="text-center text-gray-500 py-8">
                      No hay recursos agregados
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Save Button */}
          {hasUnsavedChanges && onUpdateTask && (
            <div className="flex justify-end pt-4 border-t">
              <Button onClick={handleSaveChanges} className="flex items-center gap-2">
                <Save className="w-4 h-4" />
                {t[language].save}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
