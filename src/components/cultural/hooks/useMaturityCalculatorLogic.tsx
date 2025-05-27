
import { useState, useCallback, useMemo } from 'react';
import { CategoryScore, ProfileType, RecommendedAgents } from '@/types/dashboard';
import { useToast } from '@/components/ui/use-toast';

export const useMaturityCalculatorLogic = (
  language: 'en' | 'es',
  onComplete: (scores: CategoryScore, recommendedAgents: RecommendedAgents) => void
) => {
  const [currentStep, setCurrentStep] = useState<'profileType' | 'questions' | 'bifurcation' | 'extendedQuestions' | 'results'>('profileType');
  const [profileType, setProfileType] = useState<ProfileType | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [extendedAnswers, setExtendedAnswers] = useState<Record<string, number>>({});
  const [analysisType, setAnalysisType] = useState<'quick' | 'deep' | null>(null);
  const [scores, setScores] = useState<CategoryScore | null>(null);
  const [recommendedAgents, setRecommendedAgents] = useState<RecommendedAgents | null>(null);
  const { toast } = useToast();

  // Enhanced score calculation that includes extended answers
  const calculateScores = useCallback((): CategoryScore => {
    const allAnswers = { ...answers, ...extendedAnswers };
    const values = Object.values(allAnswers);
    const total = values.reduce((sum, val) => sum + val, 0);
    const maxPossible = Object.keys(allAnswers).length * 3;
    const percentage = maxPossible > 0 ? (total / maxPossible) * 100 : 0;
    
    const baseScore = Math.min(100, Math.round(percentage));
    
    // Enhanced scoring with extended questions
    const extendedBonus = Object.keys(extendedAnswers).length > 0 ? 5 : 0;
    
    if (profileType === 'idea') {
      return {
        ideaValidation: Math.min(100, Math.round(baseScore * 0.9) + extendedBonus),
        userExperience: Math.min(100, Math.round(baseScore * 0.7) + extendedBonus),
        marketFit: Math.min(100, Math.round(baseScore * 0.8) + extendedBonus),
        monetization: Math.min(100, Math.round(baseScore * 0.6) + extendedBonus)
      };
    } else if (profileType === 'solo') {
      return {
        ideaValidation: Math.min(100, Math.round(baseScore * 0.8) + extendedBonus),
        userExperience: Math.min(100, Math.round(baseScore * 0.9) + extendedBonus),
        marketFit: Math.min(100, Math.round(baseScore * 0.85) + extendedBonus),
        monetization: Math.min(100, Math.round(baseScore * 0.8) + extendedBonus)
      };
    } else {
      return {
        ideaValidation: Math.min(100, Math.round(baseScore * 0.85) + extendedBonus),
        userExperience: Math.min(100, Math.round(baseScore * 0.8) + extendedBonus),
        marketFit: Math.min(100, Math.round(baseScore * 0.9) + extendedBonus),
        monetization: Math.min(100, Math.round(baseScore * 0.85) + extendedBonus)
      };
    }
  }, [answers, extendedAnswers, profileType]);

  const getRecommendations = useCallback((scores: CategoryScore): RecommendedAgents => {
    const scoresArray = [
      { category: 'idea-validator', score: scores.ideaValidation },
      { category: 'ux-designer', score: scores.userExperience },
      { category: 'market-analyst', score: scores.marketFit },
      { category: 'finance-advisor', score: scores.monetization }
    ];

    scoresArray.sort((a, b) => a.score - b.score);

    // Base recommendations
    const recommendations: RecommendedAgents = {
      primary: scoresArray.slice(0, 2).map(item => item.category),
      secondary: scoresArray.slice(2, 4).map(item => item.category)
    };

    // Add extended flag if extended analysis was completed
    if (Object.keys(extendedAnswers).length > 0) {
      recommendations.extended = {
        primary: recommendations.primary,
        secondary: recommendations.secondary
      };
    }

    return recommendations;
  }, [extendedAnswers]);

  // Optimized handlers
  const handleProfileSelect = useCallback((type: ProfileType) => {
    setProfileType(type);
  }, []);

  const handleSelectOption = useCallback((questionId: string, value: number) => {
    if (questionId.startsWith('extended_')) {
      setExtendedAnswers(prev => ({
        ...prev,
        [questionId]: value
      }));
    } else {
      setAnswers(prev => ({
        ...prev,
        [questionId]: value
      }));
    }
  }, []);

  const handleAnalysisChoice = useCallback((type: 'quick' | 'deep') => {
    setAnalysisType(type);
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
    extendedAnswers,
    analysisType,
    setAnalysisType,
    scores,
    setScores,
    recommendedAgents,
    setRecommendedAgents,
    toast,
    calculateScores,
    getRecommendations,
    handleProfileSelect,
    handleSelectOption,
    handleAnalysisChoice,
    handleComplete
  };
};
