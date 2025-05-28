
import React, { useMemo } from 'react';
import { Agent } from '@/types/dashboard';
import { culturalAgentsDatabase } from '@/data/agentsDatabase';
import { useUserData } from '@/hooks/useUserData';
import { useAgentFilters } from '@/hooks/useAgentFilters';
import { useAgentToggle } from '@/hooks/useAgentToggle';
import { useAgentStats } from '@/hooks/useAgentStats';
import { AgentCategoryCard } from './AgentCategoryCard';
import { AgentFiltersPanel } from '../agent-manager/AgentFiltersPanel';
import { ModernStatsHeader } from './ModernStatsHeader';
import { TrueMasonryGrid } from '../agent-manager/TrueMasonryGrid';
import { Loader2, ExternalLink } from 'lucide-react';
import { isAgentRecommended } from '@/utils/agentUtils';
import { Link } from 'react-router-dom';

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
  const { togglingAgents, handleToggleAgent } = useAgentToggle(onAgentToggle);

  const translations = {
    en: {
      title: "AI Agent Manager",
      subtitle: "Activate and manage your specialized AI agents with advanced filtering and search capabilities",
      loading: "Loading agent management...",
      noAgentsFound: "No agents found",
      tryAdjusting: "Try adjusting your filters or search terms",
      clearAllFilters: "Clear all filters",
      viewAllAgents: "View All Agents Gallery"
    },
    es: {
      title: "Gestor de Agentes IA",
      subtitle: "Activa y gestiona tus agentes IA especializados con filtros avanzados y capacidades de búsqueda",
      loading: "Cargando gestión de agentes...",
      noAgentsFound: "No se encontraron agentes",
      tryAdjusting: "Intenta ajustar tus filtros o términos de búsqueda",
      clearAllFilters: "Limpiar todos los filtros",
      viewAllAgents: "Ver Galería de Todos los Agentes"
    }
  };

  const t = translations[language];

  // Get unique categories
  const categories = useMemo(() => {
    return [...new Set(culturalAgentsDatabase.map(agent => agent.category))];
  }, []);

  // Get user agent data for each agent with proper type safety and boolean conversion
  const getUserAgentData = (agentId: string) => {
    const userAgent = userAgents.find(ua => ua.agent_id === agentId);
    if (!userAgent) return undefined;
    
    // Ensure is_enabled is always a boolean
    return {
      ...userAgent,
      is_enabled: Boolean(userAgent.is_enabled) && userAgent.is_enabled !== 'false'
    };
  };

  // Use our new hooks
  const {
    filters,
    updateFilter,
    clearFilters,
    toggleCategory,
    filteredAndGroupedAgents,
    hasActiveFilters
  } = useAgentFilters(culturalAgentsDatabase, getUserAgentData);

  const stats = useAgentStats(culturalAgentsDatabase, userAgents);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-purple-600" />
          <p className="text-gray-600">{t.loading}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6">
      {/* Modern Header */}
      <ModernStatsHeader
        title={t.title}
        subtitle={t.subtitle}
        totalAgents={stats.totalAgents}
        activeAgents={stats.activeAgents}
        recommendedAgents={stats.recommendedAgents}
        language={language}
      />

      {/* Link to full agents gallery */}
      <div className="flex justify-center">
        <Link 
          to="/agents"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          <ExternalLink className="w-5 h-5" />
          {t.viewAllAgents}
        </Link>
      </div>

      {/* Filters */}
      <AgentFiltersPanel
        filters={filters}
        onUpdateFilter={updateFilter}
        onToggleCategory={toggleCategory}
        onClearFilters={clearFilters}
        categories={categories}
        hasActiveFilters={hasActiveFilters}
        language={language}
      />

      {/* True Masonry Grid Layout */}
      {Object.keys(filteredAndGroupedAgents).length > 0 ? (
        <TrueMasonryGrid columnWidth={400} gap={20}>
          {Object.entries(filteredAndGroupedAgents).map(([category, agents]) => {
            const categoryActiveCount = agents.filter(agent => {
              const userAgentData = getUserAgentData(agent.id);
              return userAgentData?.is_enabled || false;
            }).length;
            
            const categoryRecommendedCount = agents.filter(agent => 
              isAgentRecommended(agent.id)
            ).length;

            return (
              <div key={category}>
                <AgentCategoryCard
                  category={category}
                  categoryName={category}
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
              </div>
            );
          })}
        </TrueMasonryGrid>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🔍</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">{t.noAgentsFound}</h3>
          <p className="text-gray-600 mb-4">{t.tryAdjusting}</p>
          <button
            onClick={clearFilters}
            className="text-purple-600 hover:text-purple-800 font-medium"
          >
            {t.clearAllFilters}
          </button>
        </div>
      )}
    </div>
  );
};
