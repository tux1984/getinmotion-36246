
import React, { useState } from 'react';
import { useAgentTasks, AgentTask } from '@/hooks/useAgentTasks';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { UnifiedAgentHeader } from './chat/UnifiedAgentHeader';
import { 
  Plus, 
  CheckCircle2, 
  Loader, 
  ListTodo, 
  MessageSquare, 
  Play, 
  Search,
  Filter,
  Clock,
  Target,
  MoreHorizontal
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { UnifiedTaskWorkflowModal } from './UnifiedTaskWorkflowModal';
import { CreateTaskModal } from './CreateTaskModal';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface AgentTasksPanelProps {
  agentId: string;
  language: 'en' | 'es';
  onChatWithAgent?: (taskId: string, taskTitle: string) => void;
  showHeader?: boolean; // Nuevo prop para mostrar/ocultar header
  onBack?: () => void; // Nuevo prop para navegación
}

export const AgentTasksPanel: React.FC<AgentTasksPanelProps> = ({ 
  agentId, 
  language, 
  onChatWithAgent,
  showHeader = false,
  onBack
}) => {
  const { tasks, loading, createTask, updateTask } = useAgentTasks(agentId);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'in_progress' | 'completed'>('all');
  const [selectedTask, setSelectedTask] = useState<AgentTask | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const t = {
    en: {
      tasks: "Agent Tasks",
      newTask: "New Task",
      noTasks: "No tasks for this agent yet.",
      createFirst: "Create the first one!",
      search: "Search tasks...",
      workWith: "Work with",
      startTask: "Start Task",
      continueTask: "Continue",
      reviewTask: "Review",
      all: "All",
      pending: "Pending",
      in_progress: "In Progress",
      completed: "Completed",
      progress: "Progress",
      dueDate: "Due",
      highPriority: "High Priority",
      mediumPriority: "Medium Priority",
      lowPriority: "Low Priority"
    },
    es: {
      tasks: "Tareas del Agente",
      newTask: "Nueva Tarea",
      noTasks: "Aún no hay tareas para este agente.",
      createFirst: "¡Crea la primera!",
      search: "Buscar tareas...",
      workWith: "Trabajar con",
      startTask: "Iniciar Tarea",
      continueTask: "Continuar",
      reviewTask: "Revisar",
      all: "Todas",
      pending: "Pendientes",
      in_progress: "En Progreso",
      completed: "Completadas",
      progress: "Progreso",
      dueDate: "Vence",
      highPriority: "Prioridad Alta",
      mediumPriority: "Prioridad Media",
      lowPriority: "Prioridad Baja"
    }
  };

  // Filter tasks based on search and status
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusLabel = (status: AgentTask['status']) => {
    return t[language][status] || status;
  };

  const getStatusColor = (status: AgentTask['status']) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'in_progress': return 'text-blue-600 bg-blue-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority: number) => {
    if (priority === 1) return 'border-l-red-500';
    if (priority === 2) return 'border-l-yellow-500';
    return 'border-l-green-500';
  };

  const handleWorkWithAgent = (task: AgentTask) => {
    if (onChatWithAgent) {
      onChatWithAgent(task.id, task.title);
    }
  };

  const handleCreateTask = async (taskData: Partial<AgentTask>) => {
    await createTask(taskData);
    setShowCreateModal(false);
  };

  const handleUpdateTask = async (updates: Partial<AgentTask>) => {
    if (selectedTask) {
      await updateTask(selectedTask.id, updates);
      // Update the selected task with new data
      const updatedTask = { ...selectedTask, ...updates };
      setSelectedTask(updatedTask);
    }
  };

  const getMainAction = (task: AgentTask) => {
    switch (task.status) {
      case 'pending':
        return {
          label: t[language].startTask,
          icon: Play,
          className: 'bg-green-600 hover:bg-green-700 text-white'
        };
      case 'in_progress':
        return {
          label: t[language].continueTask,
          icon: Target,
          className: 'bg-blue-600 hover:bg-blue-700 text-white'
        };
      case 'completed':
        return {
          label: t[language].reviewTask,
          icon: CheckCircle2,
          className: 'bg-gray-600 hover:bg-gray-700 text-white'
        };
      default:
        return {
          label: t[language].startTask,
          icon: Play,
          className: 'bg-green-600 hover:bg-green-700 text-white'
        };
    }
  };

  return (
    <div className="h-full flex flex-col bg-transparent">
      {/* Header unificado opcional */}
      {showHeader && (
        <div className="mb-4">
          <UnifiedAgentHeader
            agentId={agentId}
            language={language}
            onBack={onBack}
            variant="embedded"
            showHeader={true}
          />
        </div>
      )}

      {/* Header with Create Button */}
      <div className="flex items-center justify-between mb-3 flex-shrink-0">
        <h3 className="text-sm font-medium text-white">{t[language].tasks}</h3>
        <Button 
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white"
          size="sm"
        >
          <Plus className="w-4 h-4 mr-1" />
          {t[language].newTask}
        </Button>
      </div>

      {/* Search and Filters */}
      {tasks.length > 0 && (
        <div className="space-y-2 mb-3 flex-shrink-0">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder={t[language].search}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-white/10 border-white/20 text-white placeholder:text-white/60"
            />
          </div>

          <div className="flex gap-1">
            {['all', 'pending', 'in_progress', 'completed'].map((status) => (
              <Button
                key={status}
                size="sm"
                variant={statusFilter === status ? "secondary" : "ghost"}
                onClick={() => setStatusFilter(status as any)}
                className={`text-xs px-2 py-1 h-auto ${
                  statusFilter === status 
                    ? 'bg-white/20 text-white' 
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                {t[language][status]}
              </Button>
            ))}
          </div>
        </div>
      )}
      
      {/* Tasks List */}
      <div className="flex-1 min-h-0">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <Loader className="w-6 h-6 animate-spin text-purple-400" />
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="text-center py-8 text-white/60 flex flex-col items-center justify-center h-full">
            <ListTodo className="w-8 h-8 mx-auto mb-2 opacity-50" />
            {tasks.length === 0 ? (
              <>
                <p className="text-sm">{t[language].noTasks}</p>
                <p className="text-xs opacity-75">{t[language].createFirst}</p>
              </>
            ) : (
              <p className="text-sm">No se encontraron tareas</p>
            )}
          </div>
        ) : (
          <ScrollArea className="h-full pr-3">
            <div className="space-y-3">
              {filteredTasks.map((task) => {
                const mainAction = getMainAction(task);
                const MainActionIcon = mainAction.icon;
                
                return (
                  <div
                    key={task.id}
                    className={`p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors border-l-4 ${getPriorityColor(task.priority)}`}
                  >
                    {/* Task Header */}
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <h4 
                          className="text-white text-sm font-medium truncate cursor-pointer hover:text-purple-300 transition-colors"
                          onClick={() => setSelectedTask(task)}
                        >
                          {task.title}
                        </h4>
                        {task.description && (
                          <p className="text-white/70 text-xs mt-1 line-clamp-2">
                            {task.description}
                          </p>
                        )}
                      </div>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="text-white/60 hover:text-white h-6 w-6 p-0">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setSelectedTask(task)}>
                            Ver detalles
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleWorkWithAgent(task)}>
                            <MessageSquare className="w-4 h-4 mr-2" />
                            {t[language].workWith} agente
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {/* Progress Bar */}
                    {task.progress_percentage > 0 && (
                      <div className="mb-2">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs text-white/60">{t[language].progress}</span>
                          <span className="text-xs text-white/60">{task.progress_percentage}%</span>
                        </div>
                        <Progress 
                          value={task.progress_percentage} 
                          className="h-1 bg-white/20"
                        />
                      </div>
                    )}

                    {/* Task Metadata */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant="secondary"
                          className={`text-xs ${getStatusColor(task.status)}`}
                        >
                          {getStatusLabel(task.status)}
                        </Badge>
                        
                        {task.due_date && (
                          <div className="flex items-center gap-1 text-xs text-white/60">
                            <Clock className="w-3 h-3" />
                            <span>{new Date(task.due_date).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-1">
                        <Button
                          size="sm"
                          onClick={() => handleWorkWithAgent(task)}
                          className="bg-purple-600 hover:bg-purple-700 text-white h-7 px-2"
                        >
                          <MessageSquare className="w-3 h-3 mr-1" />
                          <span className="text-xs">{t[language].workWith}</span>
                        </Button>
                        
                        <Button
                          size="sm"
                          onClick={() => setSelectedTask(task)}
                          className={`${mainAction.className} h-7 px-2`}
                        >
                          <MainActionIcon className="w-3 h-3 mr-1" />
                          <span className="text-xs">{mainAction.label}</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </div>

      {/* Task Detail Modal */}
      {selectedTask && (
        <UnifiedTaskWorkflowModal
          task={selectedTask}
          language={language}
          isOpen={!!selectedTask}
          onClose={() => setSelectedTask(null)}
          onWorkWithAgent={(taskId, taskTitle) => handleWorkWithAgent(selectedTask)}
          onUpdateTask={handleUpdateTask}
        />
      )}

      {/* Create Task Modal */}
      <CreateTaskModal
        agentId={agentId}
        language={language}
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreateTask={handleCreateTask}
      />
    </div>
  );
};
