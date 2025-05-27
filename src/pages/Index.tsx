
import React from 'react';
import { HeroSection } from '@/components/HeroSection';
import { ProductExplanation } from '@/components/ProductExplanation';
import { ValueProposition } from '@/components/ValueProposition';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/layout/Header';
import { AccessSection } from '@/components/sections/AccessSection';
import { UserProfileSection } from '@/components/sections/UserProfileSection';
import { useLanguage } from '@/context/LanguageContext';
import { useAccessForm } from '@/hooks/useAccessForm';

const Index = () => {
  const { language } = useLanguage();
  
  // Translations object
  const translations = {
    en: {
      navAbout: "About Us",
      navCases: "Case Studies",
      navAccess: "Access",
      formTitle: "Join GET IN MOTION",
      waitlist: "Waitlist",
      accessCode: "I have a code",
      accessCodePlaceholder: "Access code",
      verifying: "Verifying...",
      accessButton: "Access MVP",
      incorrectCode: "Incorrect code",
      invalidCodeMessage: "The access code you entered is invalid.",
      maturityCalculator: "Project Maturity Calculator",
      maturityCalculatorDesc: "Evaluate your project's maturity and get personalized recommendations"
    },
    es: {
      navAbout: "Nosotros",
      navCases: "Casos",
      navAccess: "Acceder",
      formTitle: "Únete a GET IN MOTION",
      waitlist: "Lista de espera",
      accessCode: "Tengo un código",
      accessCodePlaceholder: "Código de acceso",
      verifying: "Verificando...",
      accessButton: "Acceder al MVP",
      incorrectCode: "Código incorrecto",
      invalidCodeMessage: "El código de acceso que has introducido no es válido.",
      maturityCalculator: "Calculadora de Madurez del Proyecto",
      maturityCalculatorDesc: "Evalúa la madurez de tu proyecto y obtén recomendaciones personalizadas"
    }
  };
  
  const t = translations[language];
  
  const {
    accessCode,
    setAccessCode,
    isLoading,
    showWaitlistForm,
    setShowWaitlistForm,
    validCode,
    handleAccessSubmit,
    handleWaitlistClick,
    handleWaitlistSubmitted,
    handleCodeSubmitted
  } = useAccessForm({ translations: t });

  const handleAccessClick = () => {
    document.getElementById('access')?.scrollIntoView({ behavior: 'smooth' });
  };
  
  return (
    <div className="home-layout flex flex-col min-h-screen w-full bg-gradient-to-b from-indigo-950 to-purple-950">
      <Header 
        translations={{
          navAbout: t.navAbout,
          navCases: t.navCases,
          navAccess: t.navAccess
        }}
        onAccessClick={handleAccessClick}
      />
      
      <main className="flex-grow w-full">
        <HeroSection language={language} onJoinWaitlist={handleWaitlistClick} />
        
        {/* User Profile Types Module */}
        <UserProfileSection />
        
        {/* Product Explanation Module */}
        <div className="w-full">
          <ProductExplanation />
        </div>
        
        {/* Access Form Section */}
        <AccessSection
          language={language}
          translations={{
            formTitle: t.formTitle,
            waitlist: t.waitlist,
            accessCode: t.accessCode,
            accessCodePlaceholder: t.accessCodePlaceholder,
            verifying: t.verifying,
            accessButton: t.accessButton,
            maturityCalculator: t.maturityCalculator,
            maturityCalculatorDesc: t.maturityCalculatorDesc
          }}
          accessCode={accessCode}
          setAccessCode={setAccessCode}
          isLoading={isLoading}
          showWaitlistForm={showWaitlistForm}
          setShowWaitlistForm={setShowWaitlistForm}
          validCode={validCode}
          handleAccessSubmit={handleAccessSubmit}
          handleWaitlistSubmitted={handleWaitlistSubmitted}
          handleCodeSubmitted={handleCodeSubmitted}
        />
        
        <ValueProposition language={language} />
      </main>
      
      <Footer language={language} />
    </div>
  );
};

export default Index;
