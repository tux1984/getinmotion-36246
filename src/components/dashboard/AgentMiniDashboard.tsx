
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAgentTasks } from '@/hooks/useAgentTasks';
import { useAgentConversations } from '@/hooks/useAgentConversations';
import { useAgentDeliverables } from '@/hooks/useAgentDeliverables';
import { 
  BarChart3, 
  CheckCircle2, 
  Clock, 
  MessageSquare,
  TrendingUp,
  Target
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
  const { tasks } = useAgentTasks(agentId);
  const { conversations } = useAgentConversations(agentId);
  const { deliverables } = useAgentDeliverables(agentId);

  const t = {
    en: {
      dashboard: "Dashboard",
      activeTasks: "Active",
      completed: "Completed", 
      conversations: "Chats",
      deliverables: "Deliverables",
      productivity: "Today"
    },
    es: {
      dashboard: "Dashboard",
      activeTasks: "Activas",
      completed: "Completadas",
      conversations: "Chats", 
      deliverables: "Entregables",
      productivity: "Hoy"
    }
  };

  const activeTasks = tasks.filter(task => task.status === 'in_progress' || task.status === 'pending').length;
  const completedTasks = tasks.filter(task => task.status === 'completed').length;

  if (compact) {
    return (
      <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-3 text-center">
        <BarChart3 className="w-5 h-5 text-purple-400 mx-auto mb-1" />
        <div className="text-white text-xs font-medium">{activeTasks}</div>
        <div className="text-purple-300 text-xs">{t[language].activeTasks}</div>
      </div>
    );
  }

  return (
    <Card className="bg-white/5 backdrop-blur-xl border border-white/20 shadow-2xl h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-white text-sm flex items-center gap-2">
          <BarChart3 className="w-4 h-4" />
          {t[language].dashboard}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-4 pt-0">
        <div className="grid grid-cols-2 gap-3">
          {/* Active Tasks */}
          <div className="bg-white/5 rounded-lg p-3 text-center">
            <Target className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
            <div className="text-white text-lg font-bold">{activeTasks}</div>
            <div className="text-yellow-300 text-xs">{t[language].activeTasks}</div>
          </div>

          {/* Completed Tasks */}
          <div className="bg-white/5 rounded-lg p-3 text-center">
            <CheckCircle2 className="w-5 h-5 text-green-400 mx-auto mb-1" />
            <div className="text-white text-lg font-bold">{completedTasks}</div>
            <div className="text-green-300 text-xs">{t[language].completed}</div>
          </div>

          {/* Conversations */}
          <div className="bg-white/5 rounded-lg p-3 text-center">
            <MessageSquare className="w-5 h-5 text-blue-400 mx-auto mb-1" />
            <div className="text-white text-lg font-bold">{conversations.length}</div>
            <div className="text-blue-300 text-xs">{t[language].conversations}</div>
          </div>

          {/* Deliverables */}
          <div className="bg-white/5 rounded-lg p-3 text-center">
            <TrendingUp className="w-5 h-5 text-purple-400 mx-auto mb-1" />
            <div className="text-white text-lg font-bold">{deliverables.length}</div>
            <div className="text-purple-300 text-xs">{t[language].deliverables}</div>
          </div>
        </div>

        {/* Progress indicator */}
        <div className="mt-4 bg-white/5 rounded-lg p-3">
          <div className="flex justify-between items-center mb-2">
            <span className="text-purple-200 text-xs">{t[language].productivity}</span>
            <Badge variant="outline" className="text-green-400 border-green-400/30 bg-green-400/10 text-xs">
              +{Math.max(0, completedTasks - activeTasks)}
            </Badge>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all"
              style={{ 
                width: `${Math.min(100, (completedTasks / Math.max(1, completedTasks + activeTasks)) * 100)}%` 
              }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
