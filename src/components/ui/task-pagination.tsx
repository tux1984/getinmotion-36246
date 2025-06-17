
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface TaskPaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  language: 'en' | 'es';
}

export const TaskPagination: React.FC<TaskPaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  language
}) => {
  const t = {
    en: {
      showing: 'Showing',
      of: 'of',
      items: 'items',
      previous: 'Previous',
      next: 'Next'
    },
    es: {
      showing: 'Mostrando',
      of: 'de',
      items: 'elementos',
      previous: 'Anterior',
      next: 'Siguiente'
    }
  };

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between space-x-2 py-4">
      <div className="text-sm text-gray-500">
        {t[language].showing} {startItem}-{endItem} {t[language].of} {totalItems} {t[language].items}
      </div>
      
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          {t[language].previous}
        </Button>
        
        <div className="flex items-center space-x-1">
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter(page => 
              page === 1 || 
              page === totalPages || 
              Math.abs(page - currentPage) <= 1
            )
            .map((page, index, array) => (
              <React.Fragment key={page}>
                {index > 0 && array[index - 1] !== page - 1 && (
                  <span className="px-2 text-gray-400">...</span>
                )}
                <Button
                  variant={page === currentPage ? "default" : "outline"}
                  size="sm"
                  onClick={() => onPageChange(page)}
                  className="w-8 h-8 p-0"
                >
                  {page}
                </Button>
              </React.Fragment>
            ))}
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
        >
          {t[language].next}
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );
};
