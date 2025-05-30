
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAgentStats } from '@/hooks/useAgentStats';
import { 
  MessageSquare, 
  CheckCircle, 
  Clock, 
  FileText,
  TrendingUp
} from 'lucide-react';

interface AgentMiniDashboardProps {
  agentId: string;
  language: 'en' | 'es';
  compact?: boolean;
}

export const AgentMiniDashboard: React.FC<AgentMiniDashboardProps> = ({
  agentId,
  language,
  compact = false
}) => {
  const { stats, loading } = useAgentStats(agentId);

  const t = {
    en: {
      overview: "Overview",
      conversations: "Conversations",
      messages: "Messages", 
      tasks: "Active Tasks",
      completed: "Completed",
      deliverables: "Deliverables",
      avgSession: "Avg Session",
      minutes: "min",
      recentActivity: "Recent Activity"
    },
    es: {
      overview: "Resumen",
      conversations: "Conversaciones",
      messages: "Mensajes",
      tasks: "Tareas Activas", 
      completed: "Completadas",
      deliverables: "Entregables",
      avgSession: "Sesión Promedio",
      minutes: "min",
      recentActivity: "Actividad Reciente"
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
        <div className="flex items-center justify-center h-20">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
        </div>
      </div>
    );
  }

  if (compact) {
    return (
      <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm text-center">
        <div className="w-8 h-8 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-2">
          <TrendingUp className="w-4 h-4 text-violet-600" />
        </div>
        <div className="text-lg font-semibold">{stats.totalConversations}</div>
        <div className="text-xs text-gray-500">{t[language].conversations}</div>
      </div>
    );
  }

  const statsData = [
    {
      title: t[language].conversations,
      value: stats.totalConversations.toString(),
      icon: MessageSquare,
      color: "bg-blue-50 text-blue-700",
      iconColor: "text-blue-600"
    },
    {
      title: t[language].tasks,
      value: stats.activeTasks.toString(),
      icon: CheckCircle,
      color: "bg-green-50 text-green-700",
      iconColor: "text-green-600"
    },
    {
      title: t[language].deliverables,
      value: stats.deliverables.toString(),
      icon: FileText,
      color: "bg-purple-50 text-purple-700",
      iconColor: "text-purple-600"
    },
    {
      title: t[language].avgSession,
      value: `${stats.avgSessionTime}${t[language].minutes}`,
      icon: Clock,
      color: "bg-orange-50 text-orange-700",
      iconColor: "text-orange-600"
    }
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-purple-600" />
        <h3 className="text-lg font-semibold">{t[language].overview}</h3>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        {statsData.map((stat, index) => (
          <div key={index} className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full ${stat.color} flex items-center justify-center mr-3`}>
                <stat.icon className={`w-4 h-4 ${stat.iconColor}`} />
              </div>
              <div>
                <p className="text-xs text-gray-500">{stat.title}</p>
                <p className="text-lg font-semibold">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      {stats.recentActivity.length > 0 && (
        <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
          <h4 className="text-sm font-medium text-gray-700 mb-3">
            {t[language].recentActivity}
          </h4>
          <div className="space-y-2">
            {stats.recentActivity.slice(0, 3).map((activity) => (
              <div key={activity.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                {activity.type === 'message' && <MessageSquare className="w-3 h-3 text-blue-500" />}
                {activity.type === 'task' && <CheckCircle className="w-3 h-3 text-green-500" />}
                {activity.type === 'deliverable' && <FileText className="w-3 h-3 text-purple-500" />}
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-700 truncate">{activity.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
