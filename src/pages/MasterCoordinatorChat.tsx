import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { AgentSpecificHeader } from '@/components/dashboard/AgentSpecificHeader';
import { DashboardBackground } from '@/components/dashboard/DashboardBackground';
import { BentoAgentLayout } from '@/components/dashboard/BentoAgentLayout';
import { SEOHead } from '@/components/seo/SEOHead';
import { SEO_CONFIG } from '@/config/seo';

const MasterCoordinatorChat = () => {
  const { user, isAuthorized } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();

  console.log('MasterCoordinatorChat: Rendering chat interface');

  // Scroll to top on load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Redirect if not authorized (but don't block rendering)
  useEffect(() => {
    if (!isAuthorized && !user) {
      console.log('MasterCoordinatorChat: Not authorized, redirecting...');
      navigate('/login', { replace: true });
    }
  }, [isAuthorized, user, navigate]);

  const handleBack = () => {
    navigate('/dashboard');
  };

  const seoData = SEO_CONFIG.pages.dashboard[language];

  return (
    <>
      <SEOHead
        title={`${seoData.title} - Coordinador Maestro`}
        description="Conversa con tu Coordinador Maestro de Negocios"
        keywords={seoData.keywords}
        url={`${SEO_CONFIG.siteUrl}/dashboard/agent/master-coordinator`}
        type="website"
        noIndex={true}
      />
      
      <DashboardBackground showGlobalComponents={true}>
        <AgentSpecificHeader 
          agentId="master-coordinator"
          language={language}
          onBack={handleBack}
        />
        
        <div className="h-screen flex flex-col">
          <div className="flex-1 min-h-0 container mx-auto px-4 sm:px-6 lg:px-8">
            <BentoAgentLayout 
              selectedAgent="master-coordinator"
              language={language}
              onBack={handleBack}
            />
          </div>
        </div>
      </DashboardBackground>
    </>
  );
};

export default MasterCoordinatorChat;