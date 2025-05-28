
import React, { useState } from 'react';
import { useAgentTasks, AgentTask } from '@/hooks/useAgentTasks';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  AlertTriangle, 
  MoreHorizontal,
  Plus,
  Calendar,
  Target
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface AgentTasksManagerProps {
  agentId: string;
  language: 'en' | 'es';
}

export const AgentTasksManager: React.FC<AgentTasksManagerProps> = ({
  agentId,
  language
}) => {
  const { tasks, loading, updateTask } = useAgentTasks(agentId);
  const [updatingTasks, setUpdatingTasks] = useState<Set<string>>(new Set());

  const t = {
    en: {
      tasks: "Tasks",
      noTasks: "No tasks yet",
      createFirst: "Tasks will appear here when created by the agent",
      pending: "Pending",
      inProgress: "In Progress",
      completed: "Completed",
      cancelled: "Cancelled",
      high: "High",
      medium: "Medium",
      low: "Low",
      dueDate: "Due date",
      createdAt: "Created",
      progress: "Progress",
      markComplete: "Mark as Complete",
      markInProgress: "Mark as In Progress"
    },
    es: {
      tasks: "Tareas",
      noTasks: "No hay tareas aún",
      createFirst: "Las tareas aparecerán aquí cuando las cree el agente",
      pending: "Pendiente",
      inProgress: "En Progreso",
      completed: "Completada",
      cancelled: "Cancelada",
      high: "Alta",
      medium: "Media",
      low: "Baja",
      dueDate: "Fecha límite",
      createdAt: "Creada",
      progress: "Progreso",
      markComplete: "Marcar como Completada",
      markInProgress: "Marcar como En Progreso"
    }
  };

  const getRelevanceColor = (relevance: string) => {
    switch (relevance) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'in_progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleStatusChange = async (taskId: string, newStatus: AgentTask['status']) => {
    setUpdatingTasks(prev => new Set(prev).add(taskId));
    
    const updates: Partial<AgentTask> = { status: newStatus };
    if (newStatus === 'completed') {
      updates.completed_at = new Date().toISOString();
      updates.progress_percentage = 100;
    }
    
    await updateTask(taskId, updates);
    setUpdatingTasks(prev => {
      const newSet = new Set(prev);
      newSet.delete(taskId);
      return newSet;
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
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
            <Card key={task.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-3 h-3 rounded-full ${getRelevanceColor(task.relevance)}`} />
                      <h4 className="font-medium text-slate-900 truncate">
                        {task.title}
                      </h4>
                      <Badge className={`text-xs ${getStatusColor(task.status)}`}>
                        {t[language][task.status as keyof typeof t[typeof language]]}
                      </Badge>
                    </div>
                    
                    {task.description && (
                      <p className="text-sm text-slate-600 mb-3 line-clamp-2">
                        {task.description}
                      </p>
                    )}

                    <div className="flex items-center gap-4 text-xs text-slate-500 mb-3">
                      <div className="flex items-center gap-1">
                        <Circle className="w-3 h-3" />
                        {t[language].createdAt}: {formatDistanceToNow(new Date(task.created_at), { 
                          addSuffix: true,
                          locale: language === 'es' ? es : undefined
                        })}
                      </div>
                      {task.due_date && (
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {t[language].dueDate}: {new Date(task.due_date).toLocaleDateString()}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-600">{t[language].progress}</span>
                        <span className="font-medium">{task.progress_percentage}%</span>
                      </div>
                      <Progress value={task.progress_percentage} className="h-2" />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    {task.status !== 'completed' && (
                      <>
                        {task.status === 'pending' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleStatusChange(task.id, 'in_progress')}
                            disabled={updatingTasks.has(task.id)}
                            className="text-xs"
                          >
                            {updatingTasks.has(task.id) ? (
                              <div className="w-3 h-3 animate-spin rounded-full border border-current border-t-transparent" />
                            ) : (
                              <>{t[language].markInProgress}</>
                            )}
                          </Button>
                        )}
                        <Button
                          size="sm"
                          onClick={() => handleStatusChange(task.id, 'completed')}
                          disabled={updatingTasks.has(task.id)}
                          className="text-xs bg-green-600 hover:bg-green-700"
                        >
                          {updatingTasks.has(task.id) ? (
                            <div className="w-3 h-3 animate-spin rounded-full border border-current border-t-transparent" />
                          ) : (
                            <>
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              {t[language].markComplete}
                            </>
                          )}
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
