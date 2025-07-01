
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { DashboardBackground } from '@/components/dashboard/DashboardBackground';
import { NewDashboardHeader } from '@/components/dashboard/NewDashboardHeader';
import { DashboardContent } from '@/components/dashboard/DashboardContent';
import { DashboardLoadingState } from '@/components/dashboard/DashboardLoadingState';
import { DashboardEmergencyFallback } from '@/components/dashboard/DashboardEmergencyFallback';
import { DashboardDebugPanel } from '@/components/dashboard/DashboardDebugPanel';
import { SEOHead } from '@/components/seo/SEOHead';
import { SEO_CONFIG } from '@/config/seo';
import { useDashboardState } from '@/hooks/useDashboardState';
import { useOnboardingValidation } from '@/hooks/useOnboardingValidation';

const DashboardHome = () => {
  const { language } = useLanguage();
  const { user, isAuthorized } = useAuth();
  const navigate = useNavigate();
  const [retryCount, setRetryCount] = useState(0);
  const [showEmergencyFallback, setShowEmergencyFallback] = useState(false);

  // Validation hooks
  const { hasCompletedOnboarding, isValidating } = useOnboardingValidation();

  // Dashboard state
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

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Debug logging
  useEffect(() => {
    console.log('DashboardHome state:', {
      user: user?.email,
      isAuthorized,
      hasCompletedOnboarding,
      isValidating,
      agents: agents.length,
      maturityScores,
      profileData,
      retryCount
    });
  }, [user, isAuthorized, hasCompletedOnboarding, isValidating, agents, maturityScores, profileData, retryCount]);

  // Handle onboarding validation
  useEffect(() => {
    if (!isValidating && hasCompletedOnboarding === false) {
      console.log('Onboarding not completed, redirecting...');
      navigate('/maturity-calculator', { replace: true });
      return;
    }
  }, [hasCompletedOnboarding, isValidating, navigate]);

  // Emergency fallback logic
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isValidating || (hasCompletedOnboarding && agents.length === 0)) {
        console.log('Triggering emergency fallback after timeout');
        setShowEmergencyFallback(true);
      }
    }, 8000); // 8 seconds timeout

    return () => clearTimeout(timer);
  }, [isValidating, hasCompletedOnboarding, agents.length]);

  const handleRetry = () => {
    console.log('Retrying dashboard load...');
    setRetryCount(prev => prev + 1);
    setShowEmergencyFallback(false);
    window.location.reload();
  };

  const handleGoToOnboarding = () => {
    console.log('Going to onboarding...');
    navigate('/maturity-calculator', { replace: true });
  };

  const handleGoToMaturityCalculator = () => {
    console.log('Going to maturity calculator...');
    navigate('/maturity-calculator', { replace: true });
  };

  const seoData = SEO_CONFIG.pages.dashboard[language];

  // Show loading state
  if (isValidating || hasCompletedOnboarding === null) {
    return (
      <>
        <DashboardDebugPanel
          user={user}
          isAuthorized={isAuthorized}
          agents={agents}
          maturityScores={maturityScores}
          profileData={profileData}
          onboardingStatus={hasCompletedOnboarding || false}
          loading={isValidating}
          error={null}
        />
        <DashboardLoadingState />
      </>
    );
  }

  // Show emergency fallback
  if (showEmergencyFallback) {
    return (
      <>
        <DashboardDebugPanel
          user={user}
          isAuthorized={isAuthorized}
          agents={agents}
          maturityScores={maturityScores}
          profileData={profileData}
          onboardingStatus={hasCompletedOnboarding || false}
          loading={false}
          error="Dashboard no pudo cargar correctamente"
        />
        <DashboardEmergencyFallback
          onRetry={handleRetry}
          onGoToOnboarding={handleGoToOnboarding}
          onGoToMaturityCalculator={handleGoToMaturityCalculator}
          error="El dashboard no pudo cargar los datos necesarios"
        />
      </>
    );
  }

  // Main dashboard render
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

      <DashboardDebugPanel
        user={user}
        isAuthorized={isAuthorized}
        agents={agents}
        maturityScores={maturityScores}
        profileData={profileData}
        onboardingStatus={hasCompletedOnboarding || false}
        loading={false}
        error={null}
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
