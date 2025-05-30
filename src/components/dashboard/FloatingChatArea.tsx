
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
    <div className="h-full overflow-hidden">
      <ModernFloatingAgentChat 
        agentId={agentId}
        language={language}
        onBack={onBack}
      />
    </div>
  );
};
