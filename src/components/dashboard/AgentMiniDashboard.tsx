
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
      active: "Active",
      completed: "Completed", 
      chats: "Chats",
      deliverables: "Deliverables",
      today: "Today",
      recentActivity: "Recent Activity",
      noRecentActivity: "No recent activity"
    },
    es: {
      overview: "Resumen",
      active: "Activo",
      completed: "Completadas",
      chats: "Chats", 
      deliverables: "Entregables",
      today: "Hoy",
      recentActivity: "Actividad Reciente",
      noRecentActivity: "No hay actividad reciente"
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
        <div className="text-sm text-purple-200">{t[language].chats}</div>
      </div>
    );
  }

  const statsData = [
    {
      title: t[language].active,
      value: stats.activeTasks.toString(),
      icon: Clock,
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-500/20 to-cyan-500/20"
    },
    {
      title: t[language].completed,
      value: stats.completedTasks.toString(),
      icon: CheckCircle,
      gradient: "from-green-500 to-emerald-500",
      bgGradient: "from-green-500/20 to-emerald-500/20"
    },
    {
      title: t[language].chats,
      value: stats.totalConversations.toString(),
      icon: MessageSquare,
      gradient: "from-purple-500 to-violet-500",
      bgGradient: "from-purple-500/20 to-violet-500/20"
    },
    {
      title: t[language].deliverables,
      value: stats.deliverables.toString(),
      icon: FileText,
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

      {/* Stats Grid - Main 4 cards */}
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

      {/* Today Section */}
      <div className="bg-gradient-to-br from-purple-500/20 to-violet-600/20 backdrop-blur-xl p-4 rounded-xl border border-purple-300/20">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-white/70 font-medium">{t[language].today}</p>
            <p className="text-2xl font-bold text-white">{stats.totalMessages}</p>
          </div>
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center">
            <MessageSquare className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="bg-white/5 backdrop-blur-xl p-4 rounded-xl border border-white/10">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
            <MessageSquare className="w-3 h-3 text-white" />
          </div>
          <h4 className="text-sm font-medium text-white">{t[language].recentActivity}</h4>
        </div>
        
        <div className="space-y-2">
          {stats.recentActivity.length > 0 ? (
            stats.recentActivity.slice(0, 3).map((activity, index) => (
              <div key={activity.id} className="flex items-center gap-3 p-2 bg-white/5 rounded-lg">
                <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate text-white">
                    {activity.title}
                  </p>
                  <p className="text-xs text-purple-300">
                    {new Date(activity.timestamp).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-xs text-white/60 text-center py-2">
              {t[language].noRecentActivity}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
