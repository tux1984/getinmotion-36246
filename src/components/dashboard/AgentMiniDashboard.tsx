
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
      <div className="bg-white/5 backdrop-blur-xl p-4 rounded-2xl border border-white/10">
        <div className="flex items-center justify-center h-20">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-400"></div>
        </div>
      </div>
    );
  }

  if (compact) {
    return (
      <div className="bg-gradient-to-br from-purple-500/20 to-violet-600/20 backdrop-blur-xl p-4 rounded-2xl border border-purple-300/20 text-center">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-violet-600 rounded-full flex items-center justify-center mx-auto mb-3">
          <TrendingUp className="w-5 h-5 text-white" />
        </div>
        <div className="text-xl font-bold text-white">{stats.totalConversations}</div>
        <div className="text-sm text-purple-200">{t[language].conversations}</div>
      </div>
    );
  }

  const statsData = [
    {
      title: t[language].conversations,
      value: stats.totalConversations.toString(),
      icon: MessageSquare,
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-500/20 to-cyan-500/20"
    },
    {
      title: t[language].tasks,
      value: stats.activeTasks.toString(),
      icon: CheckCircle,
      gradient: "from-green-500 to-emerald-500",
      bgGradient: "from-green-500/20 to-emerald-500/20"
    },
    {
      title: t[language].deliverables,
      value: stats.deliverables.toString(),
      icon: FileText,
      gradient: "from-purple-500 to-violet-500",
      bgGradient: "from-purple-500/20 to-violet-500/20"
    },
    {
      title: t[language].avgSession,
      value: `${stats.avgSessionTime}${t[language].minutes}`,
      icon: Clock,
      gradient: "from-orange-500 to-red-500",
      bgGradient: "from-orange-500/20 to-red-500/20"
    }
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-violet-600 rounded-lg flex items-center justify-center">
          <TrendingUp className="w-4 h-4 text-white" />
        </div>
        <h3 className="text-lg font-bold text-white">{t[language].overview}</h3>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        {statsData.map((stat, index) => (
          <div key={index} className={`bg-gradient-to-br ${stat.bgGradient} backdrop-blur-xl p-4 rounded-xl border border-white/10`}>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 bg-gradient-to-br ${stat.gradient} rounded-lg flex items-center justify-center`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-white/70 font-medium">{stat.title}</p>
                <p className="text-xl font-bold text-white">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      {stats.recentActivity.length > 0 && (
        <div className="bg-white/5 backdrop-blur-xl p-4 rounded-xl border border-white/10">
          <h4 className="text-sm font-semibold text-white mb-3">
            {t[language].recentActivity}
          </h4>
          <div className="space-y-2">
            {stats.recentActivity.slice(0, 3).map((activity) => (
              <div key={activity.id} className="flex items-center gap-3 p-2 bg-white/5 rounded-lg">
                {activity.type === 'message' && <MessageSquare className="w-3 h-3 text-blue-400" />}
                {activity.type === 'task' && <CheckCircle className="w-3 h-3 text-green-400" />}
                {activity.type === 'deliverable' && <FileText className="w-3 h-3 text-purple-400" />}
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-white/80 truncate">{activity.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
