
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface CompactFiltersPanelProps {
  selectedStatus: string;
  selectedCategories: string[];
  categories: string[];
  onUpdateFilter: (key: string, value: string) => void;
  onToggleCategory: (category: string) => void;
  language: 'en' | 'es';
}

export const CompactFiltersPanel: React.FC<CompactFiltersPanelProps> = ({
  selectedStatus,
  selectedCategories,
  categories,
  onUpdateFilter,
  onToggleCategory,
  language
}) => {
  const translations = {
    en: {
      allStatuses: "All",
      activeOnly: "Active",
      inactiveOnly: "Inactive",
      categories: "Categories:"
    },
    es: {
      allStatuses: "Todos",
      activeOnly: "Activos",
      inactiveOnly: "Inactivos",
      categories: "Categorías:"
    }
  };

  const t = translations[language];

  const statusOptions = [
    { value: 'all', label: t.allStatuses },
    { value: 'active', label: t.activeOnly },
    { value: 'inactive', label: t.inactiveOnly }
  ];

  // Category translations
  const categoryTranslations = {
    en: {
      'Financiera': 'Financial',
      'Legal': 'Legal',
      'Diagnóstico': 'Diagnostic',
      'Comercial': 'Commercial',
      'Operativo': 'Operational',
      'Comunidad': 'Community'
    },
    es: {
      'Financiera': 'Financiera',
      'Legal': 'Legal',
      'Diagnóstico': 'Diagnóstico',
      'Comercial': 'Comercial',
      'Operativo': 'Operativo',
      'Comunidad': 'Comunidad',
      'Financial': 'Financiera',
      'Diagnostic': 'Diagnóstico',
      'Commercial': 'Comercial',
      'Operational': 'Operativo',
      'Community': 'Comunidad'
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-4 mb-4 mt-20">
      {/* Status Filters */}
      <div className="flex justify-center gap-2 mb-4">
        {statusOptions.map((option) => (
          <Button
            key={option.value}
            variant={selectedStatus === option.value ? "default" : "outline"}
            size="sm"
            onClick={() => onUpdateFilter('status', option.value)}
            className="text-xs px-4 py-2"
          >
            {option.label}
          </Button>
        ))}
      </div>

      {/* Category Filters */}
      <div className="space-y-2">
        <span className="text-sm font-medium text-white">{t.categories}</span>
        <div className="flex flex-wrap gap-2 justify-center">
          {categories.map(category => {
            const translatedCategory = categoryTranslations[language][category as keyof typeof categoryTranslations[typeof language]] || category;
            return (
              <Badge
                key={category}
                variant={selectedCategories.includes(category) ? "default" : "outline"}
                className={`cursor-pointer transition-all text-xs ${
                  selectedCategories.includes(category)
                    ? 'bg-purple-600 text-white hover:bg-purple-700 border-purple-500'
                    : 'hover:bg-purple-50/10 text-purple-200 border-purple-300/50 hover:border-purple-300'
                }`}
                onClick={() => onToggleCategory(category)}
              >
                {translatedCategory}
              </Badge>
            );
          })}
        </div>
      </div>
    </div>
  );
};
