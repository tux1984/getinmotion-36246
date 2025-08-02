
import React from 'react';
import { useTranslations } from '@/hooks/useTranslations';

export const WelcomeSection = () => {
  const { t } = useTranslations();

  return (
    <div className="mb-8">
      <h1 className="text-2xl font-bold mb-1">{t.dashboard.welcome}</h1>
      <p className="text-gray-600">
        {t.dashboard.welcomeText}
      </p>
    </div>
  );
};
