
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { CategoryScore, RecommendedAgents } from '@/types/dashboard';
import { DashboardBackground } from '@/components/dashboard/DashboardBackground';
import { NewDashboardHeader } from '@/components/dashboard/NewDashboardHeader';
import { ConversationalMaturityAgent } from '@/components/cultural/conversational/ConversationalMaturityAgent';
import { SEOHead } from '@/components/seo/SEOHead';
import { SEO_CONFIG } from '@/config/seo';

const MaturityCalculator = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);


  const handleBackToDashboard = () => {
    navigate('/dashboard/home');
  };

  const handleComplete = (scores: CategoryScore, recommendedAgents: RecommendedAgents) => {
    console.log('MaturityCalculator: Assessment completed');
    // DO NOT auto-redirect - let completion screen handle navigation
    // The new flow will show completion screen first
  };

  const seoData = SEO_CONFIG.pages.maturityCalculator[language];

  return (
    <>
      <SEOHead
        title={seoData.title}
        description={seoData.description}
        keywords={seoData.keywords}
        url={`${SEO_CONFIG.siteUrl}/maturity-calculator`}
        type="website"
        noIndex={true}
      />

      <NewDashboardHeader 
        onMaturityCalculatorClick={() => navigate('/maturity-calculator')}
        onAgentManagerClick={handleBackToDashboard}
      />

      <ConversationalMaturityAgent
        language={language}
        onComplete={handleComplete}
      />
    </>
  );
};

export default MaturityCalculator;
