
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { AgentSpecificHeader } from '@/components/dashboard/AgentSpecificHeader';
import { DashboardBackground } from '@/components/dashboard/DashboardBackground';
import { BentoAgentLayout } from '@/components/dashboard/BentoAgentLayout';

const AgentDetails = () => {
  const { agentId } = useParams<{ agentId: string }>();
  const { language } = useLanguage();
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/dashboard/home');
  };

  if (!agentId) {
    navigate('/dashboard/home');
    return null;
  }

  return (
    <DashboardBackground>
      <AgentSpecificHeader 
        agentId={agentId}
        language={language}
        onBack={handleBack}
      />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 pt-32">
        <BentoAgentLayout 
          selectedAgent={agentId}
          language={language}
          onBack={handleBack}
        />
      </div>
    </DashboardBackground>
  );
};

export default AgentDetails;
