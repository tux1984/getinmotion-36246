
import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { SEOHead } from '@/components/seo/SEOHead';
import { SEO_CONFIG } from '@/config/seo';
import { AgentsGalleryHeader } from '@/components/agents-gallery/AgentsGalleryHeader';
import { AgentsSearchAndFilters } from '@/components/agents-gallery/AgentsSearchAndFilters';
import { AgentsGridView } from '@/components/agents-gallery/AgentsGridView';
import { AgentsEmptyState } from '@/components/agents-gallery/AgentsEmptyState';
import { useAgentFilters } from '@/hooks/useAgentFilters';
import { culturalAgentsDatabase } from '@/data/agentsDatabase';

const AgentsGallery = () => {
  const { language } = useLanguage();
  
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Mock function for user agent data since this is a public page
  const getUserAgentData = (agentId: string) => null;

  const {
    filters,
    updateFilter,
    clearFilters,
    filteredAndGroupedAgents
  } = useAgentFilters(culturalAgentsDatabase, getUserAgentData);

  const seoData = SEO_CONFIG.pages.agents[language];

  const translations = {
    en: {
      backToHome: "Back to Home",
      backToDashboard: "Back to Dashboard",
      title: "AI Agents Gallery",
      subtitle: "Discover specialized agents for your cultural business",
      search: "Search agents...",
      allCategories: "All Categories",
      allPriorities: "All Priorities", 
      allImpacts: "All Impacts",
      clearFilters: "Clear Filters",
      priority: "Priority",
      impact: "Impact",
      noAgentsTitle: "No agents found",
      noAgentsDescription: "Try adjusting your search criteria or clear the filters",
      categories: {
        legal: "Legal",
        accounting: "Accounting", 
        marketing: "Marketing",
        sales: "Sales",
        production: "Production",
        strategy: "Strategy"
      },
      exampleQuestion: "Example Question",
      exampleAnswer: "Example Answer"
    },
    es: {
      backToHome: "Volver al Inicio",
      backToDashboard: "Volver al Dashboard",
      title: "Galería de Agentes IA",
      subtitle: "Descubre agentes especializados para tu negocio cultural",
      search: "Buscar agentes...",
      allCategories: "Todas las Categorías",
      allPriorities: "Todas las Prioridades",
      allImpacts: "Todos los Impactos", 
      clearFilters: "Limpiar Filtros",
      priority: "Prioridad",
      impact: "Impacto",
      noAgentsTitle: "No se encontraron agentes",
      noAgentsDescription: "Intenta ajustar tus criterios de búsqueda o limpia los filtros",
      categories: {
        legal: "Legal",
        accounting: "Contabilidad",
        marketing: "Marketing", 
        sales: "Ventas",
        production: "Producción",
        strategy: "Estrategia"
      },
      exampleQuestion: "Pregunta de Ejemplo",
      exampleAnswer: "Respuesta de Ejemplo"
    }
  };

  const t = translations[language];

  // Convert grouped agents to flat array for display
  const flatAgents = Object.values(filteredAndGroupedAgents).flat();

  // Get unique categories from the database
  const categories = [...new Set(culturalAgentsDatabase.map(agent => agent.category))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      <SEOHead
        title={seoData.title}
        description={seoData.description}
        keywords={seoData.keywords}
        url={`${SEO_CONFIG.siteUrl}/agents`}
        type="website"
      />

      {/* Navigation Header */}
      <div className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/">
              <Button variant="ghost" className="text-slate-600 hover:text-slate-900">
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t.backToHome}
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <AgentsGalleryHeader 
          title={t.title}
          subtitle={t.subtitle}
          backToDashboard={t.backToDashboard}
        />
        
        <AgentsSearchAndFilters
          searchTerm={filters.searchTerm}
          onSearchChange={(value) => updateFilter('searchTerm', value)}
          selectedCategory={filters.selectedCategories.length > 0 ? filters.selectedCategories[0] : null}
          onCategoryChange={(value) => updateFilter('selectedCategories', value ? [value] : [])}
          selectedPriority={filters.selectedPriority === 'all' ? null : filters.selectedPriority}
          onPriorityChange={(value) => updateFilter('selectedPriority', value || 'all')}
          selectedImpact={filters.selectedImpact === 'all' ? null : filters.selectedImpact}
          onImpactChange={(value) => updateFilter('selectedImpact', value || 'all')}
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

        {flatAgents.length === 0 ? (
          <AgentsEmptyState 
            title={t.noAgentsTitle}
            description={t.noAgentsDescription}
          />
        ) : (
          <AgentsGridView 
            agents={flatAgents}
            translations={{
              priority: t.priority,
              impact: t.impact,
              categories: t.categories,
              exampleQuestion: t.exampleQuestion,
              exampleAnswer: t.exampleAnswer
            }}
          />
        )}
      </div>
    </div>
  );
};

export default AgentsGallery;
