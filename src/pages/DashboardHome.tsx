
import React, { useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { DashboardBackground } from '@/components/dashboard/DashboardBackground';
import { NewDashboardHeader } from '@/components/dashboard/NewDashboardHeader';
import { DashboardContent } from '@/components/dashboard/DashboardContent';
import { SEOHead } from '@/components/seo/SEOHead';
import { SEO_CONFIG } from '@/config/seo';
import { useDashboardState } from '@/hooks/useDashboardState';

const DashboardHome = () => {
  const { language } = useLanguage();
  
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const {
    activeSection,
    selectedAgent,
    agents,
    maturityScores,
    recommendedAgents,
    profileData,
    handleSelectAgent,
    handleMaturityCalculatorClick,
    handleOpenAgentManager,
    handleBackFromAgentDetails,
    handleBackFromAgentManager,
    handleAgentToggle
  } = useDashboardState();

  const seoData = SEO_CONFIG.pages.dashboard[language];

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
        profileData={profileData}
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
