
import React from 'react';
import { AgentCard } from './AgentCard';
import { CulturalAgent } from '@/data/agentsDatabase';

interface AgentsListViewProps {
  agents: CulturalAgent[];
  translations: {
    priority: string;
    impact: string;
    categories: Record<string, string>;
    exampleQuestion: string;
    exampleAnswer: string;
  };
}

export const AgentsListView: React.FC<AgentsListViewProps> = ({
  agents,
  translations
}) => {
  return (
    <div className="space-y-6">
      {agents.map((agent) => (
        <AgentCard
          key={agent.id}
          agent={agent}
          translations={translations}
        />
      ))}
    </div>
  );
};
