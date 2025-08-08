
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { CategoryScore, RecommendedAgents } from '@/types/dashboard';
import { DashboardBackground } from '@/components/dashboard/DashboardBackground';
import { NewDashboardHeader } from '@/components/dashboard/NewDashboardHeader';
import { FusedMaturityCalculator } from '@/components/cultural/FusedMaturityCalculator';
import { SEOHead } from '@/components/seo/SEOHead';
import { SEO_CONFIG } from '@/config/seo';
import { ErrorBoundary } from '@/components/ErrorBoundary';

const MaturityCalculator = () => {
  
  const navigate = useNavigate();

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);


  const handleBackToDashboard = () => {
    navigate('/dashboard/home');
  };

  const handleComplete = (scores: CategoryScore, recommendedAgents: RecommendedAgents, profileData?: any) => {
    console.log('MaturityCalculator: Assessment completed with full integration', { scores, recommendedAgents, profileData });
    
    // Store completion flag for dashboard integration
    localStorage.setItem('maturity_assessment_completed', 'true');
    localStorage.setItem('assessment_completion_time', new Date().toISOString());
    
    // Navigate to dashboard after coordinator activation
    setTimeout(() => {
      navigate('/dashboard/home');
    }, 3000); // Slightly longer to allow coordinator to fully activate
  };

  const seoData = SEO_CONFIG.pages.maturityCalculator?.en || {
    title: 'Business Maturity Calculator - Motion',
    description: 'Assess your business maturity level',
    keywords: 'maturity calculator, business assessment'
  };

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

      <div className="pt-28">
        <ErrorBoundary>
          <FusedMaturityCalculator
            onComplete={handleComplete}
          />
        </ErrorBoundary>
      </div>
    </>
  );
};

export default MaturityCalculator;
