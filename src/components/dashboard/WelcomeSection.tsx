
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';

export const WelcomeSection = () => {
  const { language } = useLanguage();
  
  const translations = {
    en: {
      welcome: "Welcome to GET IN MOTION MVP!",
      welcomeText: "This is an early version of the dashboard. You can now interact with your back office agents."
    },
    es: {
      welcome: "¡Bienvenido al MVP de GET IN MOTION!",
      welcomeText: "Esta es una versión temprana del dashboard. Ahora puedes interactuar con tus agentes de oficina."
    }
  };
  
  const t = translations[language];

  return (
    <div className="mb-8">
      <h1 className="text-2xl font-bold mb-1">{t.welcome}</h1>
      <p className="text-gray-600">
        {t.welcomeText}
      </p>
    </div>
  );
};
