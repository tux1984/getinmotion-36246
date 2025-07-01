
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { DashboardBackground } from '@/components/dashboard/DashboardBackground';
import { NewDashboardHeader } from '@/components/dashboard/NewDashboardHeader';
import { DashboardContent } from '@/components/dashboard/DashboardContent';
import { DashboardLoadingState } from '@/components/dashboard/DashboardLoadingState';
import { DashboardErrorState } from '@/components/dashboard/DashboardErrorState';
import { SEOHead } from '@/components/seo/SEOHead';
import { SEO_CONFIG } from '@/config/seo';
import { useOptimizedAgentManagement } from '@/hooks/useOptimizedAgentManagement';

const DashboardHome = () => {
  const { language } = useLanguage();
  const { user, isAuthorized } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<'dashboard' | 'agent-details' | 'agent-manager'>('dashboard');
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);

  console.log('DashboardHome: Rendering');

  // Use optimized hook
  const {
    agents,
    profile,
    maturityScores,
    recommendedAgents,
    isLoading,
    error,
    hasOnboarding
  } = useOptimizedAgentManagement();

  // Scroll to top on load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Debug logging
  useEffect(() => {
    console.log('DashboardHome: State', {
      user: user?.email,
      isAuthorized,
      hasOnboarding,
      isLoading,
      agentsCount: agents.length,
      hasMaturityScores: !!maturityScores,
      error
    });
  }, [user, isAuthorized, hasOnboarding, isLoading, agents, maturityScores, error]);

  // Event handlers
  const handleSelectAgent = (agentId: string) => {
    console.log('DashboardHome: Selecting agent:', agentId);
    setSelectedAgent(agentId);
    setActiveSection('agent-details');
  };

  const handleBackFromAgentDetails = () => {
    setSelectedAgent(null);
    setActiveSection('dashboard');
  };

  const handleOpenAgentManager = () => {
    setActiveSection('agent-manager');
  };

  const handleBackFromAgentManager = () => {
    setActiveSection('dashboard');
  };

  const handleMaturityCalculatorClick = () => {
    navigate('/maturity-calculator');
  };

  const handleAgentToggle = async (agentId: string, enabled: boolean) => {
    console.log('DashboardHome: Toggling agent:', agentId, enabled);
    // Implementation pending
  };

  const handleRetry = () => {
    window.location.reload();
  };

  const seoData = SEO_CONFIG.pages.dashboard[language];

  // Show error state if there's a critical error
  if (error) {
    console.log('DashboardHome: Showing error state');
    return (
      <DashboardErrorState
        error={error}
        onRetry={handleRetry}
      />
    );
  }

  // Show loading only for initial load
  if (isLoading && !profile && agents.length === 0) {
    console.log('DashboardHome: Showing loading state');
    return <DashboardLoadingState />;
  }

  // Always render the main dashboard
  console.log('DashboardHome: Rendering main dashboard');
  return (
    <DashboardBackground>
      <SEOHead
        title={seoData.title}
        description={seoData.description}
        keywords={seoData.keywords}
        url={`${SEO_CONFIG.siteUrl}/dashboard/home`}
        type="website"
        noIndex={true}
      />

      <NewDashboardHeader 
        onMaturityCalculatorClick={handleMaturityCalculatorClick}
        onAgentManagerClick={handleOpenAgentManager}
      />
      
      <DashboardContent
        activeSection={activeSection}
        selectedAgent={selectedAgent}
        agents={agents}
        maturityScores={maturityScores}
        recommendedAgents={recommendedAgents}
        profileData={profile}
        language={language}
        onSelectAgent={handleSelectAgent}
        onMaturityCalculatorClick={handleMaturityCalculatorClick}
        onOpenAgentManager={handleOpenAgentManager}
        onBackFromAgentDetails={handleBackFromAgentDetails}
        onBackFromAgentManager={handleBackFromAgentManager}
        onAgentToggle={handleAgentToggle}
      />
    </DashboardBackground>
  );
};

export default DashboardHome;
