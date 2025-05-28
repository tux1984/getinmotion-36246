import React from 'react';
import { Agent, RecommendedAgents } from '@/types/dashboard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bot, MessageCircle, Play, Pause, Settings, Zap, Clock } from 'lucide-react';
import { useUserData } from '@/hooks/useUserData';
import { culturalAgentsDatabase } from '@/data/agentsDatabase';
import { CollapsibleAgentsSection } from './CollapsibleAgentsSection';

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
  const { agents: userAgents, trackAgentUsage, enableAgent, loading, refetch } = useUserData();

  const translations = {
    en: {
      yourAgents: "Your AI Agents",
      primaryRecommendations: "Recommended for You",
      chatWith: "Chat",
      configure: "Configure",
      active: "Active",
      paused: "Paused",
      inactive: "Inactive",
      activeTasks: "uses",
      recommended: "Recommended",
      enable: "Enable",
      lastUsed: "Last used",
      never: "Never",
      justEnabled: "Just enabled"
    },
    es: {
      yourAgents: "Tus Agentes IA",
      primaryRecommendations: "Recomendados para Ti",
      chatWith: "Chatear",
      configure: "Configurar",
      active: "Activo",
      paused: "Pausado",
      inactive: "Inactivo",
      activeTasks: "usos",
      recommended: "Recomendado",
      enable: "Habilitar",
      lastUsed: "Último uso",
      never: "Nunca",
      justEnabled: "Recién habilitado"
    }
  };

  const t = translations[language];

  // Merge agent data with user configuration
  const getMergedAgentData = (agentId: string) => {
    const agentConfig = userAgents.find(ua => ua.agent_id === agentId);
    const agentInfo = culturalAgentsDatabase.find(a => a.id === agentId);
    
    return {
      id: agentId,
      name: agentInfo?.name || agentId,
      category: agentInfo?.category || 'General',
      icon: agentInfo?.icon || '🤖',
      color: agentInfo?.color || 'bg-purple-500',
      isEnabled: agentConfig?.is_enabled || false,
      usageCount: agentConfig?.usage_count || 0,
      lastUsed: agentConfig?.last_used_at,
      priority: agentInfo?.priority || 'Media',
      isRecentlyEnabled: agentConfig && new Date(agentConfig.updated_at).getTime() > Date.now() - 10000 // Last 10 seconds
    };
  };

  const getFilteredAgents = (agentList: string[] | undefined) => {
    if (!agentList) return [];
    return agentList.map(getMergedAgentData);
  };

  const primaryAgents = getFilteredAgents(recommendedAgents.primary);
  const secondaryAgents = getFilteredAgents(recommendedAgents.secondary);
  const allOtherAgents = culturalAgentsDatabase
    .filter(agent => 
      !recommendedAgents.primary?.includes(agent.id) && 
      !recommendedAgents.secondary?.includes(agent.id)
    )
    .map(agent => getMergedAgentData(agent.id));

  const handleAgentClick = async (agentId: string) => {
    try {
      // Track agent usage
      await trackAgentUsage(agentId);
      
      // Navigate to agent
      onSelectAgent(agentId);
    } catch (error) {
      console.error('Error tracking agent usage:', error);
      // Still navigate even if tracking fails
      onSelectAgent(agentId);
    }
  };

  const handleEnableAgent = async (agentId: string) => {
    try {
      await enableAgent(agentId);
      // Refresh to get latest data
      await refetch();
    } catch (error) {
      console.error('Error enabling agent:', error);
    }
  };

  const formatLastUsed = (lastUsed: string | null) => {
    if (!lastUsed) return t.never;
    
    const date = new Date(lastUsed);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Hace unos minutos';
    if (diffInHours < 24) return `Hace ${diffInHours}h`;
    if (diffInHours < 168) return `Hace ${Math.floor(diffInHours / 24)}d`;
    return date.toLocaleDateString();
  };

  const ModernAgentCard = ({ agent, isRecommended = false }: { 
    agent: ReturnType<typeof getMergedAgentData>; 
    isRecommended?: boolean;
  }) => (
    <div className={`group relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
      agent.isRecentlyEnabled ? 'ring-2 ring-green-400 shadow-green-400/20' : ''
    }`}>
      {isRecommended && (
        <div className="absolute -top-2 -right-2">
          <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black border-0 font-medium">
            <Zap className="w-3 h-3 mr-1" />
            {t.recommended}
          </Badge>
        </div>
      )}
      
      {agent.isRecentlyEnabled && (
        <div className="absolute -top-2 -left-2">
          <Badge className="bg-gradient-to-r from-green-400 to-emerald-400 text-black border-0 font-medium animate-pulse">
            {t.justEnabled}
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
        
        <Badge className={`text-xs flex items-center gap-1 ${
          agent.isEnabled 
            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30'
            : 'bg-gray-500/20 text-gray-300 border-gray-400/30'
        }`}>
          {agent.isEnabled ? (
            <>
              <Play className="w-3 h-3" />
              {t.active}
            </>
          ) : (
            <>
              <Pause className="w-3 h-3" />
              {t.inactive}
            </>
          )}
        </Badge>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-300 mb-4">
        <span>{agent.usageCount} {t.activeTasks}</span>
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          <span>{formatLastUsed(agent.lastUsed)}</span>
        </div>
      </div>

      <div className="flex gap-2">
        {agent.isEnabled ? (
          <Button 
            onClick={() => handleAgentClick(agent.id)}
            className="flex-1 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white border-0 rounded-xl font-medium transition-all duration-200 hover:scale-105"
            size="sm"
            disabled={loading}
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            {t.chatWith}
          </Button>
        ) : (
          <Button 
            onClick={() => handleEnableAgent(agent.id)}
            className="flex-1 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white border-0 rounded-xl font-medium transition-all duration-200 hover:scale-105"
            size="sm"
            disabled={loading}
          >
            <Play className="w-4 h-4 mr-2" />
            {loading ? 'Habilitando...' : t.enable}
          </Button>
        )}
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

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center gap-3">
          <Bot className="w-8 h-8 text-purple-400" />
          <div className="h-8 bg-white/20 rounded w-48 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="bg-white/10 rounded-2xl p-6 animate-pulse">
              <div className="h-32 bg-white/20 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

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

      {/* Collapsible Available Agents Section */}
      {(secondaryAgents.length > 0 || allOtherAgents.length > 0) && (
        <CollapsibleAgentsSection
          agents={[...secondaryAgents, ...allOtherAgents]}
          onEnableAgent={handleEnableAgent}
          language={language}
        />
      )}

      {/* Empty state */}
      {primaryAgents.length === 0 && secondaryAgents.length === 0 && allOtherAgents.length === 0 && (
        <div className="text-center py-12">
          <Bot className="w-16 h-16 text-purple-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No agents available</h3>
          <p className="text-purple-200">Complete the onboarding to get your recommended agents</p>
        </div>
      )}
    </div>
  );
};
