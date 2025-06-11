
import React, { useState, useEffect } from 'react';
import { ProfileType, CategoryScore } from '@/types/dashboard';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Brain, Zap, Target, Clock } from 'lucide-react';
import { DynamicQuestionsStep } from '@/components/cultural/wizard-steps/DynamicQuestionsStep';

interface StreamlinedAIAnalysisStepProps {
  profileType: ProfileType;
  maturityScores: CategoryScore | null;
  language: 'en' | 'es';
  onAnalysisChoice: (type: 'quick' | 'deep') => void;
  onComplete: () => void;
  onPrevious: () => void;
  analysisType: 'quick' | 'deep' | null;
}

export const StreamlinedAIAnalysisStep: React.FC<StreamlinedAIAnalysisStepProps> = ({
  profileType,
  maturityScores,
  language,
  onAnalysisChoice,
  onComplete,
  onPrevious,
  analysisType
}) => {
  const [showDynamicQuestions, setShowDynamicQuestions] = useState(false);
  const [profileData, setProfileData] = useState({
    profileType,
    industry: '',
    activities: [],
    experience: '',
    dynamicQuestionAnswers: {}
  });

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
      back: 'Back',
      continue: 'Continue'
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
      back: 'Atrás',
      continue: 'Continuar'
    }
  };

  const t = translations[language];

  useEffect(() => {
    if (analysisType === 'deep') {
      setShowDynamicQuestions(true);
    } else if (analysisType === 'quick') {
      // For quick analysis, we proceed directly
      setTimeout(onComplete, 100);
    }
  }, [analysisType, onComplete]);

  const handleDynamicQuestionsComplete = () => {
    onComplete();
  };

  const updateProfileData = (data: any) => {
    setProfileData(prev => ({ ...prev, ...data }));
  };

  if (showDynamicQuestions && analysisType === 'deep') {
    return (
      <div className="p-6">
        <DynamicQuestionsStep
          profileData={profileData}
          updateProfileData={updateProfileData}
          language={language}
          currentStepNumber={3}
          totalSteps={4}
          onNext={handleDynamicQuestionsComplete}
          onPrevious={onPrevious}
          isStepValid={true}
        />
      </div>
    );
  }

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
            onClick={() => onAnalysisChoice('quick')}
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
            onClick={() => onAnalysisChoice('deep')}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            {t.choose}
          </Button>
        </div>
      </div>
    </div>
  );
};
