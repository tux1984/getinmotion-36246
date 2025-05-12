
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';

export const WelcomeSection = () => {
  const { language } = useLanguage();
  
  const translations = {
    en: {
      welcome: "Welcome to Motion MVP!",
      welcomeText: "This is an early version of the dashboard. You can now interact with your copilots."
    },
    es: {
      welcome: "¡Bienvenido al MVP de Motion!",
      welcomeText: "Esta es una versión temprana del dashboard. Ahora puedes interactuar con tus copilots."
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
