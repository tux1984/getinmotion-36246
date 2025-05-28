
import React from 'react';
import { Button } from '@/components/ui/button';

interface CompactFiltersPanelProps {
  selectedStatus: string;
  onUpdateFilter: (key: string, value: string) => void;
  language: 'en' | 'es';
}

export const CompactFiltersPanel: React.FC<CompactFiltersPanelProps> = ({
  selectedStatus,
  onUpdateFilter,
  language
}) => {
  const translations = {
    en: {
      allStatuses: "All",
      activeOnly: "Active",
      inactiveOnly: "Inactive"
    },
    es: {
      allStatuses: "Todos",
      activeOnly: "Activos",
      inactiveOnly: "Inactivos"
    }
  };

  const t = translations[language];

  const statusOptions = [
    { value: 'all', label: t.allStatuses },
    { value: 'active', label: t.activeOnly },
    { value: 'inactive', label: t.inactiveOnly }
  ];

  return (
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
  );
};
