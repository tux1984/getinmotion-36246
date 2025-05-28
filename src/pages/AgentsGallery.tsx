
import React, { useState, useMemo } from 'react';
import { culturalAgentsDatabase } from '@/data/agentsDatabase';
import { useLanguage } from '@/context/LanguageContext';
import { Search, Filter, Grid3X3, List, ArrowLeft, Zap, Target, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

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
      description: "Description",
      category: "Category",
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
      description: "Descripción",
      category: "Categoría",
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

  const getImpactIcon = (impact: number) => {
    switch (impact) {
      case 4: return <Star className="w-4 h-4 text-yellow-500" />;
      case 3: return <Target className="w-4 h-4 text-green-500" />;
      case 2: return <Zap className="w-4 h-4 text-blue-500" />;
      default: return <div className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'Financiera': 'bg-green-50 text-green-700 border-green-200',
      'Legal': 'bg-blue-50 text-blue-700 border-blue-200',
      'Diagnóstico': 'bg-purple-50 text-purple-700 border-purple-200',
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center gap-4 mb-8">
            <Link to="/dashboard">
              <Button variant="ghost" className="text-white hover:bg-white/10">
                <ArrowLeft className="w-5 h-5 mr-2" />
                {t.backToDashboard}
              </Button>
            </Link>
          </div>
          
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-200">
              {t.title}
            </h1>
            <p className="text-xl md:text-2xl text-indigo-200 max-w-4xl mx-auto leading-relaxed">
              {t.subtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="mb-8 shadow-lg border-0">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder={t.search}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white border-purple-200 focus:border-purple-400"
                />
              </div>

              {/* Category Filter */}
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant={selectedCategory === null ? "default" : "outline"}
                  className="cursor-pointer hover:scale-105 transition-transform"
                  onClick={() => setSelectedCategory(null)}
                >
                  {t.allCategories}
                </Badge>
                {categories.map(category => (
                  <Badge
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    className="cursor-pointer hover:scale-105 transition-transform"
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
                  className="transition-all"
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="transition-all"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Count */}
        <div className="mb-8">
          <p className="text-lg text-gray-600 font-medium">
            {filteredAgents.length} {t.agentsFound}
          </p>
        </div>

        {/* Agents Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredAgents.map((agent) => (
              <Card
                key={agent.id}
                className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-lg overflow-hidden"
              >
                <CardContent className="p-0">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <span className="text-3xl">{agent.icon}</span>
                      </div>
                      <Badge className={getCategoryColor(agent.category)}>
                        {t.categories[agent.category as keyof typeof t.categories] || agent.category}
                      </Badge>
                    </div>
                    
                    <h3 className="font-bold text-lg text-gray-900 mb-3 line-clamp-2">{agent.name}</h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-3">{agent.description}</p>
                    
                    <div className="flex gap-2">
                      <Badge className={getPriorityColor(agent.priority)}>
                        {t.priority}: {agent.priority}
                      </Badge>
                      <Badge variant="outline" className="flex items-center gap-1">
                        {getImpactIcon(agent.impact)}
                        {t.impact}: {agent.impact}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {filteredAgents.map((agent) => (
              <Card
                key={agent.id}
                className="hover:shadow-lg transition-shadow border-0 shadow-md"
              >
                <CardContent className="p-8">
                  <div className="flex items-start gap-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <span className="text-4xl">{agent.icon}</span>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-xl font-bold text-gray-900">{agent.name}</h3>
                        <Badge className={getCategoryColor(agent.category)}>
                          {t.categories[agent.category as keyof typeof t.categories] || agent.category}
                        </Badge>
                      </div>
                      
                      <p className="text-gray-600 mb-4">{agent.description}</p>
                      
                      <div className="flex gap-3">
                        <Badge className={getPriorityColor(agent.priority)}>
                          {t.priority}: {agent.priority}
                        </Badge>
                        <Badge variant="outline" className="flex items-center gap-1">
                          {getImpactIcon(agent.impact)}
                          {t.impact}: {agent.impact}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {filteredAgents.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">{t.noAgentsTitle}</h3>
            <p className="text-lg text-gray-600">{t.noAgentsDesc}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentsGallery;
