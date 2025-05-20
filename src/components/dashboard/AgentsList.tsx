
import React from 'react';
import { Plus } from 'lucide-react';
import { AgentCard } from './AgentCard';
import { Agent } from '@/types/dashboard';
import { Input } from '@/components/ui/input';

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
    <div className="space-y-4">
      <div className="relative">
        <Input 
          type="text" 
          placeholder={language === 'en' ? "Search agents..." : "Buscar agentes..."}
          className="pl-8 bg-gray-50"
        />
        <div className="absolute left-2.5 top-2.5">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7.33333 12.6667C10.2789 12.6667 12.6667 10.2789 12.6667 7.33333C12.6667 4.38781 10.2789 2 7.33333 2C4.38781 2 2 4.38781 2 7.33333C2 10.2789 4.38781 12.6667 7.33333 12.6667Z" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M14 14L11.1 11.1" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-3">
        {agents.map((agent) => (
          <AgentCard 
            key={agent.id}
            agent={agent}
            onActionClick={onAgentAction}
            language={language}
          />
        ))}
        
        {/* Add new agent card */}
        <div 
          className="flex items-center p-4 border border-dashed border-gray-200 rounded-lg hover:border-violet-300 hover:bg-violet-50 cursor-pointer transition-all"
          onClick={() => onAgentAction('new', 'create')}
        >
          <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center mr-3">
            <Plus className="w-5 h-5 text-gray-400" />
          </div>
          <p className="font-medium text-gray-600">{addNewAgentText}</p>
        </div>
      </div>
    </div>
  );
};
