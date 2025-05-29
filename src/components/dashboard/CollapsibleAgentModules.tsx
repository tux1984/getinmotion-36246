
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AgentTasksManager } from './AgentTasksManager';
import { AgentDeliverablesManager } from './AgentDeliverablesManager';
import { useAgentTasks } from '@/hooks/useAgentTasks';
import { useAgentDeliverables } from '@/hooks/useAgentDeliverables';
import { useAgentConversations } from '@/hooks/useAgentConversations';
import { 
  ChevronDown, 
  ChevronUp,
  Target, 
  Package, 
  BarChart3,
  CheckCircle2,
  Clock,
  MessageSquare,
  TrendingUp
} from 'lucide-react';

interface CollapsibleAgentModulesProps {
  agentId: string;
  language: 'en' | 'es';
}

export const CollapsibleAgentModules: React.FC<CollapsibleAgentModulesProps> = ({ 
  agentId, 
  language 
}) => {
  const [expandedModules, setExpandedModules] = useState<string[]>([]);
  
  const { tasks } = useAgentTasks(agentId);
  const { deliverables } = useAgentDeliverables(agentId);
  const { conversations } = useAgentConversations(agentId);

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => 
      prev.includes(moduleId) 
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const t = {
    en: {
      tasks: "Tasks",
      deliverables: "Deliverables", 
      analytics: "Analytics",
      activeTasks: "Active Tasks",
      completedTasks: "Completed Tasks",
      totalDeliverables: "Total Deliverables",
      totalConversations: "Total Conversations",
      pendingTasks: "Pending",
      inProgressTasks: "In Progress",
      productivity: "Productivity Overview"
    },
    es: {
      tasks: "Tareas",
      deliverables: "Entregables",
      analytics: "Análisis", 
      activeTasks: "Tareas Activas",
      completedTasks: "Tareas Completadas",
      totalDeliverables: "Entregables Totales",
      totalConversations: "Conversaciones Totales",
      pendingTasks: "Pendientes",
      inProgressTasks: "En Progreso",
      productivity: "Resumen de Productividad"
    }
  };

  const activeTasks = tasks.filter(task => task.status === 'in_progress' || task.status === 'pending').length;
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const pendingTasks = tasks.filter(task => task.status === 'pending').length;
  const inProgressTasks = tasks.filter(task => task.status === 'in_progress').length;

  const modules = [
    {
      id: 'tasks',
      title: t[language].tasks,
      icon: Target,
      badge: activeTasks,
      content: <AgentTasksManager agentId={agentId} language={language} />
    },
    {
      id: 'deliverables', 
      title: t[language].deliverables,
      icon: Package,
      badge: deliverables.length,
      content: <AgentDeliverablesManager agentId={agentId} language={language} />
    },
    {
      id: 'analytics',
      title: t[language].analytics,
      icon: BarChart3,
      badge: null,
      content: (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-white/5 backdrop-blur border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <TrendingUp className="w-5 h-5 text-purple-400" />
                {t[language].productivity}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-purple-200">{t[language].pendingTasks}</span>
                  <Badge variant="outline" className="text-yellow-400 border-yellow-400/30 bg-yellow-400/10">
                    {pendingTasks}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-purple-200">{t[language].inProgressTasks}</span>
                  <Badge variant="outline" className="text-blue-400 border-blue-400/30 bg-blue-400/10">
                    {inProgressTasks}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-purple-200">{t[language].completedTasks}</span>
                  <Badge variant="outline" className="text-green-400 border-green-400/30 bg-green-400/10">
                    {completedTasks}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 backdrop-blur border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <MessageSquare className="w-5 h-5 text-blue-400" />
                Actividad Reciente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {conversations.slice(0, 5).map((conv) => (
                  <div key={conv.id} className="flex items-center gap-3 p-2 bg-white/5 rounded-lg backdrop-blur">
                    <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate text-white">
                        {conv.title || 'Nueva conversación'}
                      </p>
                      <p className="text-xs text-purple-300">
                        {new Date(conv.updated_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
                {conversations.length === 0 && (
                  <p className="text-sm text-purple-300 text-center py-4">
                    No hay actividad reciente
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-4">
      {modules.map((module) => (
        <Card key={module.id} className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl">
          <CardHeader className="pb-3">
            <Button
              variant="ghost"
              onClick={() => toggleModule(module.id)}
              className="w-full justify-between text-white hover:bg-white/10 p-4 h-auto"
            >
              <div className="flex items-center gap-3">
                <module.icon className="w-5 h-5 text-purple-400" />
                <span className="font-medium">{module.title}</span>
                {module.badge !== null && module.badge > 0 && (
                  <Badge variant="secondary" className="ml-2 bg-purple-500/20 text-purple-300 border-purple-400/30">
                    {module.badge}
                  </Badge>
                )}
              </div>
              {expandedModules.includes(module.id) ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </Button>
          </CardHeader>
          
          {expandedModules.includes(module.id) && (
            <CardContent className="pt-0">
              {module.content}
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  );
};
