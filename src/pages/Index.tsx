
import React, { useState, useEffect } from 'react';
import { HeroSection } from '@/components/HeroSection';
import { ProductExplanation } from '@/components/ProductExplanation';
import { FeaturesSection } from '@/components/FeaturesSection';
import { ValueProposition } from '@/components/ValueProposition';
import { CollapsibleWaitlistForm } from '@/components/waitlist/CollapsibleWaitlistForm';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/layout/Header';
import { SEOHead } from '@/components/seo/SEOHead';
import { useLanguage } from '@/context/LanguageContext';
import { SEO_CONFIG } from '@/config/seo';

const Index = () => {
  const { language } = useLanguage();
  const [showWaitlist, setShowWaitlist] = useState(false);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const translations = {
    en: {
      navAgents: "Agents",
      navAccess: "Get Access",
      navLogin: "Login"
    },
    es: {
      navAgents: "Agentes",
      navAccess: "Obtener Acceso",
      navLogin: "Iniciar Sesión"
    }
  };

  const t = translations[language];
  const seoData = SEO_CONFIG.pages.home[language];

  const handleAccessClick = () => {
    setShowWaitlist(true);
    // Scroll to waitlist form
    setTimeout(() => {
      document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleJoinWaitlist = () => {
    setShowWaitlist(true);
    // Scroll to waitlist form
    setTimeout(() => {
      document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="min-h-screen">
      <SEOHead
        title={seoData.title}
        description={seoData.description}
        keywords={seoData.keywords}
        url={SEO_CONFIG.siteUrl}
        type="website"
      />
      
      <Header 
        onAccessClick={handleAccessClick}
      />
      {/* Add padding top to account for floating header */}
      <div className="pt-20">
        <HeroSection 
          language={language}
          onJoinWaitlist={handleJoinWaitlist}
        />
        <ProductExplanation />
        <FeaturesSection language={language} />
        <ValueProposition />
        <CollapsibleWaitlistForm language={language} />
        <Footer />
      </div>
    </div>
  );
};

export default Index;
