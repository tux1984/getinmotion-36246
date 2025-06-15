
import React, { useState } from 'react';
import { AgentTask } from '@/hooks/useAgentTasks';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { CheckCircle2, Clock, Calendar, ChevronDown, Edit, Trash, Loader2 } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import { es } from 'date-fns/locale';

interface DetailedTaskCardProps {
  task: AgentTask;
  language: 'en' | 'es';
  onStatusChange: (taskId: string, newStatus: AgentTask['status']) => Promise<void>;
  onDelete: (taskId: string) => Promise<void>;
  isUpdating: boolean;
}

export const DetailedTaskCard: React.FC<DetailedTaskCardProps> = ({
  task,
  language,
  onStatusChange,
  onDelete,
  isUpdating,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const t = {
    en: {
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
      markInProgress: "Mark as In Progress",
      description: "Description",
      updatedAt: "Last updated",
      delete: "Delete",
      edit: "Edit"
    },
    es: {
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
      markInProgress: "Marcar como En Progreso",
      description: "Descripción",
      updatedAt: "Última actualización",
      delete: "Eliminar",
      edit: "Editar"
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

  return (
    <Card className="hover:shadow-md transition-shadow w-full">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-3 h-3 rounded-full flex-shrink-0 ${getRelevanceColor(task.relevance)}`} />
                <h4 className="font-medium text-slate-900 truncate flex-1">
                  {task.title}
                </h4>
                <Badge className={`text-xs whitespace-nowrap ${getStatusColor(task.status)}`}>
                  {t[language][task.status as keyof typeof t[typeof language]]}
                </Badge>
              </div>

              <div className="space-y-2 mb-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600">{t[language].progress}</span>
                  <span className="font-medium">{task.progress_percentage}%</span>
                </div>
                <Progress value={task.progress_percentage} className="h-2" />
              </div>

              <div className="flex items-center gap-4 text-xs text-slate-500">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>
                    {formatDistanceToNow(new Date(task.created_at), { 
                      addSuffix: true,
                      locale: language === 'es' ? es : undefined 
                    })}
                  </span>
                </div>
                {task.due_date && (
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(task.due_date).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col items-center gap-2">
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="w-full">
                  <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </Button>
              </CollapsibleTrigger>
              {task.status !== 'completed' && task.status !== 'cancelled' && (
                <Button
                  size="sm"
                  onClick={() => onStatusChange(task.id, 'completed')}
                  disabled={isUpdating}
                  className="text-xs bg-green-600 hover:bg-green-700 w-full"
                >
                  {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
        <CollapsibleContent className="px-4 pb-4">
          <div className="border-t pt-4 mt-2 space-y-4">
            {task.description && (
              <div>
                <h5 className="text-sm font-medium text-slate-800 mb-1">{t[language].description}</h5>
                <p className="text-sm text-slate-600 whitespace-pre-wrap">
                  {task.description}
                </p>
              </div>
            )}
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-xs text-slate-500">
                  <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{t[language].updatedAt}: {format(new Date(task.updated_at), "PPpp", { locale: language === 'es' ? es : undefined })}</span>
                  </div>
              </div>
              <div className="flex gap-2">
                {task.status === 'pending' && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onStatusChange(task.id, 'in_progress')}
                    disabled={isUpdating}
                    className="text-xs"
                  >
                    {isUpdating ? <Loader2 className="w-3 h-3 animate-spin" /> : t[language].markInProgress}
                  </Button>
                )}
                <Button size="sm" variant="outline" disabled={isUpdating} title={t[language].edit}>
                  <Edit className="w-3 h-3" />
                </Button>
                <Button size="sm" variant="destructive" onClick={() => onDelete(task.id)} disabled={isUpdating} title={t[language].delete}>
                  {isUpdating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash className="w-3 h-3" />}
                </Button>
              </div>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};
