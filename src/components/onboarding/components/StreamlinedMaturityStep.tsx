
import React from 'react';
import { ProfileType, CategoryScore, RecommendedAgents } from '@/types/dashboard';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { SimpleCulturalMaturityCalculator } from '@/components/cultural/SimpleCulturalMaturityCalculator';

interface StreamlinedMaturityStepProps {
  profileType: ProfileType;
  language: 'en' | 'es';
  onComplete: (scores: CategoryScore) => void;
  onPrevious: () => void;
  setBasicRecommendations: (recommendations: RecommendedAgents) => void;
}

export const StreamlinedMaturityStep: React.FC<StreamlinedMaturityStepProps> = ({
  profileType,
  language,
  onComplete,
  onPrevious,
  setBasicRecommendations
}) => {
  const translations = {
    en: {
      title: 'Quick Creative Assessment',
      subtitle: 'Help us understand your current situation to provide better recommendations',
      back: 'Back'
    },
    es: {
      title: 'Evaluación Creativa Rápida',
      subtitle: 'Ayúdanos a entender tu situación actual para brindarte mejores recomendaciones',
      back: 'Atrás'
    }
  };

  const t = translations[language];

  const handleComplete = (scores: CategoryScore, recommendedAgents: RecommendedAgents) => {
    setBasicRecommendations(recommendedAgents);
    onComplete(scores);
  };

  return (
    <div className="p-6">
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
          <h2 className="text-xl font-semibold text-gray-900">{t.title}</h2>
          <p className="text-gray-600 text-sm">{t.subtitle}</p>
        </div>
      </div>

      <SimpleCulturalMaturityCalculator
        language={language}
        onComplete={handleComplete}
      />
    </div>
  );
};
