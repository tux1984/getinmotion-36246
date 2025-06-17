
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
  TrendingUp
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
      low: 'Low'
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
      low: 'Baja'
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
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'in_progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: number) => {
    if (priority === 1) return 'bg-red-100 text-red-800 border-red-200';
    if (priority === 2) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-green-100 text-green-800 border-green-200';
  };

  const getPriorityLabel = (priority: number) => {
    if (priority === 1) return t[language].high;
    if (priority === 2) return t[language].medium;
    return t[language].low;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header with Task Title and Action Buttons */}
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="flex items-center gap-3 text-xl">
                <Target className="w-6 h-6 text-purple-600" />
                {task.title}
              </CardTitle>
              {task.description && (
                <p className="text-gray-600 text-sm mt-2">{task.description}</p>
              )}
            </div>
            <div className="flex items-center gap-2 ml-4">
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
                {t[language].close}
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Statistics Header */}
          <div className="grid grid-cols-4 gap-4">
            {/* Progress */}
            <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium text-purple-700">{t[language].progress}</span>
              </div>
              <div className="text-2xl font-bold text-purple-900">{progress}%</div>
              <div className="w-full bg-purple-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Status */}
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-700">{t[language].status}</span>
              </div>
              <Badge className={`${getStatusColor(task.status)} font-medium`}>
                {t[language][task.status] || task.status}
              </Badge>
            </div>

            {/* Priority */}
            <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 rounded-lg border border-orange-200">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-orange-600" />
                <span className="text-sm font-medium text-orange-700">{t[language].priority}</span>
              </div>
              <Badge className={`${getPriorityColor(task.priority)} font-medium`}>
                {getPriorityLabel(task.priority)}
              </Badge>
            </div>

            {/* Time */}
            <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <Timer className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-700">{t[language].totalTime}</span>
              </div>
              <div className="text-2xl font-bold text-green-900">
                {(task.time_spent || 0) + currentSession}
              </div>
              <div className="text-xs text-green-600">{t[language].minutes}</div>
            </div>
          </div>

          {/* Tabs Navigation */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-gray-100 p-1 rounded-lg">
              <TabsTrigger 
                value="overview" 
                className="data-[state=active]:bg-white data-[state=active]:shadow-sm font-medium"
              >
                {t[language].overview}
              </TabsTrigger>
              <TabsTrigger 
                value="subtasks" 
                className="data-[state=active]:bg-white data-[state=active]:shadow-sm font-medium"
              >
                {t[language].subtasks} ({completedSubtasks}/{subtasks.length})
              </TabsTrigger>
              <TabsTrigger 
                value="notes" 
                className="data-[state=active]:bg-white data-[state=active]:shadow-sm font-medium"
              >
                {t[language].notes}
              </TabsTrigger>
              <TabsTrigger 
                value="resources" 
                className="data-[state=active]:bg-white data-[state=active]:shadow-sm font-medium"
              >
                {t[language].resources}
              </TabsTrigger>
            </TabsList>

            {/* Tab Contents */}
            <TabsContent value="overview" className="space-y-4 mt-6">
              {/* Time Tracking */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold flex items-center gap-2 mb-3">
                  <Timer className="w-4 h-4" />
                  {t[language].timeTracking}
                </h3>
                <div className="flex items-center gap-4">
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

              {/* Due Date */}
              {task.due_date && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>{t[language].dueDate}: {new Date(task.due_date).toLocaleDateString()}</span>
                </div>
              )}
            </TabsContent>

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
