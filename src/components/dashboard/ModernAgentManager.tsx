
import React, { useMemo } from 'react';
import { Agent } from '@/types/dashboard';
import { culturalAgentsDatabase } from '@/data/agentsDatabase';
import { useUserData } from '@/hooks/useUserData';
import { useAgentFilters } from '@/hooks/useAgentFilters';
import { useAgentToggle } from '@/hooks/useAgentToggle';
import { OptimizedAgentCategoryCard } from './OptimizedAgentCategoryCard';
import { CompactTwoColumnHeader } from './CompactTwoColumnHeader';
import { SimpleMasonryGrid } from '../agent-manager/SimpleMasonryGrid';
import { MobileAgentManager } from '../agent-manager/MobileAgentManager';
import { Loader2 } from 'lucide-react';
import { isAgentRecommended } from '@/utils/agentUtils';
import { useIsMobile } from '@/hooks/use-mobile';
import { useTranslations } from '@/hooks/useTranslations';

interface ModernAgentManagerProps {
  currentAgents: Agent[];
  onAgentToggle: (agentId: string, enabled: boolean) => Promise<void>;
}

export const ModernAgentManager: React.FC<ModernAgentManagerProps> = ({
  currentAgents,
  onAgentToggle
}) => {
  const { agents: userAgents, loading } = useUserData();
  const { togglingAgents, handleToggleAgent } = useAgentToggle(onAgentToggle);
  const isMobile = useIsMobile();
  const { t, language } = useTranslations();

  // Use mobile version on small screens
  if (isMobile) {
    return (
      <MobileAgentManager
        currentAgents={currentAgents}
        onAgentToggle={onAgentToggle}
      />
    );
  }

  // Get unique categories
  const categories = useMemo(() => {
    return [...new Set(culturalAgentsDatabase.map(agent => agent.category))];
  }, []);

  // Get user agent data for each agent
  const getUserAgentData = (agentId: string) => {
    return userAgents.find(ua => ua.agent_id === agentId);
  };

  // Calculate stats based on user agents and cultural agents database
  const stats = useMemo(() => {
    const totalAgents = culturalAgentsDatabase.length;
    const activeAgents = userAgents.filter(ua => ua.is_enabled).length;
    const recommendedAgents = culturalAgentsDatabase.filter(agent => 
      isAgentRecommended(agent.id)
    ).length;

    return {
      totalAgents,
      activeAgents,
      recommendedAgents
    };
  }, [userAgents]);

  // Use our filters with categories
  const {
    filters,
    updateFilter,
    clearFilters,
    toggleCategory,
    filteredAndGroupedAgents,
    hasActiveFilters
  } = useAgentFilters(culturalAgentsDatabase, getUserAgentData);

  const handleUpdateFilter = (key: string, value: string) => {
    if (key === 'status') {
      updateFilter('selectedStatus', value as any);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-purple-600" />
          <p className="text-gray-600">{t.agentManager.loading}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Compact Two-Column Header */}
      <CompactTwoColumnHeader
        title={t.agentManager.title}
        subtitle={t.agentManager.subtitle}
        totalAgents={stats.totalAgents}
        activeAgents={stats.activeAgents}
        recommendedAgents={stats.recommendedAgents}
        selectedStatus={filters.selectedStatus}
        selectedCategories={filters.selectedCategories}
        categories={categories}
        onUpdateFilter={handleUpdateFilter}
        onToggleCategory={toggleCategory}
        language={language}
      />

      {/* Simple Masonry Grid */}
      {Object.keys(filteredAndGroupedAgents).length > 0 ? (
        <SimpleMasonryGrid>
          {Object.entries(filteredAndGroupedAgents).map(([category, agents]) => {
            const categoryActiveCount = agents.filter(agent => {
              const userAgentData = getUserAgentData(agent.id);
              return Boolean(userAgentData?.is_enabled);
            }).length;
            
            const categoryRecommendedCount = agents.filter(agent => 
              isAgentRecommended(agent.id)
            ).length;

            return (
              <OptimizedAgentCategoryCard
                key={category}
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
            );
          })}
        </SimpleMasonryGrid>
      ) : (
        <div className="text-center py-8">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-xl">🔍</span>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">{t.agentManager.noAgentsFound}</h3>
          <p className="text-purple-200 mb-3">{t.agentManager.tryAdjusting}</p>
          <button
            onClick={clearFilters}
            className="text-purple-300 hover:text-white font-medium text-sm"
          >
            {t.agentManager.clearAllFilters}
          </button>
        </div>
      )}
    </div>
  );
};
