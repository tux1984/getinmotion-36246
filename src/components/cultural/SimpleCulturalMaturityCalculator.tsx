
import React, { useState, useCallback } from 'react';
import { CategoryScore, RecommendedAgents } from '@/types/dashboard';
import { CulturalMaturityWizard } from './CulturalMaturityWizard';
import { useAuth } from '@/context/AuthContext';
import { createUserAgentsFromRecommendations, markOnboardingComplete } from '@/utils/onboardingUtils';
import { useMaturityScoresSaver } from '@/hooks/useMaturityScoresSaver';

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
  const { saveMaturityScores, saving: savingScores } = useMaturityScoresSaver();

  const handleWizardComplete = useCallback(async (
    scores: CategoryScore, 
    recommendedAgents: RecommendedAgents, 
    aiRecommendations?: AIRecommendation[]
  ) => {
    console.log('SimpleCulturalMaturityCalculator: Wizard completed', { scores, recommendedAgents });
    
    try {
      // 1. Marcar en localStorage inmediatamente
      markOnboardingComplete(scores, recommendedAgents);
      
      // 2. Si hay usuario autenticado, guardar en BD
      if (user?.id) {
        console.log('Saving maturity scores and creating agents for user:', user.id);
        
        // Guardar maturity scores en BD
        const scoresSaved = await saveMaturityScores(scores);
        if (scoresSaved) {
          console.log('Maturity scores saved to database successfully');
        } else {
          console.warn('Failed to save maturity scores to database');
        }
        
        // Crear agentes en BD
        const agentsCreated = await createUserAgentsFromRecommendations(user.id, recommendedAgents);
        if (agentsCreated) {
          console.log('User agents created in database successfully');
        } else {
          console.warn('Failed to create user agents in database');
        }
      }
      
      // 3. Llamar callback original
      onComplete(scores, recommendedAgents, aiRecommendations);
    } catch (err) {
      console.error('Error completing onboarding:', err);
      // Aún así completar el onboarding para no bloquear al usuario
      onComplete(scores, recommendedAgents, aiRecommendations);
    }
  }, [onComplete, user, saveMaturityScores]);

  return (
    <div className="w-full">
      <CulturalMaturityWizard onComplete={handleWizardComplete} />
    </div>
  );
};
