
import React, { useState, useMemo } from 'react';
import { culturalAgentsDatabase } from '@/data/agentsDatabase';
import { useLanguage } from '@/context/LanguageContext';
import { Search, Filter, Grid3X3, List, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const AgentsGallery = () => {
  const { language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const translations = {
    en: {
      title: "Back Office Agents for Every Need",
      subtitle: "Discover our complete collection of 20 specialized AI agents designed to optimize your creative business operations",
      search: "Search agents...",
      allCategories: "All Categories",
      viewGrid: "Grid View",
      viewList: "List View",
      backToDashboard: "Back to Dashboard",
      priority: "Priority",
      impact: "Impact",
      description: "Description",
      category: "Category",
      agentsFound: "agents found",
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
      title: "Agentes de Back Office para Cada Necesidad",
      subtitle: "Descubre nuestra colección completa de 20 agentes de IA especializados diseñados para optimizar las operaciones de tu negocio creativo",
      search: "Buscar agentes...",
      allCategories: "Todas las Categorías",
      viewGrid: "Vista de Cuadrícula",
      viewList: "Vista de Lista",
      backToDashboard: "Volver al Dashboard",
      priority: "Prioridad",
      impact: "Impacto",
      description: "Descripción",
      category: "Categoría",
      agentsFound: "agentes encontrados",
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Alta': return 'bg-red-50 text-red-700 border-red-200';
      case 'Media-Alta': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'Media': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'Baja': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Muy Baja': return 'bg-gray-50 text-gray-700 border-gray-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getImpactColor = (impact: number) => {
    switch (impact) {
      case 4: return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 3: return 'bg-green-50 text-green-700 border-green-200';
      case 2: return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 1: return 'bg-gray-50 text-gray-700 border-gray-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'Financiera': 'bg-purple-50 text-purple-700 border-purple-200',
      'Legal': 'bg-blue-50 text-blue-700 border-blue-200',
      'Diagnóstico': 'bg-green-50 text-green-700 border-green-200',
      'Comercial': 'bg-orange-50 text-orange-700 border-orange-200',
      'Operativo': 'bg-pink-50 text-pink-700 border-pink-200',
      'Comunidad': 'bg-indigo-50 text-indigo-700 border-indigo-200'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-50 text-gray-700 border-gray-200';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-4 mb-6">
            <Link to="/dashboard">
              <Button variant="ghost" className="text-white hover:bg-white/10">
                <ArrowLeft className="w-5 h-5 mr-2" />
                {t.backToDashboard}
              </Button>
            </Link>
          </div>
          
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-200">
              {t.title}
            </h1>
            <p className="text-xl text-indigo-200 max-w-3xl mx-auto leading-relaxed">
              {t.subtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder={t.search}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            <Badge
              variant={selectedCategory === null ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setSelectedCategory(null)}
            >
              {t.allCategories}
            </Badge>
            {categories.map(category => (
              <Badge
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setSelectedCategory(category)}
              >
                {t.categories[category as keyof typeof t.categories] || category}
              </Badge>
            ))}
          </div>

          {/* View Mode */}
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'grid' ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            {filteredAgents.length} {t.agentsFound}
          </p>
        </div>

        {/* Agents Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAgents.map((agent) => (
              <div
                key={agent.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">{agent.icon}</span>
                  </div>
                  <Badge className={getCategoryColor(agent.category)}>
                    {t.categories[agent.category as keyof typeof t.categories] || agent.category}
                  </Badge>
                </div>
                
                <h3 className="font-semibold text-gray-900 mb-2">{agent.name}</h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">{agent.description}</p>
                
                <div className="flex gap-2 mb-4">
                  <Badge className={getPriorityColor(agent.priority)}>
                    {t.priority}: {agent.priority}
                  </Badge>
                  <Badge className={getImpactColor(agent.impact)}>
                    {t.impact}: {agent.impact}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAgents.map((agent) => (
              <div
                key={agent.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-3xl">{agent.icon}</span>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{agent.name}</h3>
                      <Badge className={getCategoryColor(agent.category)}>
                        {t.categories[agent.category as keyof typeof t.categories] || agent.category}
                      </Badge>
                    </div>
                    
                    <p className="text-gray-600 mb-3">{agent.description}</p>
                    
                    <div className="flex gap-2">
                      <Badge className={getPriorityColor(agent.priority)}>
                        {t.priority}: {agent.priority}
                      </Badge>
                      <Badge className={getImpactColor(agent.impact)}>
                        {t.impact}: {agent.impact}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredAgents.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No se encontraron agentes</h3>
            <p className="text-gray-600">Intenta ajustar tu búsqueda o filtros</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentsGallery;
