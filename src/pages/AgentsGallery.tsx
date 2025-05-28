
import React, { useState, useMemo } from 'react';
import { culturalAgentsDatabase } from '@/data/agentsDatabase';
import { useLanguage } from '@/context/LanguageContext';
import { Header } from '@/components/layout/Header';
import { CompactAgentCard } from '@/components/agents-gallery/CompactAgentCard';
import { CompactAgentsGalleryHeader } from '@/components/agents-gallery/CompactAgentsGalleryHeader';
import { AgentsSearchAndFilters } from '@/components/agents-gallery/AgentsSearchAndFilters';
import { AgentsEmptyState } from '@/components/agents-gallery/AgentsEmptyState';

const AgentsGallery = () => {
  const { language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedPriority, setSelectedPriority] = useState<string | null>(null);
  const [selectedImpact, setSelectedImpact] = useState<number | null>(null);

  const translations = {
    en: {
      title: "AI Agents Collection",
      subtitle: "Discover our comprehensive suite of specialized AI agents designed to transform your creative business operations",
      navAgents: "Agents",
      navAccess: "Get Access",
      navLogin: "Login",
      backToDashboard: "Back to Dashboard",
      search: "Search agents by name, category, or description...",
      allCategories: "All Categories",
      allPriorities: "All Priorities",
      allImpacts: "All Impacts",
      clearFilters: "Clear Filters",
      priority: "Priority",
      impact: "Impact",
      exampleQuestion: "Example Question",
      exampleAnswer: "Example Answer",
      noResults: "No agents found",
      noResultsDescription: "Try adjusting your search or filters to find what you're looking for.",
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
      title: "Colección de Agentes IA",
      subtitle: "Descubre nuestra suite integral de agentes de IA especializados diseñados para transformar las operaciones de tu negocio creativo",
      navAgents: "Agentes",
      navAccess: "Obtener Acceso",
      navLogin: "Iniciar Sesión",
      backToDashboard: "Volver al Dashboard",
      search: "Buscar agentes por nombre, categoría o descripción...",
      allCategories: "Todas las Categorías",
      allPriorities: "Todas las Prioridades",
      allImpacts: "Todos los Impactos",
      clearFilters: "Limpiar Filtros",
      priority: "Prioridad",
      impact: "Impacto",
      exampleQuestion: "Pregunta Ejemplo",
      exampleAnswer: "Respuesta Ejemplo",
      noResults: "No se encontraron agentes",
      noResultsDescription: "Intenta ajustar tu búsqueda o filtros para encontrar lo que buscas.",
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

  // Get unique categories from agents
  const categories = useMemo(() => {
    return Array.from(new Set(culturalAgentsDatabase.map(agent => agent.category)));
  }, []);

  // Filter agents based on search and filters
  const filteredAgents = useMemo(() => {
    return culturalAgentsDatabase.filter(agent => {
      // Search filter
      const searchMatch = !searchTerm || 
        agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agent.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agent.category.toLowerCase().includes(searchTerm.toLowerCase());

      // Category filter
      const categoryMatch = !selectedCategory || agent.category === selectedCategory;

      // Priority filter
      const priorityMatch = !selectedPriority || agent.priority === selectedPriority;

      // Impact filter
      const impactMatch = !selectedImpact || agent.impact === selectedImpact;

      return searchMatch && categoryMatch && priorityMatch && impactMatch;
    });
  }, [searchTerm, selectedCategory, selectedPriority, selectedImpact]);

  const agentTranslations = {
    priority: t.priority,
    impact: t.impact,
    exampleQuestion: t.exampleQuestion,
    exampleAnswer: t.exampleAnswer,
    categories: t.categories
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      {/* Header */}
      <Header 
        translations={{
          navAgents: t.navAgents,
          navAccess: t.navAccess,
          navLogin: t.navLogin
        }}
        onAccessClick={() => {}}
      />

      {/* Compact Hero Section */}
      <CompactAgentsGalleryHeader
        title={t.title}
        subtitle={t.subtitle}
        backToDashboard={t.backToDashboard}
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <AgentsSearchAndFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          selectedPriority={selectedPriority}
          onPriorityChange={setSelectedPriority}
          selectedImpact={selectedImpact}
          onImpactChange={setSelectedImpact}
          categories={categories}
          categoryTranslations={t.categories}
          translations={{
            search: t.search,
            allCategories: t.allCategories,
            allPriorities: t.allPriorities,
            allImpacts: t.allImpacts,
            clearFilters: t.clearFilters,
            priority: t.priority,
            impact: t.impact
          }}
        />

        {/* Results */}
        {filteredAgents.length === 0 ? (
          <AgentsEmptyState
            title={t.noResults}
            description={t.noResultsDescription}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredAgents.map((agent) => (
              <CompactAgentCard
                key={agent.id}
                agent={agent}
                translations={agentTranslations}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentsGallery;
