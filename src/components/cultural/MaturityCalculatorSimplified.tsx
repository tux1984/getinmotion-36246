import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { CategoryScore, RecommendedAgents } from '@/types/dashboard';
import { useAuth } from '@/context/AuthContext';
import { CulturalMaturityWizard } from './CulturalMaturityWizard';
import { useMaturityScoresSaver } from '@/hooks/useMaturityScoresSaver';
import { UserProfileData } from './types/wizardTypes';
import { createUserAgentsFromRecommendations, markOnboardingComplete } from '@/utils/onboardingUtils';
import { useTranslations } from '@/hooks/useTranslations';
import { supabase } from '@/integrations/supabase/client';

interface AIRecommendation {
  title: string;
  description: string;
  priority: 'High' | 'Medium' | 'Low' | 'Alta' | 'Media' | 'Baja';
  timeframe: string;
}

interface MaturityCalculatorSimplifiedProps {
  language: 'en' | 'es';
  onComplete: (scores: CategoryScore, recommendedAgents: RecommendedAgents) => void;
}

export const MaturityCalculatorSimplified: React.FC<MaturityCalculatorSimplifiedProps> = ({
  language,
  onComplete
}) => {
  const { user } = useAuth();
  const { saveMaturityScores, saving: savingScores } = useMaturityScoresSaver();
  const { t } = useTranslations();
  const [isGeneratingTasks, setIsGeneratingTasks] = useState(false);

  const handleWizardComplete = useCallback(async (
    scores: CategoryScore, 
    recommendedAgents: RecommendedAgents, 
    profileData: UserProfileData,
    aiRecommendations?: AIRecommendation[]
  ) => {
    console.log('MaturityCalculator: Wizard completed', { scores, recommendedAgents, profileData });
    
    try {
      // 1. Save to localStorage immediately
      markOnboardingComplete(scores, recommendedAgents);
      localStorage.setItem('profileData', JSON.stringify(profileData));
      
      // 2. If user is authenticated, save to database and generate personalized tasks
      if (user?.id) {
        console.log('Saving scores and generating personalized tasks for user:', user.id);
        
        // Save maturity scores to database
        const scoresSaved = await saveMaturityScores(scores, profileData);
        if (scoresSaved) {
          console.log('Maturity scores saved to database successfully');
        }
        
        // Create agents in database
        const agentsCreated = await createUserAgentsFromRecommendations(user.id, recommendedAgents);
        if (agentsCreated) {
          console.log('User agents created in database successfully');
        }
        
        // Generate personalized tasks using AI
        setIsGeneratingTasks(true);
        try {
          console.log('Generating personalized tasks with profile data:', profileData);
          
          const { data: taskResult, error: taskError } = await supabase.functions.invoke(
            'generate-task-recommendations',
            {
              body: {
                userId: user.id,
                profileData: profileData,
                maturityScores: scores,
                language: language
              }
            }
          );

          if (taskError) {
            console.error('Error generating personalized tasks:', taskError);
          } else {
            console.log('Personalized tasks generated successfully:', taskResult);
          }
        } catch (taskGenerationError) {
          console.error('Failed to generate personalized tasks:', taskGenerationError);
        } finally {
          setIsGeneratingTasks(false);
        }
      }
      
      // 3. Call completion callback
      onComplete(scores, recommendedAgents);
    } catch (err) {
      console.error('Error completing maturity calculator:', err);
      // Still complete to not block user
      onComplete(scores, recommendedAgents);
    }
  }, [onComplete, user, saveMaturityScores, language]);

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            {t.maturityCalculator.title}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t.maturityCalculator.description}
          </p>
        </motion.div>

        {/* Loading State for Task Generation */}
        {isGeneratingTasks && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <div className="bg-white rounded-2xl p-8 max-w-md mx-4 text-center shadow-2xl">
              <div className="animate-spin w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {t.maturityCalculator.generatingTasks}
              </h3>
              <p className="text-gray-600">
                {t.maturityCalculator.generatingTasksDescription}
              </p>
            </div>
          </motion.div>
        )}

        {/* Wizard Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="w-full"
        >
          <CulturalMaturityWizard onComplete={handleWizardComplete} />
        </motion.div>
      </div>
    </div>
  );
};