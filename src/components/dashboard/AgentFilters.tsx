
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, X, Zap, Circle, CheckCircle, AlertCircle } from 'lucide-react';
import { useTranslations } from '@/hooks/useTranslations';

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
  const { t } = useTranslations();

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
          placeholder={t.agentFilters.search}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 bg-white/70 backdrop-blur-sm border-purple-200 focus:border-purple-400"
        />
      </div>

      {/* Filters Row */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-purple-600" />
          <span className="text-sm font-medium text-gray-700">{t.agentFilters.filtersLabel}</span>
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
            <SelectItem value="all">{t.missionsDashboard.all}</SelectItem>
            <SelectItem value="active">{t.status.active}</SelectItem>
            <SelectItem value="inactive">{t.status.inactive}</SelectItem>
            <SelectItem value="recommended">{t.missionsDashboard.all}</SelectItem>
          </SelectContent>
        </Select>

        {/* Priority Filter */}
        <Select value={selectedPriority} onValueChange={onPriorityChange}>
          <SelectTrigger className="w-32 bg-white/70 border-purple-200">
            <div className="flex items-center gap-2">
              {selectedPriority === 'Alta' && <AlertCircle className="w-3 h-3 text-red-500" />}
              <SelectValue placeholder={t.agentFilters.priority} />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t.missionsDashboard.all}</SelectItem>
            <SelectItem value="Alta">{t.missionsDashboard.high}</SelectItem>
            <SelectItem value="Media">{t.missionsDashboard.medium}</SelectItem>
            <SelectItem value="Baja">{t.missionsDashboard.low}</SelectItem>
          </SelectContent>
        </Select>

        {/* Sort Filter */}
        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger className="w-36 bg-white/70 border-purple-200">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">{t.sortOptions.name}</SelectItem>
            <SelectItem value="usage">{t.sortOptions.usage}</SelectItem>
            <SelectItem value="impact">{t.sortOptions.impact}</SelectItem>
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
            {t.agentFilters.clearFilters}
          </Button>
        )}
      </div>
    </div>
  );
};
