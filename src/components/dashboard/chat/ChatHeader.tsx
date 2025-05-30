
import React from 'react';

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
  // Header simplificado - toda la información del agente se movió al FloatingAgentInfoModule
  return null;
};
