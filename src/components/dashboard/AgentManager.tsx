import React, { useState } from 'react';
import { Agent } from '@/types/dashboard';
import { culturalAgentsDatabase, CulturalAgent } from '@/data/agentsDatabase';
import { useUserData } from '@/hooks/useUserData';
import { AgentManagerHeader } from './AgentManagerHeader';
import { AgentCategoryTabs } from './AgentCategoryTabs';

interface AgentManagerProps {
  currentAgents: Agent[];
  onAgentToggle: (agentId: string, enabled: boolean) => Promise<void>;
  language: 'en' | 'es';
}

export const AgentManager: React.FC<AgentManagerProps> = ({
  currentAgents,
  onAgentToggle,
  language
}) => {
  const { agents: userAgents, loading } = useUserData();
  const [togglingAgents, setTogglingAgents] = useState<Set<string>>(new Set());

  const translations = {
    en: {
      title: "Agent Manager",
      subtitle: "Activate and manage your AI agents",
      categories: {
        Financiera: "Financial",
        Legal: "Legal",
        Diagnóstico: "Diagnostic",
        Comercial: "Commercial",
        Operativo: "Operations",
        Comunidad: "Community"
      },
      priority: "Priority",
      impact: "Impact",
      enabled: "Enabled",
      disabled: "Disabled",
      activate: "Activate",
      deactivate: "Deactivate",
      allAgents: "All Agents",
      recommended: "Recommended",
      usageCount: "Usage count",
      lastUsed: "Last used",
      never: "Never",
      activating: "Activating...",
      deactivating: "Deactivating..."
    },
    es: {
      title: "Gestor de Agentes",
      subtitle: "Activa y gestiona tus agentes IA",
      categories: {
        Financiera: "Financiera",
        Legal: "Legal",
        Diagnóstico: "Diagnóstico",
        Comercial: "Comercial",
        Operativo: "Operativo",
        Comunidad: "Comunidad"
      },
      priority: "Prioridad",
      impact: "Impacto",
      enabled: "Activado",
      disabled: "Desactivado",
      activate: "Activar",
      deactivate: "Desactivar",
      allAgents: "Todos los Agentes",
      recommended: "Recomendado",
      usageCount: "Contador de uso",
      lastUsed: "Último uso",
      never: "Nunca",
      activating: "Activando...",
      deactivating: "Desactivando..."
    }
  };

  const t = translations[language];

  // Get user agent data for each agent
  const getUserAgentData = (agentId: string) => {
    return userAgents.find(ua => ua.agent_id === agentId);
  };

  // Check if agent is recommended
  const isAgentRecommended = (agentId: string) => {
    const recommendedIds = ['cultural-consultant', 'project-manager', 'cost-calculator', 'content-creator'];
    return recommendedIds.includes(agentId);
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

  const handleToggleAgent = async (agentId: string, currentEnabled: boolean) => {
    console.log('AgentManager: Toggling agent', agentId, 'from', currentEnabled, 'to', !currentEnabled);
    
    setTogglingAgents(prev => new Set(prev).add(agentId));
    
    try {
      await onAgentToggle(agentId, !currentEnabled);
      console.log('AgentManager: Agent toggle completed successfully');
    } catch (error) {
      console.error('AgentManager: Error toggling agent:', error);
    } finally {
      setTogglingAgents(prev => {
        const newSet = new Set(prev);
        newSet.delete(agentId);
        return newSet;
      });
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Alta': return 'bg-red-100 text-red-800';
      case 'Media-Alta': return 'bg-orange-100 text-orange-800';
      case 'Media': return 'bg-yellow-100 text-yellow-800';
      case 'Baja': return 'bg-blue-100 text-blue-800';
      case 'Muy Baja': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getImpactColor = (impact: number) => {
    switch (impact) {
      case 4: return 'bg-green-100 text-green-800';
      case 3: return 'bg-lime-100 text-lime-800';
      case 2: return 'bg-yellow-100 text-yellow-800';
      case 1: return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const groupedAgents = culturalAgentsDatabase.reduce((groups, agent) => {
    if (!groups[agent.category]) {
      groups[agent.category] = [];
    }
    groups[agent.category].push(agent);
    return groups;
  }, {} as Record<string, CulturalAgent[]>);

  if (loading) {
    return (
      <div className="space-y-6">
        <AgentManagerHeader
          title={t.title}
          subtitle={t.subtitle}
          totalAgents={0}
          activeAgents={0}
        />
        <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-gray-100 rounded-lg p-6 animate-pulse">
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AgentManagerHeader
        title={t.title}
        subtitle={t.subtitle}
        totalAgents={culturalAgentsDatabase.length}
        activeAgents={userAgents.filter(ua => ua.is_enabled).length}
      />

      <AgentCategoryTabs
        groupedAgents={groupedAgents}
        getUserAgentData={getUserAgentData}
        isAgentRecommended={isAgentRecommended}
        togglingAgents={togglingAgents}
        onToggleAgent={handleToggleAgent}
        formatLastUsed={formatLastUsed}
        getPriorityColor={getPriorityColor}
        getImpactColor={getImpactColor}
        translations={t}
        language={language}
      />
    </div>
  );
};
