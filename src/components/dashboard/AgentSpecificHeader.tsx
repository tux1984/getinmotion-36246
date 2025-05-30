
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { getAgentById } from '@/data/agentsDatabase';
import { getAgentTranslation } from '@/data/agentTranslations';
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
  const agentTranslation = getAgentTranslation(agentId, language);

  const t = {
    en: { backToDashboard: "Back to Dashboard" },
    es: { backToDashboard: "Volver al Dashboard" }
  };

  return (
    <header className="fixed top-4 left-4 right-4 z-50 mx-2 sm:mx-4 lg:mx-6">
      <div className="bg-white/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl px-4 sm:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          <MotionLogo variant="dark" size="lg" className="flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <h1 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 truncate">
              {agentTranslation.name}
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 line-clamp-1 sm:line-clamp-2">
              {agentTranslation.description}
            </p>
          </div>
        </div>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onBack}
          className="group flex items-center gap-1 sm:gap-2 bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200 text-gray-600 hover:from-gray-100 hover:to-slate-100 hover:border-gray-300 hover:text-gray-900 transition-all duration-200 hover:scale-105 hover:shadow-md rounded-xl text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2 flex-shrink-0 font-medium"
        >
          <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 group-hover:-translate-x-1 transition-transform duration-200" />
          <span className="hidden sm:inline">
            {t[language].backToDashboard}
          </span>
          <span className="sm:hidden">
            {language === 'en' ? 'Back' : 'Volver'}
          </span>
        </Button>
      </div>
    </header>
  );
};
