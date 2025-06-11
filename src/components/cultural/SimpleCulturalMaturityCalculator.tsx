
import React, { useState, useCallback } from 'react';
import { CategoryScore, RecommendedAgents } from '@/types/dashboard';
import { CulturalMaturityWizard } from './CulturalMaturityWizard';
import { useAuth } from '@/context/AuthContext';
import { createUserAgentsFromRecommendations, markOnboardingComplete } from '@/utils/onboardingUtils';

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
  const { user } = useAuth();

  const handleWizardComplete = useCallback(async (
    scores: CategoryScore, 
    recommendedAgents: RecommendedAgents, 
    aiRecommendations?: AIRecommendation[]
  ) => {
    console.log('SimpleCulturalMaturityCalculator: Wizard completed', { scores, recommendedAgents });
    
    // ARREGLO CRÍTICO: Marcar onboarding como completado y crear agentes
    try {
      // 1. Marcar en localStorage inmediatamente
      markOnboardingComplete(scores, recommendedAgents);
      
      // 2. Si hay usuario autenticado, crear agentes en la BD
      if (user?.id) {
        console.log('Creating user agents for user:', user.id);
        await createUserAgentsFromRecommendations(user.id, recommendedAgents);
      }
      
      // 3. Llamar callback original
      onComplete(scores, recommendedAgents, aiRecommendations);
    } catch (err) {
      console.error('Error completing onboarding:', err);
      // Aún así completar el onboarding para no bloquear al usuario
      onComplete(scores, recommendedAgents, aiRecommendations);
    }
  }, [onComplete, user]);

  return (
    <div className="w-full">
      <CulturalMaturityWizard onComplete={handleWizardComplete} />
    </div>
  );
};
