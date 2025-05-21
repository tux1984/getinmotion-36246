
import React from 'react';
import { Button } from '@/components/ui/button';
import { MotionLogo } from '@/components/MotionLogo';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { useLanguage } from '@/context/LanguageContext';

export const DashboardHeader = () => {
  const { language } = useLanguage();
  
  const translations = {
    en: {
      help: "Help",
      account: "Account"
    },
    es: {
      help: "Ayuda",
      account: "Cuenta"
    }
  };
  
  const t = translations[language];

  return (
    <header className="bg-white border-b border-slate-200 py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <MotionLogo variant="dark" className="py-1" />
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          <Button variant="ghost" size="sm">
            {t.help}
          </Button>
          <Button variant="ghost" size="sm">
            {t.account}
          </Button>
        </div>
      </div>
    </header>
  );
};
