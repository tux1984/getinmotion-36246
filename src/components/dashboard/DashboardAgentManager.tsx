
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { ModernAgentManager } from './ModernAgentManager';
import { Agent } from '@/types/dashboard';
import { useTranslations } from '@/hooks/useTranslations';

interface DashboardAgentManagerProps {
  agents: Agent[];
  onBack: () => void;
  onAgentToggle: (agentId: string, enabled: boolean) => Promise<void>;
}

export const DashboardAgentManager: React.FC<DashboardAgentManagerProps> = ({
  agents,
  onBack,
  onAgentToggle
}) => {
  const { t } = useTranslations();
  return (
    <div className="min-h-screen w-full">
      <div className="mb-4 sm:mb-6 px-2 sm:px-0">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onBack}
          className="flex items-center gap-2 text-purple-600 hover:text-purple-800 hover:bg-purple-50/50 backdrop-blur-sm border border-purple-200/50"
        >
          <ArrowLeft className="w-4 h-4" />
          {t.ui.back}
        </Button>
      </div>
      
      <ModernAgentManager 
        currentAgents={agents}
        onAgentToggle={onAgentToggle}
      />
    </div>
  );
};
