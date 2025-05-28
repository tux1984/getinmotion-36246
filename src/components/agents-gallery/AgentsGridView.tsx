
import React from 'react';
import { AgentCard } from './AgentCard';
import { CulturalAgent } from '@/data/agentsDatabase';

interface AgentsGridViewProps {
  agents: CulturalAgent[];
  translations: {
    priority: string;
    impact: string;
    categories: Record<string, string>;
  };
}

export const AgentsGridView: React.FC<AgentsGridViewProps> = ({
  agents,
  translations
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
      {agents.map((agent) => (
        <AgentCard
          key={agent.id}
          agent={agent}
          isListView={false}
          translations={translations}
        />
      ))}
    </div>
  );
};
