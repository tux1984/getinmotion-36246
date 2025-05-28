
import React from 'react';
import { Agent, RecommendedAgents } from '@/types/dashboard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bot, MessageCircle, Play, Pause, Settings, Zap } from 'lucide-react';

interface ModernAgentsGridProps {
  agents: Agent[];
  recommendedAgents: RecommendedAgents;
  onSelectAgent: (id: string) => void;
  language: 'en' | 'es';
}

export const ModernAgentsGrid: React.FC<ModernAgentsGridProps> = ({
  agents,
  recommendedAgents,
  onSelectAgent,
  language
}) => {
  const translations = {
    en: {
      yourAgents: "Your AI Agents",
      primaryRecommendations: "Recommended for You",
      allAgents: "All Available Agents",
      chatWith: "Chat",
      configure: "Configure",
      active: "Active",
      paused: "Paused",
      inactive: "Inactive",
      activeTasks: "active tasks",
      recommended: "Recommended"
    },
    es: {
      yourAgents: "Tus Agentes IA",
      primaryRecommendations: "Recomendados para Ti",
      allAgents: "Todos los Agentes",
      chatWith: "Chatear",
      configure: "Configurar",
      active: "Activo",
      paused: "Pausado",
      inactive: "Inactivo",
      activeTasks: "tareas activas",
      recommended: "Recomendado"
    }
  };

  const t = translations[language];

  const getFilteredAgents = (agentList: string[] | undefined) => {
    if (!agentList) return [];
    return agents.filter(agent => agentList.includes(agent.id));
  };

  const primaryAgents = getFilteredAgents(recommendedAgents.primary);
  const secondaryAgents = getFilteredAgents(recommendedAgents.secondary);
  const allOtherAgents = agents.filter(agent => 
    !recommendedAgents.primary?.includes(agent.id) && 
    !recommendedAgents.secondary?.includes(agent.id)
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30';
      case 'paused': return 'bg-amber-500/20 text-amber-300 border-amber-400/30';
      case 'inactive': return 'bg-gray-500/20 text-gray-300 border-gray-400/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-400/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Play className="w-3 h-3" />;
      case 'paused': return <Pause className="w-3 h-3" />;
      default: return <Settings className="w-3 h-3" />;
    }
  };

  const ModernAgentCard = ({ agent, isRecommended = false }: { agent: Agent; isRecommended?: boolean }) => (
    <div className="group relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
      {isRecommended && (
        <div className="absolute -top-2 -right-2">
          <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black border-0 font-medium">
            <Zap className="w-3 h-3 mr-1" />
            {t.recommended}
          </Badge>
        </div>
      )}
      
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-xl shadow-lg">
            {agent.icon}
          </div>
          <div>
            <h3 className="font-semibold text-white text-lg group-hover:text-purple-200 transition-colors">
              {agent.name}
            </h3>
            <p className="text-purple-200 text-sm">{agent.category}</p>
          </div>
        </div>
        
        <Badge className={`text-xs flex items-center gap-1 ${getStatusColor(agent.status)}`}>
          {getStatusIcon(agent.status)}
          {t[agent.status as keyof typeof t] || agent.status}
        </Badge>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-300 mb-4">
        <span>{agent.activeTasks} {t.activeTasks}</span>
        <span>{agent.lastUsed || 'Nunca'}</span>
      </div>

      <div className="flex gap-2">
        <Button 
          onClick={() => onSelectAgent(agent.id)}
          className="flex-1 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white border-0 rounded-xl font-medium transition-all duration-200 hover:scale-105"
          size="sm"
        >
          <MessageCircle className="w-4 h-4 mr-2" />
          {t.chatWith}
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="border-white/20 text-white hover:bg-white/10 rounded-xl"
        >
          <Settings className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Bot className="w-8 h-8 text-purple-400" />
        <h2 className="text-3xl font-bold text-white">{t.yourAgents}</h2>
      </div>

      {/* Primary Recommendations */}
      {primaryAgents.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-purple-200 flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-400" />
            {t.primaryRecommendations}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {primaryAgents.map(agent => (
              <ModernAgentCard key={agent.id} agent={agent} isRecommended={true} />
            ))}
          </div>
        </div>
      )}

      {/* All Available Agents */}
      {(secondaryAgents.length > 0 || allOtherAgents.length > 0) && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-purple-200">{t.allAgents}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...secondaryAgents, ...allOtherAgents].map(agent => (
              <ModernAgentCard key={agent.id} agent={agent} />
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {agents.length === 0 && (
        <div className="text-center py-12">
          <Bot className="w-16 h-16 text-purple-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No agents available</h3>
          <p className="text-purple-200">Complete the onboarding to get your recommended agents</p>
        </div>
      )}
    </div>
  );
};
