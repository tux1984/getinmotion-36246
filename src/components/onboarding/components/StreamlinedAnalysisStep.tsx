
import React, { useState, useEffect } from 'react';
import { CategoryScore, RecommendedAgents } from '@/types/dashboard';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Brain, Zap, Target, Clock } from 'lucide-react';

interface StreamlinedAnalysisStepProps {
  language: 'en' | 'es';
  maturityScores: CategoryScore | null;
  profileData: any;
  onAnalysisChoice: (type: 'quick' | 'deep') => void;
  onNext: () => void;
  onPrevious: () => void;
  setBasicRecommendations: (recommendations: RecommendedAgents) => void;
}

export const StreamlinedAnalysisStep: React.FC<StreamlinedAnalysisStepProps> = ({
  language,
  maturityScores,
  profileData,
  onAnalysisChoice,
  onNext,
  onPrevious,
  setBasicRecommendations
}) => {
  const translations = {
    en: {
      title: 'AI-Powered Analysis',
      subtitle: 'Choose how deep you want your personalized recommendations to be',
      quick: {
        title: 'Quick Analysis',
        subtitle: '3 additional questions',
        time: '2 minutes',
        description: 'Get solid recommendations based on your assessment and a few key questions'
      },
      deep: {
        title: 'Deep Analysis',
        subtitle: 'AI-generated personalized questions',
        time: '5 minutes',
        description: 'Get highly personalized recommendations with AI-generated questions specific to your situation'
      },
      features: {
        quick: ['Immediate recommendations', 'Core agent selection', 'Basic action plan'],
        deep: ['Hyper-personalized questions', 'Advanced AI recommendations', 'Detailed implementation roadmap', 'Priority task generation']
      },
      choose: 'Choose This Option',
      back: 'Back'
    },
    es: {
      title: 'Análisis Impulsado por IA',
      subtitle: 'Elige qué tan profundas quieres que sean tus recomendaciones personalizadas',
      quick: {
        title: 'Análisis Rápido',
        subtitle: '3 preguntas adicionales',
        time: '2 minutos',
        description: 'Obtén recomendaciones sólidas basadas en tu evaluación y algunas preguntas clave'
      },
      deep: {
        title: 'Análisis Profundo',
        subtitle: 'Preguntas personalizadas generadas por IA',
        time: '5 minutos',
        description: 'Obtén recomendaciones altamente personalizadas con preguntas generadas por IA específicas para tu situación'
      },
      features: {
        quick: ['Recomendaciones inmediatas', 'Selección de agentes principales', 'Plan de acción básico'],
        deep: ['Preguntas hiper-personalizadas', 'Recomendaciones avanzadas de IA', 'Hoja de ruta detallada de implementación', 'Generación de tareas prioritarias']
      },
      choose: 'Elegir Esta Opción',
      back: 'Atrás'
    }
  };

  const t = translations[language];

  const generateBasicRecommendations = (type: 'quick' | 'deep') => {
    // Generate basic recommendations based on profile data and maturity scores
    const recommendations: RecommendedAgents = {
      admin: true,
      cultural: true,
      accounting: false,
      legal: false,
      operations: false
    };

    // Add more agents based on maturity scores and profile data
    if (maturityScores) {
      if (maturityScores.monetization > 30) {
        recommendations.accounting = true;
      }
      if (maturityScores.marketFit > 40) {
        recommendations.operations = true;
      }
    }

    if (profileData?.experience === 'expert' || profileData?.experience === 'experienced') {
      recommendations.legal = true;
    }

    setBasicRecommendations(recommendations);
  };

  const handleChoice = (type: 'quick' | 'deep') => {
    console.log('Analysis choice selected:', type);
    generateBasicRecommendations(type);
    onAnalysisChoice(type);
    onNext();
  };

  return (
    <div className="p-8">
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={onPrevious}
          className="mr-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t.back}
        </Button>
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">{t.title}</h2>
          <p className="text-gray-600">{t.subtitle}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {/* Quick Analysis */}
        <div className="border border-gray-200 rounded-lg p-6 hover:border-purple-300 transition-colors">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
              <Zap className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{t.quick.title}</h3>
              <p className="text-sm text-gray-500">{t.quick.subtitle}</p>
            </div>
          </div>
          
          <div className="flex items-center text-sm text-gray-600 mb-4">
            <Clock className="w-4 h-4 mr-2" />
            {t.quick.time}
          </div>

          <p className="text-gray-600 mb-4 text-sm">{t.quick.description}</p>

          <ul className="space-y-2 mb-6">
            {t.features.quick.map((feature, index) => (
              <li key={index} className="flex items-center text-sm text-gray-600">
                <Target className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                {feature}
              </li>
            ))}
          </ul>

          <Button 
            onClick={() => handleChoice('quick')}
            variant="outline"
            className="w-full border-blue-200 hover:bg-blue-50"
          >
            {t.choose}
          </Button>
        </div>

        {/* Deep Analysis */}
        <div className="border border-purple-200 rounded-lg p-6 bg-gradient-to-br from-purple-50 to-pink-50 hover:border-purple-300 transition-colors">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-4">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{t.deep.title}</h3>
              <p className="text-sm text-purple-600 font-medium">{t.deep.subtitle}</p>
            </div>
          </div>
          
          <div className="flex items-center text-sm text-gray-600 mb-4">
            <Clock className="w-4 h-4 mr-2" />
            {t.deep.time}
          </div>

          <p className="text-gray-600 mb-4 text-sm">{t.deep.description}</p>

          <ul className="space-y-2 mb-6">
            {t.features.deep.map((feature, index) => (
              <li key={index} className="flex items-center text-sm text-gray-600">
                <Target className="w-4 h-4 text-purple-500 mr-2 flex-shrink-0" />
                {feature}
              </li>
            ))}
          </ul>

          <Button 
            onClick={() => handleChoice('deep')}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            {t.choose}
          </Button>
        </div>
      </div>
    </div>
  );
};
