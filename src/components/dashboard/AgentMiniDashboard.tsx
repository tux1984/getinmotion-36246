
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
      <Card className="bg-white/5 backdrop-blur-xl border border-white/20 shadow-2xl h-full">
        <CardContent className="p-4 flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-400"></div>
        </CardContent>
      </Card>
    );
  }

  if (compact) {
    return (
      <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-3 text-center">
        <TrendingUp className="w-5 h-5 text-green-400 mx-auto mb-1" />
        <div className="text-white text-sm font-medium">{stats.totalConversations}</div>
        <div className="text-purple-300 text-xs">{t[language].conversations}</div>
      </div>
    );
  }

  return (
    <Card className="bg-white/5 backdrop-blur-xl border border-white/20 shadow-2xl h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-white text-sm flex items-center gap-2">
          <TrendingUp className="w-4 h-4" />
          {t[language].overview}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-4 pt-0 space-y-4">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/5 rounded-lg p-3 backdrop-blur">
            <div className="flex items-center gap-2 mb-1">
              <MessageSquare className="w-4 h-4 text-blue-400" />
              <span className="text-xs text-purple-200">{t[language].conversations}</span>
            </div>
            <div className="text-lg font-semibold text-white">{stats.totalConversations}</div>
          </div>
          
          <div className="bg-white/5 rounded-lg p-3 backdrop-blur">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span className="text-xs text-purple-200">{t[language].tasks}</span>
            </div>
            <div className="text-lg font-semibold text-white">{stats.activeTasks}</div>
          </div>
          
          <div className="bg-white/5 rounded-lg p-3 backdrop-blur">
            <div className="flex items-center gap-2 mb-1">
              <FileText className="w-4 h-4 text-purple-400" />
              <span className="text-xs text-purple-200">{t[language].deliverables}</span>
            </div>
            <div className="text-lg font-semibold text-white">{stats.deliverables}</div>
          </div>
          
          <div className="bg-white/5 rounded-lg p-3 backdrop-blur">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="w-4 h-4 text-orange-400" />
              <span className="text-xs text-purple-200">{t[language].avgSession}</span>
            </div>
            <div className="text-lg font-semibold text-white">
              {stats.avgSessionTime}{t[language].minutes}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        {stats.recentActivity.length > 0 && (
          <div>
            <h4 className="text-xs font-medium text-purple-200 mb-2 uppercase tracking-wide">
              {t[language].recentActivity}
            </h4>
            <div className="space-y-2">
              {stats.recentActivity.slice(0, 3).map((activity) => (
                <div key={activity.id} className="flex items-center gap-2 p-2 bg-white/5 rounded-lg backdrop-blur">
                  {activity.type === 'message' && <MessageSquare className="w-3 h-3 text-blue-400" />}
                  {activity.type === 'task' && <CheckCircle className="w-3 h-3 text-green-400" />}
                  {activity.type === 'deliverable' && <FileText className="w-3 h-3 text-purple-400" />}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-white truncate">{activity.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
