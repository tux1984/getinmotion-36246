
import { useState, useCallback, useMemo } from 'react';
import { CategoryScore, ProfileType, RecommendedAgents } from '@/types/dashboard';
import { useToast } from '@/components/ui/use-toast';

export const useMaturityCalculatorLogic = (
  language: 'en' | 'es',
  onComplete: (scores: CategoryScore, recommendedAgents: RecommendedAgents) => void
) => {
  const [currentStep, setCurrentStep] = useState<'profileType' | 'questions' | 'results'>('profileType');
  const [profileType, setProfileType] = useState<ProfileType | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [scores, setScores] = useState<CategoryScore | null>(null);
  const [recommendedAgents, setRecommendedAgents] = useState<RecommendedAgents | null>(null);
  const { toast } = useToast();

  // Memoized score calculation functions
  const calculateScores = useCallback((): CategoryScore => {
    const values = Object.values(answers);
    const total = values.reduce((sum, val) => sum + val, 0);
    const maxPossible = Object.keys(answers).length * 3;
    const percentage = (total / maxPossible) * 100;
    
    const baseScore = Math.min(100, Math.round(percentage));
    
    if (profileType === 'idea') {
      return {
        ideaValidation: Math.min(100, Math.round(baseScore * 0.9)),
        userExperience: Math.min(100, Math.round(baseScore * 0.7)),
        marketFit: Math.min(100, Math.round(baseScore * 0.8)),
        monetization: Math.min(100, Math.round(baseScore * 0.6))
      };
    } else if (profileType === 'solo') {
      return {
        ideaValidation: Math.min(100, Math.round(baseScore * 0.8)),
        userExperience: Math.min(100, Math.round(baseScore * 0.9)),
        marketFit: Math.min(100, Math.round(baseScore * 0.85)),
        monetization: Math.min(100, Math.round(baseScore * 0.8))
      };
    } else {
      return {
        ideaValidation: Math.min(100, Math.round(baseScore * 0.85)),
        userExperience: Math.min(100, Math.round(baseScore * 0.8)),
        marketFit: Math.min(100, Math.round(baseScore * 0.9)),
        monetization: Math.min(100, Math.round(baseScore * 0.85))
      };
    }
  }, [answers, profileType]);

  const getRecommendations = useCallback((scores: CategoryScore): RecommendedAgents => {
    const scoresArray = [
      { category: 'idea-validator', score: scores.ideaValidation },
      { category: 'ux-designer', score: scores.userExperience },
      { category: 'market-analyst', score: scores.marketFit },
      { category: 'finance-advisor', score: scores.monetization }
    ];

    scoresArray.sort((a, b) => a.score - b.score);

    return {
      primary: scoresArray.slice(0, 2).map(item => item.category),
      secondary: scoresArray.slice(2, 4).map(item => item.category)
    };
  }, []);

  // Optimized handlers
  const handleProfileSelect = useCallback((type: ProfileType) => {
    setProfileType(type);
  }, []);

  const handleSelectOption = useCallback((questionId: string, value: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  }, []);

  const handleComplete = useCallback(() => {
    if (scores && recommendedAgents) {
      onComplete(scores, recommendedAgents);
    }
  }, [scores, recommendedAgents, onComplete]);

  return {
    currentStep,
    setCurrentStep,
    profileType,
    currentQuestionIndex,
    setCurrentQuestionIndex,
    answers,
    scores,
    setScores,
    recommendedAgents,
    setRecommendedAgents,
    toast,
    calculateScores,
    getRecommendations,
    handleProfileSelect,
    handleSelectOption,
    handleComplete
  };
};
