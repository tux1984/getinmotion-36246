
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';

// Component for displaying the onboarding steps
export const OnboardingSteps: React.FC<{
  currentStep: number;
  language: 'en' | 'es';
}> = ({ currentStep }) => {
  const { language } = useLanguage();
  
  const translations = {
    en: {
      welcome: "Welcome to GET IN MOTION",
      welcomeDesc: "Let's set up your workspace based on your project status.",
      calculatingMaturity: "Calculating Project Maturity",
      calculatingMaturityDesc: "Let's evaluate your project's current state to recommend the best tools.",
      recommendingAgents: "Recommending Agents",
      recommendingAgentsDesc: "Based on your project profile and maturity level, we're selecting the best copilots for you.",
      finalizing: "Finalizing Your Workspace",
      finalizingDesc: "We're setting up your personalized dashboard with the recommended tools."
    },
    es: {
      welcome: "Bienvenido a GET IN MOTION",
      welcomeDesc: "Configuremos tu espacio de trabajo según el estado de tu proyecto.",
      calculatingMaturity: "Calculando Madurez del Proyecto",
      calculatingMaturityDesc: "Evaluemos el estado actual de tu proyecto para recomendar las mejores herramientas.",
      recommendingAgents: "Recomendando Agentes",
      recommendingAgentsDesc: "Basado en tu perfil de proyecto y nivel de madurez, estamos seleccionando los mejores copilotos para ti.",
      finalizing: "Finalizando Tu Espacio de Trabajo",
      finalizingDesc: "Estamos configurando tu panel personalizado con las herramientas recomendadas."
    }
  };
  
  const t = translations[language];
  
  const steps = [
    {
      title: t.welcome,
      description: t.welcomeDesc
    },
    {
      title: t.calculatingMaturity,
      description: t.calculatingMaturityDesc
    },
    {
      title: t.recommendingAgents,
      description: t.recommendingAgentsDesc
    },
    {
      title: t.finalizing,
      description: t.finalizingDesc
    }
  ];

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        {steps.map((step, index) => (
          <div key={index}>
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                index <= currentStep ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                {index + 1}
              </div>
              <span className={`mt-1 text-xs ${
                index <= currentStep ? 'text-indigo-600 font-medium' : 'text-gray-500'
              }`}>
                {step.title}
              </span>
            </div>
            
            {index < steps.length - 1 && (
              <div className={`h-1 flex-1 mx-2 ${
                index < currentStep ? 'bg-indigo-600' : 'bg-gray-200'
              }`} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
