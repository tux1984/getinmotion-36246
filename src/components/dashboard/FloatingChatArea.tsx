
import React from 'react';
import { ModernFloatingAgentChat } from './ModernFloatingAgentChat';

interface FloatingChatAreaProps {
  agentId: string;
  language: 'en' | 'es';
}

export const FloatingChatArea: React.FC<FloatingChatAreaProps> = ({
  agentId,
  language
}) => {
  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl h-full overflow-hidden">
      <ModernFloatingAgentChat 
        agentId={agentId}
        language={language}
      />
    </div>
  );
};
