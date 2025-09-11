import React from 'react';
import { IntelligentShopCreationWizard } from '@/components/shop/IntelligentShopCreationWizard';
import { useLanguage } from '@/context/LanguageContext';
import { mapToLegacyLanguage } from '@/utils/languageMapper';

export const CreateShopPage: React.FC = () => {
  const { language } = useLanguage();
  const compatibleLanguage = mapToLegacyLanguage(language);

  return <IntelligentShopCreationWizard language={compatibleLanguage} />;
};