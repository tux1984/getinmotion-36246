
import React from 'react';
import { Button } from '@/components/ui/button';
import { ProfileType } from '@/types/dashboard';
import { Sparkles, Rocket, Users, Lightbulb } from 'lucide-react';

interface StreamlinedWelcomeStepProps {
  profileType: ProfileType;
  language: 'en' | 'es';
  onNext: () => void;
}

export const StreamlinedWelcomeStep: React.FC<StreamlinedWelcomeStepProps> = ({
  profileType,
  language,
  onNext
}) => {
  const translations = {
    en: {
      welcome: 'Welcome to Your Creative Journey!',
      subtitle: 'Let\'s set up your personalized workspace with AI-powered recommendations',
      profileTypes: {
        idea: { title: 'Creative Idea', description: 'You have a creative concept and want to validate and develop it' },
        solo: { title: 'Solo Creative', description: 'You\'re working independently on creative projects' },
        team: { title: 'Creative Team', description: 'You lead or are part of a creative team or organization' }
      },
      benefits: [
        'AI-powered personalized recommendations',
        'Specialized agents for your creative needs',
        'Tailored action plans based on your maturity level',
        'Direct integration with expert tools'
      ],
      estimatedTime: 'Estimated time: 3-5 minutes',
      startJourney: 'Start My Journey'
    },
    es: {
      welcome: '¡Bienvenido a Tu Viaje Creativo!',
      subtitle: 'Configuremos tu espacio de trabajo personalizado con recomendaciones impulsadas por IA',
      profileTypes: {
        idea: { title: 'Idea Creativa', description: 'Tienes un concepto creativo y quieres validarlo y desarrollarlo' },
        solo: { title: 'Creativo Solo', description: 'Trabajas de forma independiente en proyectos creativos' },
        team: { title: 'Equipo Creativo', description: 'Lideras o formas parte de un equipo u organización creativa' }
      },
      benefits: [
        'Recomendaciones personalizadas con IA',
        'Agentes especializados para tus necesidades creativas',
        'Planes de acción adaptados a tu nivel de madurez',
        'Integración directa con herramientas expertas'
      ],
      estimatedTime: 'Tiempo estimado: 3-5 minutos',
      startJourney: 'Comenzar Mi Viaje'
    }
  };

  const t = translations[language];
  const profileInfo = t.profileTypes[profileType];

  const getProfileIcon = () => {
    switch (profileType) {
      case 'idea': return Lightbulb;
      case 'solo': return Rocket;
      case 'team': return Users;
      default: return Sparkles;
    }
  };

  const Icon = getProfileIcon();

  return (
    <div className="p-8 text-center">
      <div className="mb-6">
        <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {t.welcome}
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          {t.subtitle}
        </p>
      </div>

      {/* Profile Type Display */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-6 mb-6 max-w-md mx-auto">
        <h3 className="font-semibold text-purple-900 mb-2">
          {profileInfo.title}
        </h3>
        <p className="text-purple-700 text-sm">
          {profileInfo.description}
        </p>
      </div>

      {/* Benefits */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 max-w-2xl mx-auto">
        {t.benefits.map((benefit, index) => (
          <div key={index} className="flex items-center text-left">
            <Sparkles className="w-5 h-5 text-purple-500 mr-3 flex-shrink-0" />
            <span className="text-gray-700 text-sm">{benefit}</span>
          </div>
        ))}
      </div>

      <div className="mb-6">
        <p className="text-sm text-gray-500 mb-4">{t.estimatedTime}</p>
        <Button 
          onClick={onNext}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 text-lg"
        >
          {t.startJourney}
        </Button>
      </div>
    </div>
  );
};
