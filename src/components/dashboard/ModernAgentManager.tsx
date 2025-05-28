
import React, { useState, useMemo } from 'react';
import { Agent } from '@/types/dashboard';
import { culturalAgentsDatabase, CulturalAgent } from '@/data/agentsDatabase';
import { useUserData } from '@/hooks/useUserData';
import { AgentCategoryCard } from './AgentCategoryCard';
import { AgentFilters } from './AgentFilters';
import { ModernStatsHeader } from './ModernStatsHeader';
import { MasonryGrid } from './MasonryGrid';
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
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  const translations = {
    en: {
      title: "AI Agent Manager",
      subtitle: "Activate and manage your specialized AI agents with advanced filtering and search capabilities",
      loading: "Loading agent management...",
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
      subtitle: "Activa y gestiona tus agentes IA especializados con filtros avanzados y capacidades de búsqueda",
      loading: "Cargando gestión de agentes...",
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

  // Get unique categories
  const categories = useMemo(() => {
    return [...new Set(culturalAgentsDatabase.map(agent => agent.category))];
  }, []);

  // Group agents by category with filtering and sorting
  const filteredAndGroupedAgents = useMemo(() => {
    let filteredAgents = culturalAgentsDatabase;

    // Search filter
    if (searchTerm) {
      filteredAgents = filteredAgents.filter(agent =>
        agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agent.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agent.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategories.length > 0) {
      filteredAgents = filteredAgents.filter(agent =>
        selectedCategories.includes(agent.category)
      );
    }

    // Status filter
    if (selectedStatus !== 'all') {
      filteredAgents = filteredAgents.filter(agent => {
        const userAgent = getUserAgentData(agent.id);
        const isEnabled = userAgent?.is_enabled || false;
        const isRecommended = isAgentRecommended(agent.id);
        
        switch (selectedStatus) {
          case 'active': return isEnabled;
          case 'inactive': return !isEnabled;
          case 'recommended': return isRecommended;
          default: return true;
        }
      });
    }

    // Priority filter
    if (selectedPriority !== 'all') {
      filteredAgents = filteredAgents.filter(agent => agent.priority === selectedPriority);
    }

    // Sort agents
    filteredAgents = [...filteredAgents].sort((a, b) => {
      switch (sortBy) {
        case 'usage':
          const usageA = getUserAgentData(a.id)?.usage_count || 0;
          const usageB = getUserAgentData(b.id)?.usage_count || 0;
          return usageB - usageA;
        case 'impact':
          return b.impact - a.impact;
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

    // Group by category
    return filteredAgents.reduce((groups, agent) => {
      if (!groups[agent.category]) {
        groups[agent.category] = [];
      }
      groups[agent.category].push(agent);
      return groups;
    }, {} as Record<string, CulturalAgent[]>);
  }, [searchTerm, selectedCategories, selectedStatus, selectedPriority, sortBy, userAgents]);

  // Calculate stats
  const totalAgents = culturalAgentsDatabase.length;
  const activeAgents = userAgents.filter(ua => ua.is_enabled).length;
  const recommendedAgents = culturalAgentsDatabase.filter(agent => 
    isAgentRecommended(agent.id)
  ).length;

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

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategories([]);
    setSelectedStatus('all');
    setSelectedPriority('all');
    setSortBy('name');
  };

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
        totalAgents={totalAgents}
        activeAgents={activeAgents}
        recommendedAgents={recommendedAgents}
        language={language}
      />

      {/* Filters */}
      <AgentFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedCategories={selectedCategories}
        onCategoryChange={setSelectedCategories}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        selectedPriority={selectedPriority}
        onPriorityChange={setSelectedPriority}
        sortBy={sortBy}
        onSortChange={setSortBy}
        onClearFilters={handleClearFilters}
        language={language}
        categories={categories}
      />

      {/* Masonry Grid Layout */}
      <MasonryGrid>
        {Object.entries(filteredAndGroupedAgents).map(([category, agents]) => {
          const categoryActiveCount = agents.filter(agent => 
            getUserAgentData(agent.id)?.is_enabled
          ).length;
          
          const categoryRecommendedCount = agents.filter(agent => 
            isAgentRecommended(agent.id)
          ).length;

          return (
            <div key={category} className="masonry-item">
              <AgentCategoryCard
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
            </div>
          );
        })}
      </MasonryGrid>

      {/* Empty state */}
      {Object.keys(filteredAndGroupedAgents).length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🔍</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No agents found</h3>
          <p className="text-gray-600 mb-4">Try adjusting your filters or search terms</p>
          <button
            onClick={handleClearFilters}
            className="text-purple-600 hover:text-purple-800 font-medium"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
};
