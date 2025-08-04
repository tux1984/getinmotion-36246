
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { UnifiedDashboard } from '@/components/dashboard/UnifiedDashboard';
import { SEOHead } from '@/components/seo/SEOHead';
import { SEO_CONFIG } from '@/config/seo';
import { useLanguage } from '@/context/LanguageContext';

const NewDashboardHome = () => {
  const { user, isAuthorized } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();

  console.log('NewDashboardHome: Rendering with unified Master Coordinator experience', {
    user: user?.email,
    isAuthorized
  });

  // Scroll to top on load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Redirect if not authorized (but don't block rendering)
  useEffect(() => {
    if (!isAuthorized && !user) {
      console.log('NewDashboardHome: Not authorized, redirecting...');
      navigate('/login', { replace: true });
    }
  }, [isAuthorized, user, navigate]);

  const seoData = SEO_CONFIG.pages.dashboard[language];

  return (
    <>
      <SEOHead
        title={seoData.title}
        description={seoData.description}
        keywords={seoData.keywords}
        url={`${SEO_CONFIG.siteUrl}/dashboard/home`}
        type="website"
        noIndex={true}
      />
      
      <UnifiedDashboard />
    </>
  );
};

export default NewDashboardHome;
