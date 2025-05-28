
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, X, Zap, Circle, CheckCircle, AlertCircle } from 'lucide-react';
import { AgentFilter } from '@/types/agentTypes';

interface AgentFiltersPanelProps {
  filters: AgentFilter;
  onUpdateFilter: (key: keyof AgentFilter, value: any) => void;
  onToggleCategory: (category: string) => void;
  onClearFilters: () => void;
  categories: string[];
  hasActiveFilters: boolean;
  language: 'en' | 'es';
}

const translations = {
  en: {
    search: "Search agents...",
    filters: "Filters:",
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
    impact: "Impact"
  },
  es: {
    search: "Buscar agentes...",
    filters: "Filtros:",
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
    impact: "Impacto"
  }
};

export const AgentFiltersPanel: React.FC<AgentFiltersPanelProps> = ({
  filters,
  onUpdateFilter,
  onToggleCategory,
  onClearFilters,
  categories,
  hasActiveFilters,
  language
}) => {
  const t = translations[language];

  return (
    <div className="space-y-4 mb-6">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder={t.search}
          value={filters.searchTerm}
          onChange={(e) => onUpdateFilter('searchTerm', e.target.value)}
          className="pl-10 bg-white/70 backdrop-blur-sm border-purple-200 focus:border-purple-400"
        />
      </div>

      {/* Filters Row */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-purple-600" />
          <span className="text-sm font-medium text-gray-700">{t.filters}</span>
        </div>

        {/* Category Multi-Select */}
        <div className="flex flex-wrap gap-1">
          {categories.map(category => (
            <Badge
              key={category}
              variant={filters.selectedCategories.includes(category) ? "default" : "outline"}
              className={`cursor-pointer transition-all ${
                filters.selectedCategories.includes(category)
                  ? 'bg-purple-600 text-white hover:bg-purple-700'
                  : 'hover:bg-purple-50 text-gray-600'
              }`}
              onClick={() => onToggleCategory(category)}
            >
              {category}
            </Badge>
          ))}
        </div>

        {/* Status Filter */}
        <Select value={filters.selectedStatus} onValueChange={(value) => onUpdateFilter('selectedStatus', value)}>
          <SelectTrigger className="w-32 bg-white/70 border-purple-200">
            <div className="flex items-center gap-2">
              {filters.selectedStatus === 'active' && <CheckCircle className="w-3 h-3 text-green-500" />}
              {filters.selectedStatus === 'inactive' && <Circle className="w-3 h-3 text-gray-400" />}
              {filters.selectedStatus === 'recommended' && <Zap className="w-3 h-3 text-yellow-500" />}
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
        <Select value={filters.selectedPriority} onValueChange={(value) => onUpdateFilter('selectedPriority', value)}>
          <SelectTrigger className="w-32 bg-white/70 border-purple-200">
            <div className="flex items-center gap-2">
              {filters.selectedPriority === 'Alta' && <AlertCircle className="w-3 h-3 text-red-500" />}
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
        <Select value={filters.sortBy} onValueChange={(value) => onUpdateFilter('sortBy', value)}>
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
