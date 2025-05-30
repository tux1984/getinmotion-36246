
import React from 'react';
import { ModernFloatingAgentChat } from './ModernFloatingAgentChat';

interface FloatingChatAreaProps {
  agentId: string;
  language: 'en' | 'es';
  onBack?: () => void;
}

export const FloatingChatArea: React.FC<FloatingChatAreaProps> = ({
  agentId,
  language,
  onBack
}) => {
  return (
    <div className="h-full overflow-hidden bg-white/5 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl">
      <ModernFloatingAgentChat 
        agentId={agentId}
        language={language}
        onBack={onBack}
      />
    </div>
  );
};
