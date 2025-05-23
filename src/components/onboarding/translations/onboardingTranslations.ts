
import { ProfileType } from '@/types/dashboard';

type OnboardingTranslations = {
  en: {
    welcome: string;
    welcomeDesc: string;
    profileQuestions: string;
    profileQuestionsDesc: string;
    initialRecommendations: string;
    initialRecommendationsDesc: string;
    extendedQuestions: string;
    extendedQuestionsDesc: string;
    compareResults: string;
    compareResultsDesc: string;
    finalizing: string;
    finalizingDesc: string;
  };
  es: {
    welcome: string;
    welcomeDesc: string;
    profileQuestions: string;
    profileQuestionsDesc: string;
    initialRecommendations: string;
    initialRecommendationsDesc: string;
    extendedQuestions: string;
    extendedQuestionsDesc: string;
    compareResults: string;
    compareResultsDesc: string;
    finalizing: string;
    finalizingDesc: string;
  };
};

export const getOnboardingTranslations = (profileType: ProfileType): OnboardingTranslations => {
  return {
    en: {
      welcome: "Welcome to GET IN MOTION",
      welcomeDesc: "Let's set up your workspace based on your project status.",
      profileQuestions: "Tell us about your project",
      profileQuestionsDesc: `Let's learn more about your ${profileType === 'idea' ? 'idea' : profileType === 'team' ? 'team' : 'solo project'}.`,
      initialRecommendations: "Your initial recommendations",
      initialRecommendationsDesc: "Based on your profile, here are our initial recommendations for you.",
      extendedQuestions: "Enhanced analysis",
      extendedQuestionsDesc: "Let's dive deeper to provide more personalized recommendations.",
      compareResults: "Compare recommendations",
      compareResultsDesc: "See how additional information refined our recommendations for you.",
      finalizing: "Finalizing Your Workspace",
      finalizingDesc: "We're setting up your personalized dashboard with the recommended tools."
    },
    es: {
      welcome: "Bienvenido a GET IN MOTION",
      welcomeDesc: "Configuremos tu espacio de trabajo según el estado de tu proyecto.",
      profileQuestions: "Cuéntanos sobre tu proyecto",
      profileQuestionsDesc: `Conozcamos más sobre tu ${profileType === 'idea' ? 'idea' : profileType === 'team' ? 'equipo' : 'proyecto individual'}.`,
      initialRecommendations: "Tus recomendaciones iniciales",
      initialRecommendationsDesc: "Basado en tu perfil, aquí están nuestras recomendaciones iniciales para ti.",
      extendedQuestions: "Análisis mejorado",
      extendedQuestionsDesc: "Profundicemos más para brindarte recomendaciones más personalizadas.",
      compareResults: "Comparar recomendaciones",
      compareResultsDesc: "Mira cómo la información adicional refinó nuestras recomendaciones para ti.",
      finalizing: "Finalizando Tu Espacio de Trabajo",
      finalizingDesc: "Estamos configurando tu panel personalizado con las herramientas recomendadas."
    }
  };
};
