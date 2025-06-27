import React from 'react';
import { CategoryScore, RecommendedAgents } from '@/types/dashboard';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle, Sparkles } from 'lucide-react';
import { AgentRecommendationCard } from './AgentRecommendationCard';

interface StreamlinedResultsStepProps {
  maturityScores: CategoryScore | null;
  basicRecommendations: RecommendedAgents | null;
  analysisType: 'quick' | 'deep' | null;
  language: 'en' | 'es';
  profileData: any;
  onComplete: (recommendations: RecommendedAgents) => void;
  onPrevious: () => void;
}

export const StreamlinedResultsStep: React.FC<StreamlinedResultsStepProps> = ({
  maturityScores,
  basicRecommendations,
  analysisType,
  language,
  profileData,
  onComplete,
  onPrevious
}) => {
  const translations = {
    en: {
      title: 'Your Personalized Creative Workspace',
      subtitle: 'Based on your assessment, we\'ve selected the perfect agents for your journey',
      analysisComplete: 'Analysis Complete',
      recommendedAgents: 'Recommended Agents',
      setupWorkspace: 'Set Up My Workspace',
      back: 'Back',
      maturityLevel: 'Your Creative Maturity Level',
      nextSteps: 'What happens next:',
      steps: [
        'Your selected agents will be activated',
        'You\'ll get personalized task recommendations',
        'Start working with AI-powered creative assistance'
      ]
    },
    es: {
      title: 'Tu Espacio de Trabajo Creativo Personalizado',
      subtitle: 'Basado en tu evaluación, hemos seleccionado los agentes perfectos para tu viaje',
      analysisComplete: 'Análisis Completo',
      recommendedAgents: 'Agentes Recomendados',
      setupWorkspace: 'Configurar Mi Espacio',
      back: 'Atrás',
      maturityLevel: 'Tu Nivel de Madurez Creativa',
      nextSteps: 'Qué sigue:',
      steps: [
        'Tus agentes seleccionados serán activados',
        'Recibirás recomendaciones de tareas personalizadas',
        'Comenzarás a trabajar con asistencia creativa impulsada por IA'
      ]
    }
  };

  const t = translations[language];

  const finalRecommendations: RecommendedAgents = basicRecommendations || {
    admin: true,
    cultural: true,
    accounting: false,
    legal: false,
    operations: false
  };

  const getMaturityLevel = () => {
    if (!maturityScores) return { level: 'Beginner', percentage: 25 };
    
    const average = Object.values(maturityScores).reduce((a, b) => a + b, 0) / 4;
    
    if (average >= 70) return { level: language === 'en' ? 'Advanced' : 'Avanzado', percentage: average };
    if (average >= 40) return { level: language === 'en' ? 'Intermediate' : 'Intermedio', percentage: average };
    return { level: language === 'en' ? 'Beginner' : 'Principiante', percentage: average };
  };

  const maturityLevel = getMaturityLevel();

  const handleComplete = () => {
    console.log('Completing onboarding with profile data:', profileData);
    onComplete(finalRecommendations);
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
          <div className="flex items-center mb-2">
            <CheckCircle className="w-6 h-6 text-green-500 mr-2" />
            <span className="text-green-600 font-medium">{t.analysisComplete}</span>
          </div>
          <h2 className="text-2xl font-semibold text-gray-900">{t.title}</h2>
          <p className="text-gray-600">{t.subtitle}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Maturity Level Display */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-6 mb-8">
          <h3 className="font-semibold text-purple-900 mb-2">{t.maturityLevel}</h3>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-purple-700">{maturityLevel.level}</span>
                <span className="text-purple-600">{Math.round(maturityLevel.percentage)}%</span>
              </div>
              <div className="w-full bg-purple-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${maturityLevel.percentage}%` }}
                />
              </div>
            </div>
            <Sparkles className="w-8 h-8 text-purple-500" />
          </div>
        </div>

        {/* Recommended Agents */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.recommendedAgents}</h3>
          <div className="grid gap-4">
            <AgentRecommendationCard
              agentKey="admin"
              enabled={finalRecommendations.admin}
              language={language}
            />
            <AgentRecommendationCard
              agentKey="cultural"
              enabled={finalRecommendations.cultural}
              language={language}
            />
            {finalRecommendations.accounting && (
              <AgentRecommendationCard
                agentKey="accounting"
                enabled={finalRecommendations.accounting}
                language={language}
              />
            )}
            {finalRecommendations.operations && (
              <AgentRecommendationCard
                agentKey="operations"
                enabled={finalRecommendations.operations}
                language={language}
              />
            )}
            {finalRecommendations.legal && (
              <AgentRecommendationCard
                agentKey="legal"
                enabled={finalRecommendations.legal}
                language={language}
              />
            )}
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h3 className="font-semibold text-gray-900 mb-4">{t.nextSteps}</h3>
          <ul className="space-y-3">
            {t.steps.map((step, index) => (
              <li key={index} className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                <span className="text-gray-700">{step}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="text-center">
          <Button
            onClick={handleComplete}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 text-lg"
          >
            {t.setupWorkspace}
          </Button>
        </div>
      </div>
    </div>
  );
};
