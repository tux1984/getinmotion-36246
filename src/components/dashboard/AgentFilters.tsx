
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, X, Zap, Circle, CheckCircle, AlertCircle } from 'lucide-react';

interface AgentFiltersProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedCategories: string[];
  onCategoryChange: (categories: string[]) => void;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  selectedPriority: string;
  onPriorityChange: (priority: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  onClearFilters: () => void;
  language: 'en' | 'es';
  categories: string[];
}

export const AgentFilters: React.FC<AgentFiltersProps> = ({
  searchTerm,
  onSearchChange,
  selectedCategories,
  onCategoryChange,
  selectedStatus,
  onStatusChange,
  selectedPriority,
  onPriorityChange,
  sortBy,
  onSortChange,
  onClearFilters,
  language,
  categories
}) => {
  const translations = {
    en: {
      search: "Search agents...",
      category: "Category",
      status: "Status",
      priority: "Priority",
      sortBy: "Sort by",
      clearFilters: "Clear filters",
      all: "All",
      active: "Active",
      inactive: "Inactive",
      recommended: "Recommended",
      high: "High",
      medium: "Medium",
      low: "Low",
      name: "Name",
      usage: "Usage",
      impact: "Impact",
      allCategories: "All categories"
    },
    es: {
      search: "Buscar agentes...",
      category: "Categoría",
      status: "Estado",
      priority: "Prioridad",
      sortBy: "Ordenar por",
      clearFilters: "Limpiar filtros",
      all: "Todos",
      active: "Activos",
      inactive: "Inactivos",
      recommended: "Recomendados",
      high: "Alta",
      medium: "Media",
      low: "Baja",
      name: "Nombre",
      usage: "Uso",
      impact: "Impacto",
      allCategories: "Todas las categorías"
    }
  };

  const t = translations[language];

  const handleCategoryToggle = (category: string) => {
    if (selectedCategories.includes(category)) {
      onCategoryChange(selectedCategories.filter(c => c !== category));
    } else {
      onCategoryChange([...selectedCategories, category]);
    }
  };

  const hasActiveFilters = searchTerm || selectedCategories.length > 0 || selectedStatus !== 'all' || selectedPriority !== 'all' || sortBy !== 'name';

  return (
    <div className="space-y-4 mb-6">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder={t.search}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 bg-white/70 backdrop-blur-sm border-purple-200 focus:border-purple-400"
        />
      </div>

      {/* Filters Row */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-purple-600" />
          <span className="text-sm font-medium text-gray-700">Filtros:</span>
        </div>

        {/* Category Multi-Select */}
        <div className="flex flex-wrap gap-1">
          {categories.map(category => (
            <Badge
              key={category}
              variant={selectedCategories.includes(category) ? "default" : "outline"}
              className={`cursor-pointer transition-all ${
                selectedCategories.includes(category)
                  ? 'bg-purple-600 text-white hover:bg-purple-700'
                  : 'hover:bg-purple-50 text-gray-600'
              }`}
              onClick={() => handleCategoryToggle(category)}
            >
              {category}
            </Badge>
          ))}
        </div>

        {/* Status Filter */}
        <Select value={selectedStatus} onValueChange={onStatusChange}>
          <SelectTrigger className="w-32 bg-white/70 border-purple-200">
            <div className="flex items-center gap-2">
              {selectedStatus === 'active' && <CheckCircle className="w-3 h-3 text-green-500" />}
              {selectedStatus === 'inactive' && <Circle className="w-3 h-3 text-gray-400" />}
              {selectedStatus === 'recommended' && <Zap className="w-3 h-3 text-yellow-500" />}
              <SelectValue />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t.all}</SelectItem>
            <SelectItem value="active">{t.active}</SelectItem>
            <SelectItem value="inactive">{t.inactive}</SelectItem>
            <SelectItem value="recommended">{t.recommended}</SelectItem>
          </SelectContent>
        </Select>

        {/* Priority Filter */}
        <Select value={selectedPriority} onValueChange={onPriorityChange}>
          <SelectTrigger className="w-32 bg-white/70 border-purple-200">
            <div className="flex items-center gap-2">
              {selectedPriority === 'Alta' && <AlertCircle className="w-3 h-3 text-red-500" />}
              <SelectValue placeholder={t.priority} />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t.all}</SelectItem>
            <SelectItem value="Alta">{t.high}</SelectItem>
            <SelectItem value="Media">{t.medium}</SelectItem>
            <SelectItem value="Baja">{t.low}</SelectItem>
          </SelectContent>
        </Select>

        {/* Sort Filter */}
        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger className="w-36 bg-white/70 border-purple-200">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">{t.name}</SelectItem>
            <SelectItem value="usage">{t.usage}</SelectItem>
            <SelectItem value="impact">{t.impact}</SelectItem>
          </SelectContent>
        </Select>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="text-gray-600 hover:text-gray-800"
          >
            <X className="w-4 h-4 mr-1" />
            {t.clearFilters}
          </Button>
        )}
      </div>
    </div>
  );
};
