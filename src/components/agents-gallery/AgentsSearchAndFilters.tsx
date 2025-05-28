
import React from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface AgentsSearchAndFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
  selectedPriority: string | null;
  onPriorityChange: (priority: string | null) => void;
  selectedImpact: number | null;
  onImpactChange: (impact: number | null) => void;
  categories: string[];
  categoryTranslations: Record<string, string>;
  translations: {
    search: string;
    allCategories: string;
    allPriorities: string;
    allImpacts: string;
    clearFilters: string;
    priority: string;
    impact: string;
  };
}

export const AgentsSearchAndFilters: React.FC<AgentsSearchAndFiltersProps> = ({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedPriority,
  onPriorityChange,
  selectedImpact,
  onImpactChange,
  categories,
  categoryTranslations,
  translations
}) => {
  const priorities = ['Alta', 'Media-Alta', 'Media', 'Baja', 'Muy Baja'];
  const impacts = [4, 3, 2, 1];

  const hasActiveFilters = selectedCategory || selectedPriority || selectedImpact || searchTerm;

  const clearAllFilters = () => {
    onSearchChange('');
    onCategoryChange(null);
    onPriorityChange(null);
    onImpactChange(null);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border p-4 mb-6">
      {/* Search Bar */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          type="text"
          placeholder={translations.search}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 border-gray-200 focus:border-purple-400"
        />
      </div>

      {/* Filters */}
      <div className="space-y-3">
        {/* Categories */}
        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">Categorías</p>
          <div className="flex flex-wrap gap-2">
            <Badge
              variant={selectedCategory === null ? "default" : "outline"}
              className="cursor-pointer hover:scale-105 transition-transform text-xs"
              onClick={() => onCategoryChange(null)}
            >
              {translations.allCategories}
            </Badge>
            {categories.map(category => (
              <Badge
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className="cursor-pointer hover:scale-105 transition-transform text-xs"
                onClick={() => onCategoryChange(category)}
              >
                {categoryTranslations[category] || category}
              </Badge>
            ))}
          </div>
        </div>

        {/* Priority and Impact in same row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Priority */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">{translations.priority}</p>
            <div className="flex flex-wrap gap-1">
              <Badge
                variant={selectedPriority === null ? "default" : "outline"}
                className="cursor-pointer hover:scale-105 transition-transform text-xs"
                onClick={() => onPriorityChange(null)}
              >
                {translations.allPriorities}
              </Badge>
              {priorities.map(priority => (
                <Badge
                  key={priority}
                  variant={selectedPriority === priority ? "default" : "outline"}
                  className="cursor-pointer hover:scale-105 transition-transform text-xs"
                  onClick={() => onPriorityChange(priority)}
                >
                  {priority}
                </Badge>
              ))}
            </div>
          </div>

          {/* Impact */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">{translations.impact}</p>
            <div className="flex flex-wrap gap-1">
              <Badge
                variant={selectedImpact === null ? "default" : "outline"}
                className="cursor-pointer hover:scale-105 transition-transform text-xs"
                onClick={() => onImpactChange(null)}
              >
                {translations.allImpacts}
              </Badge>
              {impacts.map(impact => (
                <Badge
                  key={impact}
                  variant={selectedImpact === impact ? "default" : "outline"}
                  className="cursor-pointer hover:scale-105 transition-transform text-xs"
                  onClick={() => onImpactChange(impact)}
                >
                  {impact}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <div className="pt-2 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={clearAllFilters}
              className="text-gray-600 hover:text-red-600 hover:border-red-200"
            >
              <X className="w-4 h-4 mr-1" />
              {translations.clearFilters}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
