
import React, { useState, useCallback } from 'react';
import { CategoryScore, RecommendedAgents } from '@/types/dashboard';
import { CulturalMaturityWizard } from './CulturalMaturityWizard';

interface AIRecommendation {
  title: string;
  description: string;
  priority: 'High' | 'Medium' | 'Low' | 'Alta' | 'Media' | 'Baja';
  timeframe: string;
}

interface SimpleCulturalMaturityCalculatorProps {
  language: 'en' | 'es';
  onComplete: (scores: CategoryScore, recommendedAgents: RecommendedAgents, aiRecommendations?: AIRecommendation[]) => void;
}

export const SimpleCulturalMaturityCalculator: React.FC<SimpleCulturalMaturityCalculatorProps> = ({
  language,
  onComplete
}) => {
  const handleWizardComplete = useCallback((
    scores: CategoryScore, 
    recommendedAgents: RecommendedAgents, 
    aiRecommendations?: AIRecommendation[]
  ) => {
    onComplete(scores, recommendedAgents, aiRecommendations);
  }, [onComplete]);

  return (
    <div className="w-full">
      <CulturalMaturityWizard onComplete={handleWizardComplete} />
    </div>
  );
};
