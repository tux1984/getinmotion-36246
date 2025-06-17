
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
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
  Target
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
  const [activeTab, setActiveTab] = useState<'overview' | 'subtasks' | 'notes' | 'resources'>('overview');

  const t = {
    en: {
      taskDetails: 'Task Details',
      workWithAgent: 'Work with Agent',
      startTask: 'Start Task',
      overview: 'Overview',
      subtasks: 'Subtasks',
      notes: 'Notes',
      resources: 'Resources',
      title: 'Title',
      description: 'Description',
      status: 'Status',
      priority: 'Priority',
      dueDate: 'Due Date',
      progress: 'Progress',
      save: 'Save Changes',
      cancel: 'Cancel',
      edit: 'Edit',
      addSubtask: 'Add Subtask',
      addNote: 'Add Note',
      addResource: 'Add Resource',
      pending: 'Pending',
      in_progress: 'In Progress',
      completed: 'Completed',
      high: 'High',
      medium: 'Medium',
      low: 'Low',
      timeSpent: 'Time Spent',
      minutes: 'minutes',
      timeTracking: 'Time Tracking',
      totalTime: 'Total Time',
      currentSession: 'Current Session',
      startTimer: 'Start Timer',
      stopTimer: 'Stop Timer',
      close: 'Close',
      resourceTitle: 'Resource Title',
      resourceUrl: 'URL (optional)'
    },
    es: {
      taskDetails: 'Detalles de la Tarea',
      workWithAgent: 'Trabajar con Agente',
      startTask: 'Iniciar Tarea',
      overview: 'Resumen',
      subtasks: 'Subtareas',
      notes: 'Notas',
      resources: 'Recursos',
      title: 'Título',
      description: 'Descripción',
      status: 'Estado',
      priority: 'Prioridad',
      dueDate: 'Fecha Límite',
      progress: 'Progreso',
      save: 'Guardar Cambios',
      cancel: 'Cancelar',
      edit: 'Editar',
      addSubtask: 'Agregar Subtarea',
      addNote: 'Agregar Nota',
      addResource: 'Agregar Recurso',
      pending: 'Pendiente',
      in_progress: 'En Progreso',
      completed: 'Completada',
      high: 'Alta',
      medium: 'Media',
      low: 'Baja',
      timeSpent: 'Tiempo Dedicado',
      minutes: 'minutos',
      timeTracking: 'Seguimiento de Tiempo',
      totalTime: 'Tiempo Total',
      currentSession: 'Sesión Actual',
      startTimer: 'Iniciar Timer',
      stopTimer: 'Parar Timer',
      close: 'Cerrar',
      resourceTitle: 'Título del Recurso',
      resourceUrl: 'URL (opcional)'
    }
  };

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setCurrentSession(prev => prev + 1);
      }, 60000); // Every minute
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
      time_spent: task.time_spent + currentSession
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

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityBadgeColor = (priority: number) => {
    if (priority === 1) return 'bg-red-100 text-red-800';
    if (priority === 2) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="flex items-center gap-3">
                <Target className="w-5 h-5" />
                {task.title}
              </CardTitle>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline" className={`${
                  task.relevance === 'high' ? 'border-red-300 text-red-600' :
                  task.relevance === 'medium' ? 'border-yellow-300 text-yellow-600' :
                  'border-green-300 text-green-600'
                }`}>
                  {task.relevance}
                </Badge>
                <Badge variant="secondary">
                  {progress}% {t[language].completed}
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {showWorkflowActions && (
                <>
                  <Button onClick={handleWorkWithAgent} variant="outline" size="sm">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    {t[language].workWithAgent}
                  </Button>
                  {task.status === 'pending' && onStartTask && (
                    <Button onClick={handleStartTask} size="sm" className="bg-green-600 hover:bg-green-700">
                      <Play className="w-4 h-4 mr-2" />
                      {t[language].startTask}
                    </Button>
                  )}
                </>
              )}
              <Button onClick={onClose} variant="ghost" size="sm">
                {t[language].close}
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Description */}
          {task.description && (
            <div>
              <p className="text-gray-600 text-sm">{task.description}</p>
            </div>
          )}

          {/* Quick Stats */}
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{progress}%</div>
              <div className="text-sm text-gray-600">{t[language].progress}</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <Badge className={getStatusBadgeColor(task.status)}>
                {t[language][task.status] || task.status}
              </Badge>
              <div className="text-sm text-gray-600 mt-1">{t[language].status}</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <Badge className={getPriorityBadgeColor(task.priority)}>
                {task.priority === 1 ? t[language].high : task.priority === 2 ? t[language].medium : t[language].low}
              </Badge>
              <div className="text-sm text-gray-600 mt-1">{t[language].priority}</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{(task.time_spent || 0) + currentSession}</div>
              <div className="text-sm text-gray-600">{t[language].minutes}</div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{t[language].progress}</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <Separator />

          {/* Time Tracking */}
          <div className="space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <Timer className="w-4 h-4" />
              {t[language].timeTracking}
            </h3>
            <div className="flex items-center gap-4">
              <div className="text-sm">
                <span className="text-gray-600">{t[language].totalTime}:</span>
                <span className="ml-2 font-medium">{(task.time_spent || 0) + currentSession} {t[language].minutes}</span>
              </div>
              <div className="text-sm">
                <span className="text-gray-600">{t[language].currentSession}:</span>
                <span className="ml-2 font-medium">{currentSession} {t[language].minutes}</span>
              </div>
              <Button
                onClick={toggleTimer}
                size="sm"
                variant={isTimerRunning ? "destructive" : "default"}
              >
                {isTimerRunning ? (
                  <>
                    <Pause className="w-4 h-4 mr-2" />
                    {t[language].stopTimer}
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    {t[language].startTimer}
                  </>
                )}
              </Button>
            </div>
          </div>

          <Separator />

          {/* Tabs */}
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            {['overview', 'subtasks', 'notes', 'resources'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
                  activeTab === tab
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {t[language][tab]}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="space-y-4">
            {activeTab === 'overview' && (
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">
                    {task.description || 'Sin descripción adicional disponible.'}
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'subtasks' && (
              <div className="space-y-3">
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

                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {subtasks.map((subtask) => (
                    <div key={subtask.id} className="flex items-center gap-3 p-2 border rounded-lg">
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
                </div>
              </div>
            )}

            {activeTab === 'notes' && (
              <div className="space-y-3">
                <Textarea
                  placeholder="Añade notas sobre tu progreso..."
                  value={notes}
                  onChange={(e) => {
                    setNotes(e.target.value);
                    setHasUnsavedChanges(true);
                  }}
                  rows={6}
                />
              </div>
            )}

            {activeTab === 'resources' && (
              <div className="space-y-3">
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

                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {resources.map((resource) => (
                    <div key={resource.id} className="flex items-center gap-3 p-2 border rounded-lg">
                      <LinkIcon className="w-4 h-4 text-blue-500" />
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
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Save Button */}
          {hasUnsavedChanges && onUpdateTask && (
            <div className="flex justify-end pt-4">
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
