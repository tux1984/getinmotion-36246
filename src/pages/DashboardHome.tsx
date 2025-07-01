
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

  console.log('DashboardHome: Component rendering');

  // ARREGLO CRÍTICO: Usar hook optimizado
  const {
    agents,
    profile,
    maturityScores,
    recommendedAgents,
    isLoading,
    error,
    hasOnboarding
  } = useOptimizedAgentManagement();

  // Scroll para arriba al cargar
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Debug logging
  useEffect(() => {
    console.log('DashboardHome: State update:', {
      user: user?.email,
      isAuthorized,
      hasOnboarding,
      isLoading,
      agentsCount: agents.length,
      hasMaturityScores: !!maturityScores,
      hasProfile: !!profile,
      error
    });
  }, [user, isAuthorized, hasOnboarding, isLoading, agents, maturityScores, profile, error]);

  // ARREGLO CRÍTICO: Solo redirigir en casos muy específicos y sin loops
  useEffect(() => {
    // Solo redirigir si definitivamente no hay onboarding y no estamos cargando
    if (!isLoading && !error && hasOnboarding === false) {
      const hasLocalData = localStorage.getItem('maturityScores') || localStorage.getItem('onboardingCompleted');
      if (!hasLocalData) {
        console.log('DashboardHome: Redirecting to onboarding - no data found');
        navigate('/maturity-calculator', { replace: true });
      }
    }
  }, [hasOnboarding, isLoading, error, navigate]);

  // Emergency fallback timer
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isLoading) {
        console.log('DashboardHome: Showing emergency fallback after timeout');
        setShowEmergencyFallback(true);
      }
    }, 12000); // 12 segundos

    return () => clearTimeout(timer);
  }, [isLoading]);

  // Event handlers
  const handleSelectAgent = (agentId: string) => {
    console.log('DashboardHome: Selecting agent:', agentId);
    setSelectedAgent(agentId);
    setActiveSection('agent-details');
  };

  const handleBackFromAgentDetails = () => {
    console.log('DashboardHome: Back from agent details');
    setSelectedAgent(null);
    setActiveSection('dashboard');
  };

  const handleOpenAgentManager = () => {
    console.log('DashboardHome: Opening agent manager');
    setActiveSection('agent-manager');
  };

  const handleBackFromAgentManager = () => {
    console.log('DashboardHome: Back from agent manager');
    setActiveSection('dashboard');
  };

  const handleMaturityCalculatorClick = () => {
    console.log('DashboardHome: Going to maturity calculator');
    navigate('/maturity-calculator');
  };

  const handleAgentToggle = async (agentId: string, enabled: boolean) => {
    console.log('DashboardHome: Toggling agent:', agentId, enabled);
    // Implementar más tarde
  };

  const handleRetry = () => {
    console.log('DashboardHome: Retrying - reloading page');
    window.location.reload();
  };

  const handleGoToOnboarding = () => {
    console.log('DashboardHome: Going to onboarding');
    navigate('/maturity-calculator', { replace: true });
  };

  const seoData = SEO_CONFIG.pages.dashboard[language];

  // ARREGLO CRÍTICO: Emergency fallback si hay timeout
  if (showEmergencyFallback) {
    console.log('DashboardHome: Rendering emergency fallback');
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

  // ARREGLO CRÍTICO: Solo mostrar loading si realmente está cargando
  if (isLoading && !showEmergencyFallback) {
    console.log('DashboardHome: Rendering loading state');
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

  // ARREGLO CRÍTICO: Siempre mostrar dashboard
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
