import { useState, useCallback } from 'react';
import { ConversationBlock, MaturityLevel, PersonalizedTask } from '../types/conversationalTypes';
import { getConversationBlocks } from '../data/conversationBlocks';
import { UserProfileData } from '../../types/wizardTypes';
import { CategoryScore } from '@/components/maturity/types';
import { RecommendedAgents } from '@/types/dashboard';
import { useAuth } from '@/context/AuthContext';
import { useMaturityScoresSaver } from '@/hooks/useMaturityScoresSaver';
import { useUserBusinessContext } from '@/hooks/useUserBusinessContext';
import { createUserAgentsFromRecommendations, markOnboardingComplete } from '@/utils/onboardingUtils';
import { generateMaturityBasedRecommendations } from '@/utils/maturityRecommendations';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useConversationalAgent = (
  language: 'en' | 'es',
  onComplete: (scores: CategoryScore, recommendedAgents: RecommendedAgents, profileData: UserProfileData) => void
) => {
  const { user } = useAuth();
  const { saveMaturityScores } = useMaturityScoresSaver();
  const { updateFromMaturityCalculator } = useUserBusinessContext();
  const blocks = getConversationBlocks(language);
  
  // Add debugging and validation
  console.log('useConversationalAgent: Blocks loaded', { language, blocksLength: blocks?.length, blocks: blocks?.slice(0, 2) });
  
  const [currentBlockIndex, setCurrentBlockIndex] = useState(0);
  const [profileData, setProfileData] = useState<UserProfileData>({} as UserProfileData);
  const [insights, setInsights] = useState<string[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);

  const currentBlock = blocks && blocks.length > 0 ? blocks[currentBlockIndex] : null;
  
  console.log('useConversationalAgent: Current block', { currentBlockIndex, currentBlock: currentBlock?.id, questionsLength: currentBlock?.questions?.length });

  const updateProfileData = useCallback((data: Partial<UserProfileData>) => {
    setProfileData(prev => ({ ...prev, ...data }));
  }, []);

  const answerQuestion = useCallback((questionId: string, answer: any) => {
    if (!currentBlock || !currentBlock.questions) {
      console.error('answerQuestion: No current block or questions available');
      return;
    }
    const question = currentBlock.questions.find(q => q.id === questionId);
    if (question) {
      updateProfileData({ [question.fieldName]: answer });
    }
  }, [currentBlock, updateProfileData]);

  const goToNextBlock = useCallback(() => {
    console.log('useConversationalAgent: goToNextBlock', { 
      currentBlockIndex, 
      totalBlocks: blocks.length 
    });
    
    if (currentBlockIndex < blocks.length - 1) {
      setCurrentBlockIndex(prev => {
        const newIndex = prev + 1;
        console.log('useConversationalAgent: Moving to next block', { prev, newIndex });
        return newIndex;
      });
    } else {
      console.log('useConversationalAgent: Assessment completed');
      setIsCompleted(true);
    }
  }, [currentBlockIndex, blocks.length]);

  const goToPreviousBlock = useCallback(() => {
    console.log('useConversationalAgent: goToPreviousBlock', { currentBlockIndex });
    
    if (currentBlockIndex > 0) {
      setCurrentBlockIndex(prev => {
        const newIndex = prev - 1;
        console.log('useConversationalAgent: Moving to previous block', { prev, newIndex });
        return newIndex;
      });
    }
  }, [currentBlockIndex]);

  const saveProgress = useCallback(() => {
    localStorage.setItem('conversational-agent-progress', JSON.stringify({
      currentBlockIndex,
      profileData,
      insights
    }));
  }, [currentBlockIndex, profileData, insights]);

  const loadProgress = useCallback(() => {
    const saved = localStorage.getItem('conversational-agent-progress');
    if (saved) {
      const { currentBlockIndex: savedIndex, profileData: savedData, insights: savedInsights } = JSON.parse(saved);
      setCurrentBlockIndex(savedIndex || 0);
      setProfileData(savedData || {});
      setInsights(savedInsights || []);
    }
  }, []);

  const getBlockProgress = useCallback(() => {
    return ((currentBlockIndex + 1) / blocks.length) * 100;
  }, [currentBlockIndex, blocks.length]);

  const completeAssessment = useCallback(async () => {
    if (!user) {
      console.error('No authenticated user found');
      toast.error(language === 'en' ? 'Authentication required' : 'Se requiere autenticación');
      return;
    }

    try {
      console.log('Starting assessment completion process...');
      
      // Generate real scores based on profileData
      const scores: CategoryScore = {
        ideaValidation: calculateIdeaValidationScore(profileData),
        userExperience: calculateUserExperienceScore(profileData),
        marketFit: calculateMarketFitScore(profileData),
        monetization: calculateMonetizationScore(profileData)
      };

      console.log('Generated scores:', scores);

      // Generate agent recommendations based on scores
      const recommendedAgents = generateMaturityBasedRecommendations(scores);
      console.log('Generated recommendations:', recommendedAgents);

      // Save maturity scores to database
      const scoreSaved = await saveMaturityScores(scores, profileData);
      if (!scoreSaved) {
        throw new Error('Failed to save maturity scores');
      }

      // Create user agents
      const agentsCreated = await createUserAgentsFromRecommendations(user.id, recommendedAgents);
      if (!agentsCreated) {
        throw new Error('Failed to create user agents');
      }

      // Update user business context
      await updateFromMaturityCalculator(profileData, scores, language);

      // Generate personalized tasks
      try {
        await supabase.functions.invoke('generate-artisan-tasks', {
          body: { 
            profileData,
            maturityScores: scores,
            language 
          }
        });
        console.log('Tasks generation initiated');
      } catch (taskError) {
        console.warn('Tasks generation failed but continuing:', taskError);
      }

      // Mark onboarding as complete
      markOnboardingComplete(scores, recommendedAgents);

      // Clean up saved progress
      localStorage.removeItem('conversational-agent-progress');

      console.log('Assessment completion successful!');
      toast.success(language === 'en' ? 'Assessment completed successfully!' : '¡Evaluación completada exitosamente!');

      // Call completion callback
      onComplete(scores, recommendedAgents, profileData);

    } catch (error) {
      console.error('Error completing assessment:', error);
      toast.error(language === 'en' ? 'Error completing assessment' : 'Error al completar la evaluación');
    }
  }, [profileData, onComplete, user, saveMaturityScores, updateFromMaturityCalculator, language]);

  const maturityLevel: MaturityLevel = {
    id: 'growing',
    level: 2,
    name: language === 'en' ? 'Hands in Motion' : 'Manos en Marcha',
    description: language === 'en' ? 'You have started but need structure' : 'Has comenzado pero necesitas estructura',
    characteristics: [],
    nextSteps: []
  };

  const personalizedTasks: PersonalizedTask[] = [
    {
      id: '1',
      title: language === 'en' ? 'Define your ideal customer' : 'Define tu cliente ideal',
      description: language === 'en' ? 'Create a detailed profile of your target audience' : 'Crea un perfil detallado de tu audiencia objetivo',
      agentId: 'market-research',
      priority: 'high',
      estimatedTime: '2 hours',
      category: 'Market Research'
    }
  ];

  // Helper functions to calculate scores based on profile data
  const calculateIdeaValidationScore = (data: UserProfileData): number => {
    let score = 50; // Base score
    
    if (data.businessDescription && data.businessDescription.length > 20) score += 10;
    if (data.targetAudience && data.targetAudience.length > 10) score += 10;
    if (data.customerClarity && data.customerClarity >= 7) score += 15;
    if (data.hasSold) score += 15;
    
    return Math.min(100, score);
  };

  const calculateUserExperienceScore = (data: UserProfileData): number => {
    let score = 40; // Base score
    
    if (data.salesConsistency === 'consistent') score += 20;
    if (data.salesConsistency === 'occasional') score += 10;
    if (data.promotionChannels && data.promotionChannels.length >= 2) score += 15;
    if (data.marketingConfidence && data.marketingConfidence >= 6) score += 15;
    if (data.delegationComfort && data.delegationComfort >= 6) score += 10;
    
    return Math.min(100, score);
  };

  const calculateMarketFitScore = (data: UserProfileData): number => {
    let score = 35; // Base score
    
    if (data.profitClarity && data.profitClarity >= 7) score += 20;
    if (data.salesConsistency === 'consistent') score += 20;
    if (data.targetAudience && data.targetAudience.length > 15) score += 15;
    if (data.promotionChannels && data.promotionChannels.length >= 3) score += 10;
    
    return Math.min(100, score);
  };

  const calculateMonetizationScore = (data: UserProfileData): number => {
    let score = 30; // Base score
    
    if (data.hasSold) score += 25;
    if (data.profitClarity && data.profitClarity >= 8) score += 20;
    if (data.salesConsistency === 'consistent') score += 20;
    if (data.businessGoals && data.businessGoals.includes('profit')) score += 5;
    
    return Math.min(100, score);
  };

  return {
    currentBlock,
    profileData,
    insights,
    isCompleted,
    maturityLevel,
    personalizedTasks,
    updateProfileData,
    answerQuestion,
    goToNextBlock,
    goToPreviousBlock,
    saveProgress,
    loadProgress,
    completeAssessment,
    getBlockProgress
  };
};