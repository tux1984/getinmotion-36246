import React, { useState, useEffect } from 'react';
import { useAgentTasks, AgentTask, PaginatedTasks } from '@/hooks/useAgentTasks';
import { useOptimizedRecommendedTasks, OptimizedRecommendedTask } from '@/hooks/useOptimizedRecommendedTasks';
import { useTaskLimits } from '@/hooks/useTaskLimits';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { TaskLimitIndicator } from './TaskLimitIndicator';
import { TaskPagination } from '@/components/ui/task-pagination';
import { ClearAllTasksDialog } from './ClearAllTasksDialog';
import { DetailedTaskCard } from './DetailedTaskCard';
import { 
  ListTodo, 
  Plus, 
  Lightbulb, 
  CheckCircle2, 
  Clock, 
  Trash2,
  Filter,
  Star,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import { CategoryScore } from '@/types/dashboard';

interface TaskManagementInterfaceProps {
  maturityScores: CategoryScore | null;
  profileData: any | null;
  enabledAgents: string[];
  language: 'en' | 'es';
  onSelectAgent: (agentId: string) => void;
}

const TASKS_PER_PAGE = 10;

export const TaskManagementInterface: React.FC<TaskManagementInterfaceProps> = ({
  maturityScores,
  profileData,
  enabledAgents,
  language,
  onSelectAgent
}) => {
  const { tasks: allTasks, totalCount, loading: realTasksLoading, createTask, updateTask, deleteTask, deleteAllTasks, fetchPaginatedTasks } = useAgentTasks();
  const { tasks: suggestedTasks, loading: suggestedLoading } = useOptimizedRecommendedTasks(
    maturityScores, 
    profileData, 
    enabledAgents
  );
  
  const [filter, setFilter] = useState<'all' | 'pending' | 'in_progress' | 'completed'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [paginatedData, setPaginatedData] = useState<PaginatedTasks>({
    tasks: [],
    totalCount: 0,
    totalPages: 0,
    currentPage: 1
  });
  const [updatingTasks, setUpdatingTasks] = useState<Set<string>>(new Set());
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [paginationLoading, setPaginationLoading] = useState(false);

  const { isAtLimit, isNearLimit, activeTasksCount, limit } = useTaskLimits(allTasks);

  const t = {
    en: {
      taskManagement: 'Task Management',
      realTasks: 'My Tasks',
      suggestions: 'Suggestions',
      createTask: 'Create Task',
      convertToTask: 'Create Task',
      markComplete: 'Complete',
      deleteTask: 'Delete',
      clearAllTasks: 'Clear All Tasks',
      noTasks: 'No tasks yet',
      noSuggestions: 'No suggestions available',
      filterAll: 'All',
      filterPending: 'Pending',
      filterInProgress: 'In Progress',
      filterCompleted: 'Completed',
      chatWithAgent: 'Chat with Agent',
      limitReached: 'Task limit reached. Complete pending tasks to create new ones.',
      limitWarning: 'You have {count}/{limit} active tasks. Complete some to create new ones.',
      startFresh: 'Ready for a fresh start? You can now perform the maturity assessment to get new personalized recommendations.'
    },
    es: {
      taskManagement: 'Gestión de Tareas',
      realTasks: 'Mis Tareas',
      suggestions: 'Sugerencias',
      createTask: 'Crear Tarea',
      convertToTask: 'Crear Tarea',
      markComplete: 'Completar',
      deleteTask: 'Eliminar',
      clearAllTasks: 'Limpiar Todas las Tareas',
      noTasks: 'No hay tareas aún',
      noSuggestions: 'No hay sugerencias disponibles',
      filterAll: 'Todas',
      filterPending: 'Pendientes',
      filterInProgress: 'En Progreso',
      filterCompleted: 'Completadas',
      chatWithAgent: 'Chatear con Agente',
      limitReached: 'Límite de tareas alcanzado. Completa tareas pendientes para crear nuevas.',
      limitWarning: 'Tienes {count}/{limit} tareas activas. Completa algunas para crear nuevas.',
      startFresh: '¿Listo para empezar de nuevo? Ahora puedes realizar la evaluación de madurez para obtener nuevas recomendaciones personalizadas.'
    }
  };

  // Load paginated tasks when filter or page changes
  useEffect(() => {
    const loadPaginatedTasks = async () => {
      setPaginationLoading(true);
      const data = await fetchPaginatedTasks(currentPage, TASKS_PER_PAGE, filter);
      setPaginatedData(data);
      setPaginationLoading(false);
    };

    loadPaginatedTasks();
  }, [currentPage, filter, fetchPaginatedTasks]);

  // Reset to first page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  const handleConvertSuggestedTask = async (suggestedTask: OptimizedRecommendedTask) => {
    if (isAtLimit) {
      return; // createTask will show the toast
    }
    
    await createTask({
      agent_id: suggestedTask.agentId,
      title: suggestedTask.title,
      description: suggestedTask.description,
      relevance: suggestedTask.priority as 'low' | 'medium' | 'high',
      priority: suggestedTask.priority === 'high' ? 1 : suggestedTask.priority === 'medium' ? 2 : 3
    });

    // Refresh current page after creating task
    const data = await fetchPaginatedTasks(currentPage, TASKS_PER_PAGE, filter);
    setPaginatedData(data);
  };

  const handleTaskStatusChange = async (taskId: string, newStatus: AgentTask['status']) => {
    setUpdatingTasks(prev => new Set(prev).add(taskId));
    
    const updates: Partial<AgentTask> = { status: newStatus };
    if (newStatus === 'completed') {
      updates.completed_at = new Date().toISOString();
      updates.progress_percentage = 100;
    }
    
    await updateTask(taskId, updates);
    
    // Refresh current page after updating
    const data = await fetchPaginatedTasks(currentPage, TASKS_PER_PAGE, filter);
    setPaginatedData(data);
    
    setUpdatingTasks(prev => {
      const newSet = new Set(prev);
      newSet.delete(taskId);
      return newSet;
    });
  };

  const handleDeleteTask = async (taskId: string) => {
    setUpdatingTasks(prev => new Set(prev).add(taskId));
    await deleteTask(taskId);
    
    // Refresh current page after deletion
    const data = await fetchPaginatedTasks(currentPage, TASKS_PER_PAGE, filter);
    setPaginatedData(data);
    
    setUpdatingTasks(prev => {
      const newSet = new Set(prev);
      newSet.delete(taskId);
      return newSet;
    });
  };

  const handleClearAllTasks = async () => {
    const success = await deleteAllTasks();
    if (success) {
      setCurrentPage(1);
      setPaginatedData({
        tasks: [],
        totalCount: 0,
        totalPages: 0,
        currentPage: 1
      });
    }
  };

  const getStatusBadge = (status: AgentTask['status']) => {
    const statusConfig = {
      pending: { variant: 'secondary' as const, color: 'text-yellow-600' },
      in_progress: { variant: 'default' as const, color: 'text-blue-600' },
      completed: { variant: 'default' as const, color: 'text-green-600' },
      cancelled: { variant: 'outline' as const, color: 'text-gray-600' }
    };
    return statusConfig[status] || statusConfig.pending;
  };

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <ListTodo className="w-5 h-5" />
              {t[language].taskManagement}
            </CardTitle>
            
            {totalCount > 0 && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowClearDialog(true)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                {t[language].clearAllTasks}
              </Button>
            )}
          </div>
          
          {/* Only show Task Limit Indicator if user has active tasks */}
          {activeTasksCount > 0 && (
            <TaskLimitIndicator 
              tasks={allTasks} 
              language={language}
            />
          )}

          {/* Show fresh start message when no tasks */}
          {totalCount === 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-green-700">
                <CheckCircle2 className="w-5 h-5" />
                <div>
                  <p className="font-medium">
                    {language === 'en' ? 'Ready for a Fresh Start!' : '¡Listo para Empezar de Nuevo!'}
                  </p>
                  <p className="text-sm text-green-600 mt-1">
                    {t[language].startFresh}
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="tasks" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="tasks" className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                {t[language].realTasks} ({totalCount})
              </TabsTrigger>
              <TabsTrigger value="suggestions" className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4" />
                {t[language].suggestions} ({suggestedTasks.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="tasks" className="space-y-4">
              {/* Task filters */}
              <div className="flex items-center gap-2 flex-wrap">
                <Filter className="w-4 h-4 text-gray-500" />
                <Button 
                  variant={filter === 'all' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setFilter('all')}
                >
                  {t[language].filterAll}
                </Button>
                <Button 
                  variant={filter === 'pending' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setFilter('pending')}
                >
                  {t[language].filterPending}
                </Button>
                <Button 
                  variant={filter === 'in_progress' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setFilter('in_progress')}
                >
                  {t[language].filterInProgress}
                </Button>
                <Button 
                  variant={filter === 'completed' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setFilter('completed')}
                >
                  {t[language].filterCompleted}
                </Button>
              </div>

              <Separator />

              {(realTasksLoading || paginationLoading) ? (
                <div className="space-y-2">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-16 bg-gray-100 rounded animate-pulse" />
                  ))}
                </div>
              ) : paginatedData.tasks.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <ListTodo className="w-12 h-12 mx-auto mb-2 opacity-30" />
                  <p>{t[language].noTasks}</p>
                </div>
              ) : (
                <>
                  <div className="space-y-3">
                    {paginatedData.tasks.map((task) => (
                      <DetailedTaskCard
                        key={task.id}
                        task={task}
                        language={language}
                        onStatusChange={handleTaskStatusChange}
                        onDelete={handleDeleteTask}
                        isUpdating={updatingTasks.has(task.id)}
                      />
                    ))}
                  </div>

                  <TaskPagination
                    currentPage={paginatedData.currentPage}
                    totalPages={paginatedData.totalPages}
                    totalItems={paginatedData.totalCount}
                    itemsPerPage={TASKS_PER_PAGE}
                    onPageChange={setCurrentPage}
                    language={language}
                  />
                </>
              )}
            </TabsContent>

            <TabsContent value="suggestions" className="space-y-4">
              {/* Only show limit warning if user actually has many active tasks */}
              {isAtLimit && activeTasksCount > 10 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                  <div className="flex items-center gap-2 text-red-700">
                    <AlertTriangle className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      {t[language].limitReached}
                    </span>
                  </div>
                </div>
              )}

              {/* Show warning if approaching limit */}
              {isNearLimit && !isAtLimit && activeTasksCount > 20 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                  <div className="flex items-center gap-2 text-yellow-700">
                    <AlertTriangle className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      {t[language].limitWarning.replace('{count}', activeTasksCount.toString()).replace('{limit}', limit.toString())}
                    </span>
                  </div>
                </div>
              )}

              {suggestedLoading ? (
                <div className="space-y-2">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-16 bg-gray-100 rounded animate-pulse" />
                  ))}
                </div>
              ) : suggestedTasks.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Lightbulb className="w-12 h-12 mx-auto mb-2 opacity-30" />
                  <p>{t[language].noSuggestions}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {suggestedTasks.map((task) => (
                    <Card key={task.id} className="p-4 border-l-4 border-l-yellow-400">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Star className="w-4 h-4 text-yellow-500" />
                            <h4 className="font-medium text-sm">{task.title}</h4>
                          </div>
                          <p className="text-xs text-gray-600 mb-2">{task.description}</p>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className={`text-xs ${
                              task.priority === 'high' ? 'border-red-300 text-red-600' :
                              task.priority === 'medium' ? 'border-yellow-300 text-yellow-600' :
                              'border-green-300 text-green-600'
                            }`}>
                              {task.priority}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              <Clock className="w-3 h-3 mr-1" />
                              {task.estimatedTime}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 ml-2">
                          <Button 
                            size="sm" 
                            onClick={() => handleConvertSuggestedTask(task)}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white"
                            disabled={isAtLimit}
                          >
                            <Plus className="w-3 h-3 mr-1" />
                            {t[language].convertToTask}
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => onSelectAgent(task.agentId)}
                          >
                            {t[language].chatWithAgent}
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <ClearAllTasksDialog
        isOpen={showClearDialog}
        onClose={() => setShowClearDialog(false)}
        onConfirm={handleClearAllTasks}
        taskCount={totalCount}
        language={language}
      />
    </>
  );
};
