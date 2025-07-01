
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
import { useOptimizedAgentManagement } from '@/hooks/useOptimizedAgentManagement';

const DashboardHome = () => {
  const { language } = useLanguage();
  const { user, isAuthorized } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<'dashboard' | 'agent-details' | 'agent-manager'>('dashboard');
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [showEmergencyFallback, setShowEmergencyFallback] = useState(false);

  // ARREGLO CRÍTICO: Usar el hook optimizado
  const {
    agents,
    profile,
    maturityScores,
    recommendedAgents,
    isLoading,
    error,
    hasOnboarding
  } = useOptimizedAgentManagement();

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Debug logging
  useEffect(() => {
    console.log('DashboardHome: Current state:', {
      user: user?.email,
      isAuthorized,
      hasOnboarding,
      isLoading,
      agents: agents.length,
      maturityScores,
      profile: !!profile,
      error
    });
  }, [user, isAuthorized, hasOnboarding, isLoading, agents, maturityScores, profile, error]);

  // ARREGLO: Manejo más inteligente de onboarding
  useEffect(() => {
    // Solo redirigir si estamos seguros de que no hay onboarding
    if (!isLoading && hasOnboarding === false && !error) {
      console.log('DashboardHome: Redirecting to onboarding - no maturity scores found');
      navigate('/maturity-calculator', { replace: true });
    }
  }, [hasOnboarding, isLoading, error, navigate]);

  // Emergency fallback - mostrar después de un tiempo si sigue cargando
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isLoading) {
        console.log('DashboardHome: Showing emergency fallback after timeout');
        setShowEmergencyFallback(true);
      }
    }, 15000); // 15 segundos

    return () => clearTimeout(timer);
  }, [isLoading]);

  const handleSelectAgent = (agentId: string) => {
    console.log('DashboardHome: Selecting agent:', agentId);
    setSelectedAgent(agentId);
    setActiveSection('agent-details');
  };

  const handleBackFromAgentDetails = () => {
    console.log('DashboardHome: Returning from agent details');
    setSelectedAgent(null);
    setActiveSection('dashboard');
  };

  const handleOpenAgentManager = () => {
    console.log('DashboardHome: Opening agent manager');
    setActiveSection('agent-manager');
  };

  const handleBackFromAgentManager = () => {
    console.log('DashboardHome: Returning from agent manager');
    setActiveSection('dashboard');
  };

  const handleMaturityCalculatorClick = () => {
    console.log('DashboardHome: Going to maturity calculator');
    navigate('/maturity-calculator');
  };

  const handleAgentToggle = async (agentId: string, enabled: boolean) => {
    console.log('DashboardHome: Toggling agent:', agentId, enabled);
    // Esta funcionalidad se implementará más tarde
  };

  const handleRetry = () => {
    console.log('DashboardHome: Retrying...');
    window.location.reload();
  };

  const handleGoToOnboarding = () => {
    console.log('DashboardHome: Going to onboarding');
    navigate('/maturity-calculator', { replace: true });
  };

  const seoData = SEO_CONFIG.pages.dashboard[language];

  // ARREGLO CRÍTICO: Mostrar emergency fallback si hay timeout
  if (showEmergencyFallback) {
    return (
      <>
        <DashboardDebugPanel
          user={user}
          isAuthorized={isAuthorized}
          agents={agents}
          maturityScores={maturityScores}
          profileData={profile}
          onboardingStatus={hasOnboarding}
          loading={isLoading}
          error={error}
        />
        <DashboardEmergencyFallback
          onRetry={handleRetry}
          onGoToOnboarding={handleGoToOnboarding}
          onGoToMaturityCalculator={handleMaturityCalculatorClick}
          error={error}
        />
      </>
    );
  }

  // ARREGLO CRÍTICO: Mostrar loading solo si realmente está cargando
  if (isLoading) {
    return (
      <>
        <DashboardDebugPanel
          user={user}
          isAuthorized={isAuthorized}
          agents={agents}
          maturityScores={maturityScores}
          profileData={profile}
          onboardingStatus={hasOnboarding}
          loading={isLoading}
          error={error}
        />
        <DashboardLoadingState />
      </>
    );
  }

  // ARREGLO CRÍTICO: Mostrar dashboard incluso con datos mínimos
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
        profileData={profile}
        onboardingStatus={hasOnboarding}
        loading={isLoading}
        error={error}
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
