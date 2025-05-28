
import React, { useState } from 'react';
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

  const translations = {
    en: {
      navAgents: "Agents",
      navAccess: "Get Access"
    },
    es: {
      navAgents: "Agentes",
      navAccess: "Obtener Acceso"
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
  );
};

export default Index;
