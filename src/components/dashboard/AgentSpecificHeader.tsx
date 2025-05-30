
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { getAgentById } from '@/data/agentsDatabase';
import { MotionLogo } from '@/components/MotionLogo';

interface AgentSpecificHeaderProps {
  agentId: string;
  language: 'en' | 'es';
  onBack: () => void;
}

export const AgentSpecificHeader: React.FC<AgentSpecificHeaderProps> = ({
  agentId,
  language,
  onBack
}) => {
  const agent = getAgentById(agentId);
  const agentName = agent?.name || 'AI Assistant';

  const t = {
    en: { backToDashboard: "Back to Dashboard" },
    es: { backToDashboard: "Volver al Dashboard" }
  };

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-3 sm:p-4 mx-2 sm:mx-4 mt-2 sm:mt-4 mb-2">
      <div className="flex items-center justify-between gap-2 sm:gap-3">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          <MotionLogo variant="dark" size="sm" className="flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <h1 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 truncate">
              {agentName}
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 line-clamp-1 sm:line-clamp-2">
              {agent?.description}
            </p>
          </div>
        </div>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onBack}
          className="flex items-center gap-1 sm:gap-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2 flex-shrink-0"
        >
          <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="hidden sm:inline">
            {t[language].backToDashboard}
          </span>
          <span className="sm:hidden">
            {language === 'en' ? 'Back' : 'Volver'}
          </span>
        </Button>
      </div>
    </div>
  );
};
