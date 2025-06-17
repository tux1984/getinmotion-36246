
import React, { useState, useEffect } from 'react';
import { HeroSection } from '@/components/HeroSection';
import { ProductExplanation } from '@/components/ProductExplanation';
import { FeaturesSection } from '@/components/FeaturesSection';
import { ValueProposition } from '@/components/ValueProposition';
import { CollapsibleWaitlistForm } from '@/components/waitlist/CollapsibleWaitlistForm';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/layout/Header';
import { useLanguage } from '@/context/LanguageContext';

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
      <Header 
        translations={t}
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
        <ValueProposition language={language} />
        <CollapsibleWaitlistForm language={language} />
        <Footer language={language} />
      </div>
    </div>
  );
};

export default Index;
