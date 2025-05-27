
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
  const profileDescriptions = {
    en: {
      idea: 'cultural idea',
      solo: 'cultural venture',
      team: 'cultural team project'
    },
    es: {
      idea: 'idea cultural',
      solo: 'emprendimiento cultural',
      team: 'proyecto cultural en equipo'
    }
  };

  return {
    en: {
      welcome: "Welcome to GET IN MOTION",
      welcomeDesc: "Let's set up your cultural workspace based on your creative project.",
      profileQuestions: "Tell us about your cultural project",
      profileQuestionsDesc: `Let's learn more about your ${profileDescriptions.en[profileType]} and creative industry.`,
      initialRecommendations: "Your personalized cultural agents",
      initialRecommendationsDesc: "Based on your cultural entrepreneur profile, here are our specialized recommendations.",
      extendedQuestions: "Deep cultural analysis",
      extendedQuestionsDesc: "Let's dive deeper into your creative business to provide more specialized recommendations.",
      compareResults: "Enhanced recommendations",
      compareResultsDesc: "See how the additional information refined our cultural agent recommendations for you.",
      finalizing: "Setting up your creative workspace",
      finalizingDesc: "We're preparing your personalized dashboard with specialized tools for cultural entrepreneurs."
    },
    es: {
      welcome: "Bienvenido a GET IN MOTION",
      welcomeDesc: "Configuremos tu espacio de trabajo cultural según tu proyecto creativo.",
      profileQuestions: "Contanos sobre tu proyecto cultural",
      profileQuestionsDesc: `Conozcamos más sobre tu ${profileDescriptions.es[profileType]} y tu industria creativa.`,
      initialRecommendations: "Tus agentes culturales personalizados",
      initialRecommendationsDesc: "Basado en tu perfil de emprendedor cultural, aquí están nuestras recomendaciones especializadas.",
      extendedQuestions: "Análisis cultural profundo", 
      extendedQuestionsDesc: "Profundicemos más en tu negocio creativo para brindarte recomendaciones más especializadas.",
      compareResults: "Recomendaciones mejoradas",
      compareResultsDesc: "Mirá cómo la información adicional refinó nuestras recomendaciones de agentes culturales para vos.",
      finalizing: "Configurando tu espacio creativo",
      finalizingDesc: "Estamos preparando tu panel personalizado con herramientas especializadas para emprendedores culturales."
    }
  };
};
