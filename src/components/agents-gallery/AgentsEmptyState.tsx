
import React from 'react';
import { Search } from 'lucide-react';

interface AgentsEmptyStateProps {
  title: string;
  description: string;
}

export const AgentsEmptyState: React.FC<AgentsEmptyStateProps> = ({
  title,
  description
}) => {
  return (
    <div className="text-center py-16">
      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <Search className="w-10 h-10 text-gray-400" />
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-4">{title}</h3>
      <p className="text-lg text-gray-600">{description}</p>
    </div>
  );
};
