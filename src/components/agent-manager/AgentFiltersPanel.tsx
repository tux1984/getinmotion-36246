
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, X } from 'lucide-react';

interface AgentFiltersPanelProps {
  filters: {
    search: string;
    status: string;
    categories: string[];
  };
  onUpdateFilter: (key: string, value: string) => void;
  onToggleCategory: (category: string) => void;
  onClearFilters: () => void;
  categories: string[];
  hasActiveFilters: boolean;
  language: 'en' | 'es';
}

export const AgentFiltersPanel: React.FC<AgentFiltersPanelProps> = ({
  filters,
  onUpdateFilter,
  onToggleCategory,
  onClearFilters,
  categories,
  hasActiveFilters,
  language
}) => {
  const translations = {
    en: {
      searchPlaceholder: "Search agents...",
      allStatuses: "All Statuses",
      activeOnly: "Active Only",
      inactiveOnly: "Inactive Only",
      categories: "Categories",
      clearFilters: "Clear Filters"
    },
    es: {
      searchPlaceholder: "Buscar agentes...",
      allStatuses: "Todos los Estados",
      activeOnly: "Solo Activos",
      inactiveOnly: "Solo Inactivos",
      categories: "Categorías",
      clearFilters: "Limpiar Filtros"
    }
  };

  const t = translations[language];

  const statusOptions = [
    { value: 'all', label: t.allStatuses },
    { value: 'active', label: t.activeOnly },
    { value: 'inactive', label: t.inactiveOnly }
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6 shadow-sm">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder={t.searchPlaceholder}
          value={filters.search}
          onChange={(e) => onUpdateFilter('search', e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Status Filter */}
      <div>
        <div className="flex gap-2 flex-wrap">
          {statusOptions.map((option) => (
            <Button
              key={option.value}
              variant={filters.status === option.value ? "default" : "outline"}
              size="sm"
              onClick={() => onUpdateFilter('status', option.value)}
              className="text-xs"
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div>
        <h4 className="font-medium text-gray-900 mb-3">{t.categories}</h4>
        <div className="flex gap-2 flex-wrap">
          {categories.map((category) => (
            <Badge
              key={category}
              variant={filters.categories.includes(category) ? "default" : "outline"}
              className="cursor-pointer hover:bg-purple-100"
              onClick={() => onToggleCategory(category)}
            >
              {category}
            </Badge>
          ))}
        </div>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearFilters}
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <X className="w-4 h-4 mr-1" />
          {t.clearFilters}
        </Button>
      )}
    </div>
  );
};
