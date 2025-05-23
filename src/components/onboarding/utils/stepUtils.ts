
import { ProfileType } from '@/types/dashboard';
import { getOnboardingTranslations } from '../translations/onboardingTranslations';

export const buildOnboardingSteps = (profileType: ProfileType, language: 'en' | 'es', showExtendedQuestions: boolean) => {
  const translations = getOnboardingTranslations(profileType)[language];
  
  const steps = [
    {
      title: translations.welcome,
      description: translations.welcomeDesc
    },
    {
      title: translations.profileQuestions,
      description: translations.profileQuestionsDesc
    },
    {
      title: showExtendedQuestions ? translations.extendedQuestions : translations.initialRecommendations,
      description: showExtendedQuestions ? translations.extendedQuestionsDesc : translations.initialRecommendationsDesc
    },
    {
      title: showExtendedQuestions ? translations.compareResults : translations.finalizing,
      description: showExtendedQuestions ? translations.compareResultsDesc : translations.finalizingDesc
    },
    ...(showExtendedQuestions ? [{
      title: translations.finalizing,
      description: translations.finalizingDesc
    }] : [])
  ];
  
  return steps;
};
