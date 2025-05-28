
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { AgentDetails } from './AgentDetails';

interface DashboardAgentDetailsProps {
  selectedAgent: string;
  language: 'en' | 'es';
  onBack: () => void;
}

export const DashboardAgentDetails: React.FC<DashboardAgentDetailsProps> = ({
  selectedAgent,
  language,
  onBack
}) => {
  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-purple-100 p-6">
      <div className="mb-4">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onBack}
          className="flex items-center gap-2 text-purple-600 hover:text-purple-800"
        >
          <ArrowLeft className="w-4 h-4" />
          {language === 'en' ? 'Back to Dashboard' : 'Volver al Dashboard'}
        </Button>
      </div>
      <AgentDetails 
        agentId={selectedAgent}
        language={language}
      />
    </div>
  );
};
