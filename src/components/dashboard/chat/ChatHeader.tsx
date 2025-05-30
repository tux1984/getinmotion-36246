
import React from 'react';

interface ChatHeaderProps {
  agentId: string;
  language: 'en' | 'es';
  onBack?: () => void;
  showHeader?: boolean;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  agentId,
  language,
  onBack,
  showHeader = true
}) => {
  // No mostrar header cuando showHeader es false (cuando está en la página de detalles del agente)
  if (!showHeader) {
    return null;
  }

  // Header simplificado - toda la información del agente se movió al FloatingAgentInfoModule
  return null;
};
