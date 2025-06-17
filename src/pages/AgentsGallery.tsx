
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

const AgentsGallery = () => {
  const { language } = useLanguage();
  
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const {
    filters,
    updateFilter,
    clearFilters,
    filteredAndGroupedAgents
  } = useAgentFilters();

  const seoData = SEO_CONFIG.pages.agents[language];

  const translations = {
    en: {
      backToHome: "Back to Home",
      title: "AI Agents Gallery",
      subtitle: "Discover specialized agents for your cultural business"
    },
    es: {
      backToHome: "Volver al Inicio",
      title: "Galería de Agentes IA",
      subtitle: "Descubre agentes especializados para tu negocio cultural"
    }
  };

  const t = translations[language];

  // Convert grouped agents to flat array for display
  const flatAgents = Object.values(filteredAndGroupedAgents).flat();

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
        />
        
        <AgentsSearchAndFilters
          searchTerm={filters.searchTerm}
          onSearchChange={(value) => updateFilter('searchTerm', value)}
          selectedCategory={filters.category}
          onCategoryChange={(value) => updateFilter('category', value)}
          sortBy={filters.sortBy}
          onSortChange={(value) => updateFilter('sortBy', value)}
          language={language}
        />

        {flatAgents.length === 0 ? (
          <AgentsEmptyState 
            language={language}
            onClearFilters={clearFilters}
          />
        ) : (
          <AgentsGridView 
            agents={flatAgents}
            language={language}
          />
        )}
      </div>
    </div>
  );
};

export default AgentsGallery;
