
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { ModernAgentManager } from './ModernAgentManager';
import { Agent } from '@/types/dashboard';

interface DashboardAgentManagerProps {
  agents: Agent[];
  language: 'en' | 'es';
  onBack: () => void;
  onAgentToggle: (agentId: string, enabled: boolean) => Promise<void>;
}

export const DashboardAgentManager: React.FC<DashboardAgentManagerProps> = ({
  agents,
  language,
  onBack,
  onAgentToggle
}) => {
  return (
    <div className="min-h-screen">
      <div className="mb-6">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onBack}
          className="flex items-center gap-2 text-purple-600 hover:text-purple-800 hover:bg-purple-50/50 backdrop-blur-sm border border-purple-200/50"
        >
          <ArrowLeft className="w-4 h-4" />
          {language === 'en' ? 'Back to Dashboard' : 'Volver al Dashboard'}
        </Button>
      </div>
      
      <ModernAgentManager 
        currentAgents={agents}
        onAgentToggle={onAgentToggle}
        language={language}
      />
    </div>
  );
};
