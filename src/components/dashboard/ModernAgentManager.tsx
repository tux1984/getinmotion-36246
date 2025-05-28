
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Agent } from '@/types/dashboard';
import { culturalAgentsDatabase, CulturalAgent } from '@/data/agentsDatabase';
import { useUserData } from '@/hooks/useUserData';
import { AgentCategoryCard } from './AgentCategoryCard';
import { Loader2 } from 'lucide-react';

interface ModernAgentManagerProps {
  currentAgents: Agent[];
  onAgentToggle: (agentId: string, enabled: boolean) => Promise<void>;
  language: 'en' | 'es';
}

export const ModernAgentManager: React.FC<ModernAgentManagerProps> = ({
  currentAgents,
  onAgentToggle,
  language
}) => {
  const { agents: userAgents, loading } = useUserData();
  const [togglingAgents, setTogglingAgents] = useState<Set<string>>(new Set());

  const translations = {
    en: {
      title: "AI Agent Manager",
      subtitle: "Activate and manage your specialized AI agents by category",
      activeGlobal: "Active",
      totalGlobal: "Available",
      categories: {
        Financiera: "Financial",
        Legal: "Legal",
        Diagnóstico: "Diagnostic",
        Comercial: "Commercial",
        Operativo: "Operations",
        Comunidad: "Community"
      }
    },
    es: {
      title: "Gestor de Agentes IA",
      subtitle: "Activa y gestiona tus agentes IA especializados por categoría",
      activeGlobal: "Activos",
      totalGlobal: "Disponibles",
      categories: {
        Financiera: "Financiera",
        Legal: "Legal",
        Diagnóstico: "Diagnóstico",
        Comercial: "Comercial",
        Operativo: "Operativo",
        Comunidad: "Comunidad"
      }
    }
  };

  const t = translations[language];

  // Group agents by category
  const groupedAgents = culturalAgentsDatabase.reduce((groups, agent) => {
    if (!groups[agent.category]) {
      groups[agent.category] = [];
    }
    groups[agent.category].push(agent);
    return groups;
  }, {} as Record<string, CulturalAgent[]>);

  // Calculate global stats
  const totalAgents = culturalAgentsDatabase.length;
  const activeAgents = userAgents.filter(ua => ua.is_enabled).length;

  // Get user agent data for each agent
  const getUserAgentData = (agentId: string) => {
    return userAgents.find(ua => ua.agent_id === agentId);
  };

  // Check if agent is recommended
  const isAgentRecommended = (agentId: string) => {
    const recommendedIds = ['cultural-consultant', 'project-manager', 'cost-calculator', 'content-creator', 'collaboration-agreement', 'export-advisor', 'stakeholder-matching'];
    return recommendedIds.includes(agentId);
  };

  const handleToggleAgent = async (agentId: string, currentEnabled: boolean) => {
    setTogglingAgents(prev => new Set(prev).add(agentId));
    
    try {
      await onAgentToggle(agentId, !currentEnabled);
    } catch (error) {
      console.error('Error toggling agent:', error);
    } finally {
      setTogglingAgents(prev => {
        const newSet = new Set(prev);
        newSet.delete(agentId);
        return newSet;
      });
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-purple-600" />
          <p className="text-gray-600">Cargando gestión de agentes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          {t.title}
        </h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          {t.subtitle}
        </p>
        
        {/* Global Stats */}
        <div className="flex justify-center gap-6 mt-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">{activeAgents}</div>
            <div className="text-sm text-gray-500">{t.activeGlobal}</div>
          </div>
          <div className="w-px h-12 bg-gray-200"></div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-700">{totalAgents}</div>
            <div className="text-sm text-gray-500">{t.totalGlobal}</div>
          </div>
        </div>
      </div>

      {/* Category Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Object.entries(groupedAgents).map(([category, agents]) => {
          const categoryActiveCount = agents.filter(agent => 
            getUserAgentData(agent.id)?.is_enabled
          ).length;
          
          const categoryRecommendedCount = agents.filter(agent => 
            isAgentRecommended(agent.id)
          ).length;

          return (
            <AgentCategoryCard
              key={category}
              category={category}
              categoryName={t.categories[category as keyof typeof t.categories]}
              agents={agents}
              activeCount={categoryActiveCount}
              totalCount={agents.length}
              recommendedCount={categoryRecommendedCount}
              getUserAgentData={getUserAgentData}
              isAgentRecommended={isAgentRecommended}
              onToggleAgent={handleToggleAgent}
              togglingAgents={togglingAgents}
              language={language}
            />
          );
        })}
      </div>
    </div>
  );
};
