import { useState, useCallback, useEffect } from 'react';
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
import { useIntelligentQuestions } from './useIntelligentQuestions';

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
  const [enhancedBlocks, setEnhancedBlocks] = useState<ConversationBlock[]>([]);

  const {
    generateContextualQuestions,
    getIndustrySpecificQuestions,
    getConditionalQuestions,
    isGenerating
  } = useIntelligentQuestions();

  const currentBlock = enhancedBlocks.length > 0 
    ? enhancedBlocks[currentBlockIndex] 
    : (blocks && blocks.length > 0 ? blocks[currentBlockIndex] : null);
  
  console.log('useConversationalAgent: Current block', { currentBlockIndex, currentBlock: currentBlock?.id, questionsLength: currentBlock?.questions?.length });

  // Initialize enhanced blocks with intelligent questions and dynamic generation
  useEffect(() => {
    const initializeEnhancedBlocks = async () => {
      console.log('Initializing enhanced blocks with intelligent questions...');
      const enhanced = [...blocks];
      
      // Auto-generate dynamic questions after business description is provided
      if (profileData.businessDescription && profileData.businessDescription.length > 20) {
        console.log('Business description detected, generating contextual questions...');
        
        // Find the most relevant block to add dynamic questions to
        const targetBlocks = ['whoYouServe', 'howYouCharge', 'marketingChannels'];
        
        for (const blockId of targetBlocks) {
          const blockIndex = enhanced.findIndex(block => block.id === blockId);
          if (blockIndex !== -1) {
            try {
              const dynamicQuestions = await generateContextualQuestions({
                profileData,
                language,
                currentBlock: enhanced[blockIndex]
              });
              
              if (dynamicQuestions.length > 0) {
                console.log(`Adding ${dynamicQuestions.length} dynamic questions to ${blockId} block`);
                enhanced[blockIndex] = {
                  ...enhanced[blockIndex],
                  questions: [...enhanced[blockIndex].questions, ...dynamicQuestions]
                };
              }
            } catch (error) {
              console.warn('Failed to generate dynamic questions for block:', blockId, error);
            }
          }
        }
      }
      
      // Add industry-specific questions to relevant blocks
      if (profileData.industry && profileData.businessDescription) {
        const industryQuestions = getIndustrySpecificQuestions(
          profileData.industry,
          profileData.businessDescription,
          language
        );
        
        // Add to appropriate blocks (whoYouServe block)
        if (industryQuestions.length > 0) {
          const targetBlockIndex = enhanced.findIndex(block => block.id === 'whoYouServe');
          if (targetBlockIndex !== -1) {
            enhanced[targetBlockIndex] = {
              ...enhanced[targetBlockIndex],
              questions: [...enhanced[targetBlockIndex].questions, ...industryQuestions]
            };
          }
        }
      }

      // Add conditional questions based on profile data
      const conditionalQuestions = getConditionalQuestions(profileData, language);
      if (conditionalQuestions.length > 0) {
        const growthBlockIndex = enhanced.findIndex(block => block.id === 'growthBlocks');
        if (growthBlockIndex !== -1) {
          enhanced[growthBlockIndex] = {
            ...enhanced[growthBlockIndex],
            questions: [...enhanced[growthBlockIndex].questions, ...conditionalQuestions]
          };
        }
      }

      setEnhancedBlocks(enhanced);
    };

    if (blocks.length > 0) {
      initializeEnhancedBlocks();
    }
  }, [blocks, profileData.industry, profileData.businessDescription, profileData.targetAudience, language, getIndustrySpecificQuestions, getConditionalQuestions, generateContextualQuestions]);

  // Load progress from localStorage on mount
  useEffect(() => {
    loadProgress();
  }, []);

  const updateProfileData = useCallback((data: Partial<UserProfileData>) => {
    setProfileData(prev => ({ ...prev, ...data }));
  }, []);

  const answerQuestion = useCallback(async (questionId: string, answer: any) => {
    if (!currentBlock || !currentBlock.questions) {
      console.error('answerQuestion: No current block or questions available');
      return;
    }
    const question = currentBlock.questions.find(q => q.id === questionId);
    if (question) {
      const updatedData = { [question.fieldName]: answer };
      updateProfileData(updatedData);
      
      // Generate follow-up questions for key fields
      const keyFields = ['businessDescription', 'industry', 'targetAudience', 'hasSold'];
      if (keyFields.includes(question.fieldName)) {
        console.log(`Key field ${question.fieldName} answered, potentially generating follow-up questions...`);
        
        // Trigger intelligent question generation for subsequent blocks
        const newProfileData = { ...profileData, ...updatedData };
        if (newProfileData.businessDescription && newProfileData.industry) {
          // This will be handled by the useEffect above
          console.log('Profile data enriched, dynamic question generation will be triggered');
        }
      }
    }
  }, [currentBlock, updateProfileData, profileData]);

  const goToNextBlock = useCallback(() => {
    const totalBlocks = enhancedBlocks.length > 0 ? enhancedBlocks.length : blocks.length;
    console.log('useConversationalAgent: goToNextBlock', { 
      currentBlockIndex, 
      totalBlocks
    });
    
    if (currentBlockIndex < totalBlocks - 1) {
      setCurrentBlockIndex(prev => {
        const newIndex = prev + 1;
        console.log('useConversationalAgent: Moving to next block', { prev, newIndex });
        return newIndex;
      });
    } else {
      console.log('useConversationalAgent: Assessment completed');
      setIsCompleted(true);
    }
  }, [currentBlockIndex, blocks.length, enhancedBlocks.length]);

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
    const totalBlocks = enhancedBlocks.length > 0 ? enhancedBlocks.length : blocks.length;
    return ((currentBlockIndex + 1) / totalBlocks) * 100;
  }, [currentBlockIndex, blocks.length, enhancedBlocks.length]);

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
    getBlockProgress,
    isGenerating,
    generateContextualQuestions
  };
};