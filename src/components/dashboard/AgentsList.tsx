
import React from 'react';
import { Plus } from 'lucide-react';
import { AgentCard } from './AgentCard';
import { Agent } from '@/types/dashboard';

interface AgentsListProps {
  agents: Agent[];
  onAgentAction: (id: string, action: string) => void;
  addNewAgentText: string;
  language: 'en' | 'es';
}

export const AgentsList: React.FC<AgentsListProps> = ({ 
  agents, 
  onAgentAction, 
  addNewAgentText,
  language
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {agents.map((agent) => (
        <AgentCard 
          key={agent.id}
          agent={agent}
          onActionClick={onAgentAction}
          language={language}
        />
      ))}
      
      {/* Add new agent card */}
      <div className="border border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-gray-500 hover:border-violet-300 hover:text-violet-500 cursor-pointer transition-colors">
        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-2xl mb-4">
          <Plus className="w-6 h-6" />
        </div>
        <p className="text-center">{addNewAgentText}</p>
      </div>
    </div>
  );
};
