
import React, { useState } from 'react';
import { HeroSection } from '@/components/HeroSection';
import { ProductExplanation } from '@/components/ProductExplanation';
import { ValueProposition } from '@/components/ValueProposition';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/layout/Header';
import { UserProfileSection } from '@/components/sections/UserProfileSection';
import { CollapsibleWaitlistForm } from '@/components/waitlist/CollapsibleWaitlistForm';
import { useLanguage } from '@/context/LanguageContext';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Index = () => {
  const { language } = useLanguage();
  const [showWaitlist, setShowWaitlist] = useState(false);
  
  // Translations object
  const translations = {
    en: {
      navAbout: "About Us",
      navCases: "Case Studies",
      navAccess: "Access",
      accessPlatform: "Access Platform",
      accessDescription: "Sign in to access your personalized cultural creation dashboard",
      loginButton: "Sign In"
    },
    es: {
      navAbout: "Nosotros",
      navCases: "Casos",
      navAccess: "Acceder",
      accessPlatform: "Acceder a la Plataforma",
      accessDescription: "Inicia sesión para acceder a tu dashboard personalizado de creación cultural",
      loginButton: "Iniciar Sesión"
    }
  };
  
  const t = translations[language];

  const handleAccessClick = () => {
    document.getElementById('access')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleJoinWaitlist = () => {
    setShowWaitlist(true);
    document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' });
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
        <HeroSection language={language} onJoinWaitlist={handleJoinWaitlist} />
        
        {/* User Profile Types Module */}
        <UserProfileSection />
        
        {/* Product Explanation Module */}
        <div className="w-full">
          <ProductExplanation />
        </div>

        {/* New Collapsible Waitlist Section */}
        <CollapsibleWaitlistForm language={language} />
        
        {/* Access Section - Simplified */}
        <div className="w-full py-8 md:py-12 px-4 sm:px-6 lg:px-8" id="access">
          <div className="w-full max-w-2xl mx-auto">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl blur-sm opacity-75 group-hover:opacity-100 transition duration-300"></div>
              <div className="bg-indigo-950/90 backdrop-blur-sm rounded-xl shadow-xl overflow-hidden relative border border-indigo-800/30">
                <div className="p-4 md:p-8 text-center">
                  <h2 className="text-xl sm:text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-purple-300">
                    {t.accessPlatform}
                  </h2>
                  <p className="text-indigo-200 mb-6">
                    {t.accessDescription}
                  </p>
                  <Link to="/login">
                    <Button className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white border-none">
                      {t.loginButton}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <ValueProposition language={language} />
      </main>
      
      <Footer language={language} />
    </div>
  );
};

export default Index;
