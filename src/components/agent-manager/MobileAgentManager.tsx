
import React, { useState } from 'react';
import { Agent } from '@/types/dashboard';
import { culturalAgentsDatabase } from '@/data/agentsDatabase';
import { useUserData } from '@/hooks/useUserData';
import { useAgentFilters } from '@/hooks/useAgentFilters';
import { useAgentToggle } from '@/hooks/useAgentToggle';
import { OptimizedAgentCategoryCard } from '../dashboard/OptimizedAgentCategoryCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Search, Filter, X, Users, Target, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { isAgentRecommended } from '@/utils/agentUtils';

interface MobileAgentManagerProps {
  currentAgents: Agent[];
  onAgentToggle: (agentId: string, enabled: boolean) => Promise<void>;
  language: 'en' | 'es';
}

export const MobileAgentManager: React.FC<MobileAgentManagerProps> = ({
  currentAgents,
  onAgentToggle,
  language
}) => {
  const { agents: userAgents, loading } = useUserData();
  const { togglingAgents, handleToggleAgent } = useAgentToggle(onAgentToggle);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const translations = {
    en: {
      title: "AI Agent Manager",
      subtitle: "Activate and manage your AI agents",
      search: "Search agents...",
      filters: "Filters",
      clearFilters: "Clear filters",
      totalAgents: "Total",
      activeAgents: "Active",
      recommendedAgents: "Recommended",
      all: "All",
      active: "Active Only",
      inactive: "Inactive Only",
      categories: "Categories",
      noAgentsFound: "No agents found",
      tryAdjusting: "Try adjusting your filters"
    },
    es: {
      title: "Gestor de Agentes IA",
      subtitle: "Activa y gestiona tus agentes IA",
      search: "Buscar agentes...",
      filters: "Filtros",
      clearFilters: "Limpiar filtros",
      totalAgents: "Total",
      activeAgents: "Activos",
      recommendedAgents: "Recomendados",
      all: "Todos",
      active: "Solo Activos",
      inactive: "Solo Inactivos",
      categories: "Categorías",
      noAgentsFound: "No se encontraron agentes",
      tryAdjusting: "Intenta ajustar tus filtros"
    }
  };

  const t = translations[language];

  // Get unique categories
  const categories = [...new Set(culturalAgentsDatabase.map(agent => agent.category))];

  // Get user agent data for each agent
  const getUserAgentData = (agentId: string) => {
    return userAgents.find(ua => ua.agent_id === agentId);
  };

  // Calculate stats
  const stats = {
    totalAgents: culturalAgentsDatabase.length,
    activeAgents: userAgents.filter(ua => ua.is_enabled).length,
    recommendedAgents: culturalAgentsDatabase.filter(agent => 
      isAgentRecommended(agent.id)
    ).length
  };

  // Use filters
  const {
    filters,
    updateFilter,
    clearFilters,
    toggleCategory,
    filteredAndGroupedAgents,
    hasActiveFilters
  } = useAgentFilters(culturalAgentsDatabase, getUserAgentData);

  const statusOptions = [
    { value: 'all', label: t.all },
    { value: 'active', label: t.active },
    { value: 'inactive', label: t.inactive }
  ];

  const categoryTranslations = {
    en: {
      'Financiera': 'Financial',
      'Legal': 'Legal',
      'Diagnóstico': 'Diagnostic',
      'Comercial': 'Commercial',
      'Operativo': 'Operational',
      'Comunidad': 'Community'
    },
    es: {
      'Financiera': 'Financiera',
      'Legal': 'Legal',
      'Diagnóstico': 'Diagnóstico',
      'Comercial': 'Comercial',
      'Operativo': 'Operativo',
      'Comunidad': 'Comunidad'
    }
  };

  const FilterContent = () => (
    <div className="space-y-6 p-1">
      {/* Status Filters */}
      <div>
        <h4 className="font-medium text-white mb-3">Estado</h4>
        <div className="space-y-2">
          {statusOptions.map((option) => (
            <Button
              key={option.value}
              variant={filters.selectedStatus === option.value ? "default" : "ghost"}
              size="sm"
              onClick={() => updateFilter('selectedStatus', option.value as any)}
              className="w-full justify-start text-white hover:bg-white/10"
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Category Filters */}
      <div>
        <h4 className="font-medium text-white mb-3">{t.categories}</h4>
        <div className="space-y-2">
          {categories.map(category => {
            const translatedCategory = categoryTranslations[language][category as keyof typeof categoryTranslations[typeof language]] || category;
            return (
              <Badge
                key={category}
                variant={filters.selectedCategories.includes(category) ? "default" : "outline"}
                className={`cursor-pointer transition-all w-full justify-center py-2 ${
                  filters.selectedCategories.includes(category)
                    ? 'bg-purple-600 text-white hover:bg-purple-700 border-purple-500'
                    : 'hover:bg-purple-50/10 text-purple-200 border-purple-300/50 hover:border-purple-300'
                }`}
                onClick={() => toggleCategory(category)}
              >
                {translatedCategory}
              </Badge>
            );
          })}
        </div>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            clearFilters();
            setIsFilterOpen(false);
          }}
          className="w-full text-red-400 hover:text-red-300 hover:bg-red-950/20"
        >
          <X className="w-4 h-4 mr-2" />
          {t.clearFilters}
        </Button>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-white/60">Cargando agentes...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Mobile Header */}
      <motion.div 
        className="text-center py-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold text-white mb-2">{t.title}</h1>
        <p className="text-white/80 text-sm">{t.subtitle}</p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-white/10 backdrop-blur-xl rounded-xl p-3 text-center border border-white/20">
          <div className="flex items-center justify-center mb-1">
            <Users className="w-4 h-4 text-blue-400 mr-1" />
          </div>
          <div className="text-lg font-bold text-white">{stats.totalAgents}</div>
          <div className="text-xs text-white/60">{t.totalAgents}</div>
        </div>
        <div className="bg-white/10 backdrop-blur-xl rounded-xl p-3 text-center border border-white/20">
          <div className="flex items-center justify-center mb-1">
            <Target className="w-4 h-4 text-green-400 mr-1" />
          </div>
          <div className="text-lg font-bold text-white">{stats.activeAgents}</div>
          <div className="text-xs text-white/60">{t.activeAgents}</div>
        </div>
        <div className="bg-white/10 backdrop-blur-xl rounded-xl p-3 text-center border border-white/20">
          <div className="flex items-center justify-center mb-1">
            <Zap className="w-4 h-4 text-yellow-400 mr-1" />
          </div>
          <div className="text-lg font-bold text-white">{stats.recommendedAgents}</div>
          <div className="text-xs text-white/60">{t.recommendedAgents}</div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="sticky top-0 z-10 bg-gradient-to-r from-purple-900/80 to-indigo-900/80 backdrop-blur-xl p-4 rounded-xl border border-white/20 mb-4">
        <div className="flex gap-3">
          {/* Search Input */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
            <Input
              placeholder={t.search}
              value={filters.searchTerm}
              onChange={(e) => updateFilter('searchTerm', e.target.value)}
              className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-purple-400 h-10"
            />
          </div>

          {/* Filter Button */}
          <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={`bg-white/10 border border-white/20 text-white hover:bg-white/20 h-10 w-10 ${hasActiveFilters ? 'bg-purple-600/50' : ''}`}
              >
                <Filter className="w-4 h-4" />
                {hasActiveFilters && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-purple-400 rounded-full"></div>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-gradient-to-b from-purple-900 to-indigo-900 border-white/20">
              <SheetHeader>
                <SheetTitle className="text-white">{t.filters}</SheetTitle>
              </SheetHeader>
              <FilterContent />
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Agents Grid */}
      {Object.keys(filteredAndGroupedAgents).length > 0 ? (
        <div className="space-y-4">
          {Object.entries(filteredAndGroupedAgents).map(([category, agents]) => {
            const categoryActiveCount = agents.filter(agent => {
              const userAgentData = getUserAgentData(agent.id);
              return Boolean(userAgentData?.is_enabled);
            }).length;
            
            const categoryRecommendedCount = agents.filter(agent => 
              isAgentRecommended(agent.id)
            ).length;

            return (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6"
              >
                <OptimizedAgentCategoryCard
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
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-white/40" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">{t.noAgentsFound}</h3>
          <p className="text-white/60 mb-4">{t.tryAdjusting}</p>
          <Button
            onClick={clearFilters}
            variant="ghost"
            className="text-purple-300 hover:text-white hover:bg-white/10"
          >
            {t.clearFilters}
          </Button>
        </div>
      )}
    </div>
  );
};
