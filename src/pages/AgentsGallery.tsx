
import React, { useState, useMemo } from 'react';
import { culturalAgentsDatabase } from '@/data/agentsDatabase';
import { useLanguage } from '@/context/LanguageContext';
import { AgentsGalleryHeader } from '@/components/agents-gallery/AgentsGalleryHeader';
import { AgentsFiltersBar } from '@/components/agents-gallery/AgentsFiltersBar';
import { AgentsGridView } from '@/components/agents-gallery/AgentsGridView';
import { AgentsListView } from '@/components/agents-gallery/AgentsListView';
import { AgentsEmptyState } from '@/components/agents-gallery/AgentsEmptyState';

const AgentsGallery = () => {
  const { language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const translations = {
    en: {
      title: "Complete AI Agents Collection",
      subtitle: "Discover our comprehensive suite of 20 specialized AI agents designed to transform your creative business operations",
      search: "Search agents...",
      allCategories: "All Categories",
      viewGrid: "Grid View",
      viewList: "List View",
      backToDashboard: "Back to Dashboard",
      priority: "Priority",
      impact: "Impact",
      agentsFound: "agents found",
      noAgentsTitle: "No agents found",
      noAgentsDesc: "Try adjusting your search or filters",
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
      title: "Colección Completa de Agentes IA",
      subtitle: "Descubre nuestra suite integral de 20 agentes de IA especializados diseñados para transformar las operaciones de tu negocio creativo",
      search: "Buscar agentes...",
      allCategories: "Todas las Categorías",
      viewGrid: "Vista de Cuadrícula",
      viewList: "Vista de Lista",
      backToDashboard: "Volver al Dashboard",
      priority: "Prioridad",
      impact: "Impacto",
      agentsFound: "agentes encontrados",
      noAgentsTitle: "No se encontraron agentes",
      noAgentsDesc: "Intenta ajustar tu búsqueda o filtros",
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

  // Filter agents
  const filteredAgents = useMemo(() => {
    let filtered = culturalAgentsDatabase;

    if (searchTerm) {
      filtered = filtered.filter(agent =>
        agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agent.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agent.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(agent => agent.category === selectedCategory);
    }

    return filtered;
  }, [searchTerm, selectedCategory]);

  const agentTranslations = {
    priority: t.priority,
    impact: t.impact,
    categories: t.categories
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <AgentsGalleryHeader
        title={t.title}
        subtitle={t.subtitle}
        backToDashboard={t.backToDashboard}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AgentsFiltersBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          categories={categories}
          categoryTranslations={t.categories}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          translations={{
            search: t.search,
            allCategories: t.allCategories,
            viewGrid: t.viewGrid,
            viewList: t.viewList
          }}
        />

        {/* Results Count */}
        <div className="mb-8">
          <p className="text-lg text-gray-600 font-medium">
            {filteredAgents.length} {t.agentsFound}
          </p>
        </div>

        {/* Agents Display */}
        {filteredAgents.length > 0 ? (
          viewMode === 'grid' ? (
            <AgentsGridView
              agents={filteredAgents}
              translations={agentTranslations}
            />
          ) : (
            <AgentsListView
              agents={filteredAgents}
              translations={agentTranslations}
            />
          )
        ) : (
          <AgentsEmptyState
            title={t.noAgentsTitle}
            description={t.noAgentsDesc}
          />
        )}
      </div>
    </div>
  );
};

export default AgentsGallery;
