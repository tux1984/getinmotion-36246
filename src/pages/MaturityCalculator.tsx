
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { CategoryScore, RecommendedAgents } from '@/types/dashboard';
import { DashboardBackground } from '@/components/dashboard/DashboardBackground';
import { NewDashboardHeader } from '@/components/dashboard/NewDashboardHeader';
import { FusedMaturityCalculator } from '@/components/cultural/FusedMaturityCalculator';
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
    console.log('MaturityCalculator: Assessment completed', { scores, recommendedAgents });
    // Navigate to dashboard after short delay to allow user to see completion
    setTimeout(() => {
      navigate('/dashboard/home');
    }, 2000);
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

      <FusedMaturityCalculator
        language={language}
        onComplete={handleComplete}
      />
    </>
  );
};

export default MaturityCalculator;
