
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RobustAgentChat } from './RobustAgentChat';
import { AgentTasksManager } from './AgentTasksManager';
import { AgentDeliverablesManager } from './AgentDeliverablesManager';
import { useAgentTasks } from '@/hooks/useAgentTasks';
import { useAgentDeliverables } from '@/hooks/useAgentDeliverables';
import { useAgentConversations } from '@/hooks/useAgentConversations';
import { 
  MessageSquare, 
  Target, 
  Package, 
  BarChart3,
  CheckCircle2,
  Clock,
  AlertTriangle,
  TrendingUp
} from 'lucide-react';

interface ModernAgentDetailsProps {
  agentId: string;
  language: 'en' | 'es';
}

export const ModernAgentDetails: React.FC<ModernAgentDetailsProps> = ({ 
  agentId, 
  language 
}) => {
  const [activeTab, setActiveTab] = useState('chat');
  
  const { tasks } = useAgentTasks(agentId);
  const { deliverables } = useAgentDeliverables(agentId);
  const { conversations } = useAgentConversations(agentId);

  // Determine agent name based on ID
  const getAgentName = () => {
    switch(agentId) {
      case 'contract-generator':
        return '📄 Generador de Contratos';
      case 'cost-calculator':
        return '💰 Calculadora de Costos';
      case 'maturity-evaluator':
        return '📊 Evaluador de Madurez';
      default:
        return 'Agente IA';
    }
  };

  const t = {
    en: {
      chat: "Chat",
      tasks: "Tasks",
      deliverables: "Deliverables",
      analytics: "Analytics",
      totalConversations: "Total Conversations",
      activeTasks: "Active Tasks",
      completedTasks: "Completed Tasks",
      totalDeliverables: "Total Deliverables",
      pendingTasks: "Pending",
      inProgressTasks: "In Progress",
      productivity: "Productivity Overview"
    },
    es: {
      chat: "Chat",
      tasks: "Tareas",
      deliverables: "Entregables",
      analytics: "Análisis",
      totalConversations: "Conversaciones Totales",
      activeTasks: "Tareas Activas",
      completedTasks: "Tareas Completadas",
      totalDeliverables: "Entregables Totales",
      pendingTasks: "Pendientes",
      inProgressTasks: "En Progreso",
      productivity: "Resumen de Productividad"
    }
  };

  // Calculate stats
  const activeTasks = tasks.filter(task => task.status === 'in_progress' || task.status === 'pending').length;
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const pendingTasks = tasks.filter(task => task.status === 'pending').length;
  const inProgressTasks = tasks.filter(task => task.status === 'in_progress').length;

  const StatCard = ({ title, value, icon, color = "purple" }: any) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-600">{title}</p>
            <p className={`text-2xl font-bold text-${color}-600`}>{value}</p>
          </div>
          <div className={`w-10 h-10 rounded-full bg-${color}-100 flex items-center justify-center`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{getAgentName()}</h1>
          <p className="text-slate-600">
            {language === 'en' 
              ? 'Advanced AI agent with persistent conversations and task management' 
              : 'Agente IA avanzado con conversaciones persistentes y gestión de tareas'
            }
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            {conversations.length} conversaciones
          </Badge>
          <Badge variant="secondary" className="text-xs">
            {tasks.length} tareas
          </Badge>
        </div>
      </div>

      {/* Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title={t[language].totalConversations}
          value={conversations.length}
          icon={<MessageSquare className="w-5 h-5 text-blue-600" />}
          color="blue"
        />
        <StatCard
          title={t[language].activeTasks}
          value={activeTasks}
          icon={<Clock className="w-5 h-5 text-yellow-600" />}
          color="yellow"
        />
        <StatCard
          title={t[language].completedTasks}
          value={completedTasks}
          icon={<CheckCircle2 className="w-5 h-5 text-green-600" />}
          color="green"
        />
        <StatCard
          title={t[language].totalDeliverables}
          value={deliverables.length}
          icon={<Package className="w-5 h-5 text-purple-600" />}
          color="purple"
        />
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-slate-100 p-1">
          <TabsTrigger 
            value="chat" 
            className="flex items-center gap-2 data-[state=active]:bg-white"
          >
            <MessageSquare className="w-4 h-4" />
            <span className="hidden sm:inline">{t[language].chat}</span>
          </TabsTrigger>
          <TabsTrigger 
            value="tasks" 
            className="flex items-center gap-2 data-[state=active]:bg-white"
          >
            <Target className="w-4 h-4" />
            <span className="hidden sm:inline">{t[language].tasks}</span>
            {activeTasks > 0 && (
              <Badge variant="secondary" className="ml-1 text-xs">
                {activeTasks}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger 
            value="deliverables" 
            className="flex items-center gap-2 data-[state=active]:bg-white"
          >
            <Package className="w-4 h-4" />
            <span className="hidden sm:inline">{t[language].deliverables}</span>
          </TabsTrigger>
          <TabsTrigger 
            value="analytics" 
            className="flex items-center gap-2 data-[state=active]:bg-white"
          >
            <BarChart3 className="w-4 h-4" />
            <span className="hidden sm:inline">{t[language].analytics}</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="space-y-4">
          <RobustAgentChat agentId={agentId} language={language} />
        </TabsContent>

        <TabsContent value="tasks" className="space-y-4">
          <AgentTasksManager agentId={agentId} language={language} />
        </TabsContent>

        <TabsContent value="deliverables" className="space-y-4">
          <AgentDeliverablesManager agentId={agentId} language={language} />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                  {t[language].productivity}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">{t[language].pendingTasks}</span>
                    <Badge variant="outline" className="text-yellow-600 border-yellow-200">
                      {pendingTasks}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">{t[language].inProgressTasks}</span>
                    <Badge variant="outline" className="text-blue-600 border-blue-200">
                      {inProgressTasks}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">{t[language].completedTasks}</span>
                    <Badge variant="outline" className="text-green-600 border-green-200">
                      {completedTasks}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-blue-600" />
                  Actividad Reciente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {conversations.slice(0, 5).map((conv) => (
                    <div key={conv.id} className="flex items-center gap-3 p-2 bg-slate-50 rounded-lg">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {conv.title || 'Nueva conversación'}
                        </p>
                        <p className="text-xs text-slate-500">
                          {new Date(conv.updated_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                  {conversations.length === 0 && (
                    <p className="text-sm text-slate-500 text-center py-4">
                      No hay actividad reciente
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
