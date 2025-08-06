import { useState, useCallback } from 'react';
import { ConversationBlock, MaturityLevel, PersonalizedTask } from '../types/conversationalTypes';
import { getConversationBlocks } from '../data/conversationBlocks';
import { UserProfileData } from '../../types/wizardTypes';
import { CategoryScore } from '@/components/maturity/types';
import { RecommendedAgents } from '@/types/dashboard';

export const useConversationalAgent = (
  language: 'en' | 'es',
  onComplete: (scores: CategoryScore, recommendedAgents: RecommendedAgents, profileData: UserProfileData) => void
) => {
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

  const completeAssessment = useCallback(() => {
    const mockScores: CategoryScore = {
      ideaValidation: 75,
      userExperience: 60,
      marketFit: 50,
      monetization: 40
    };

    const mockRecommendedAgents: RecommendedAgents = {
      primary: ['market-research', 'branding'],
      secondary: ['finance', 'content']
    };

    localStorage.removeItem('conversational-agent-progress');
    onComplete(mockScores, mockRecommendedAgents, profileData);
  }, [profileData, onComplete]);

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