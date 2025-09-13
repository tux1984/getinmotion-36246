import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { ConversationalShopCreation } from '@/components/shop/ConversationalShopCreation';
import { IntelligentShopCreationWizard } from '@/components/shop/IntelligentShopCreationWizard';
import { useLanguage } from '@/context/LanguageContext';
import { mapToLegacyLanguage } from '@/utils/languageMapper';

export const CreateShopPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { language } = useLanguage();
  const compatibleLanguage = mapToLegacyLanguage(language);
  
  // Check if conversational mode is requested
  const isConversational = searchParams.get('mode') === 'conversational';

  // Use conversational mode by default for new intelligent experience
  if (isConversational || true) {
    return <ConversationalShopCreation />;
  }

  return <IntelligentShopCreationWizard language={compatibleLanguage} />;
};