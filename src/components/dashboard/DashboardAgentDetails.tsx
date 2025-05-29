
import React from 'react';
import { BentoAgentLayout } from './BentoAgentLayout';

interface DashboardAgentDetailsProps {
  selectedAgent: string;
  language: 'en' | 'es';
  onBack: () => void;
}

export const DashboardAgentDetails: React.FC<DashboardAgentDetailsProps> = ({
  selectedAgent,
  language,
  onBack
}) => {
  return (
    <BentoAgentLayout 
      selectedAgent={selectedAgent}
      language={language}
      onBack={onBack}
    />
  );
};
