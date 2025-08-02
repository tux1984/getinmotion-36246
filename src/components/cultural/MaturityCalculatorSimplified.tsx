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

interface AIQuestion {
  question: string;
  context: string;
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
    aiQuestions?: AIQuestion[]
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
        
        // Show warning about task replacement
        const shouldGenerateTasks = await new Promise<boolean>((resolve) => {
          const warningDialog = document.createElement('div');
          warningDialog.className = 'fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50';
          warningDialog.innerHTML = `
            <div class="bg-white rounded-2xl p-8 max-w-md mx-4 text-center shadow-2xl">
              <div class="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-gray-900 mb-4">
                ${language === 'es' ? '¿Generar nuevas tareas personalizadas?' : 'Generate new personalized tasks?'}
              </h3>
              <p class="text-gray-600 mb-6">
                ${language === 'es' 
                  ? 'Esto generará nuevas tareas basadas en tu perfil actualizado. Si ya tienes 15 tareas activas, es posible que algunas no se puedan crear.' 
                  : 'This will generate new tasks based on your updated profile. If you already have 15 active tasks, some may not be created.'}
              </p>
              <div class="flex gap-3 justify-center">
                <button id="cancel-tasks" class="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">
                  ${language === 'es' ? 'Cancelar' : 'Cancel'}
                </button>
                <button id="confirm-tasks" class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                  ${language === 'es' ? 'Generar tareas' : 'Generate tasks'}
                </button>
              </div>
            </div>
          `;
          
          document.body.appendChild(warningDialog);
          
          const cancelBtn = warningDialog.querySelector('#cancel-tasks');
          const confirmBtn = warningDialog.querySelector('#confirm-tasks');
          
          cancelBtn?.addEventListener('click', () => {
            document.body.removeChild(warningDialog);
            resolve(false);
          });
          
          confirmBtn?.addEventListener('click', () => {
            document.body.removeChild(warningDialog);
            resolve(true);
          });
        });

        if (shouldGenerateTasks) {
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
              // Show user-friendly error message
              alert(language === 'es' 
                ? 'Error al generar tareas personalizadas. Por favor, revisa que no tengas más de 15 tareas activas.'
                : 'Error generating personalized tasks. Please check that you don\'t have more than 15 active tasks.');
            } else {
              console.log('Personalized tasks generated successfully:', taskResult);
            }
          } catch (taskGenerationError) {
            console.error('Failed to generate personalized tasks:', taskGenerationError);
            alert(language === 'es' 
              ? 'Error al generar tareas personalizadas. Por favor, inténtalo de nuevo más tarde.'
              : 'Failed to generate personalized tasks. Please try again later.');
          } finally {
            setIsGeneratingTasks(false);
          }
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