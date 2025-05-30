
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { getAgentById } from '@/data/agentsDatabase';
import { MotionLogo } from '@/components/MotionLogo';

interface ChatHeaderProps {
  agentId: string;
  language: 'en' | 'es';
  onBack?: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
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
    <div className="bg-white/10 backdrop-blur-xl border-b border-white/20 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <MotionLogo variant="light" size="sm" />
          <div>
            <h2 className="text-lg font-semibold text-white">{agentName}</h2>
            <p className="text-sm text-purple-200">{agent?.description}</p>
          </div>
        </div>
        
        {onBack && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onBack}
            className="text-white hover:bg-white/10 rounded-xl"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t[language].backToDashboard}
          </Button>
        )}
      </div>
    </div>
  );
};
