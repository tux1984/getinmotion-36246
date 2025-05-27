
import { useCallback } from 'react';
import { CategoryScore, RecommendedAgents } from '@/types/dashboard';

interface UseMaturityNavigationLogicProps {
  currentStep: 'profileType' | 'questions' | 'results';
  setCurrentStep: (step: 'profileType' | 'questions' | 'results') => void;
  profileType: any;
  questions: any[];
  currentQuestionIndex: number;
  setCurrentQuestionIndex: (index: number) => void;
  answers: Record<string, number>;
  calculateScores: () => CategoryScore;
  getRecommendations: (scores: CategoryScore) => RecommendedAgents;
  setScores: (scores: CategoryScore) => void;
  setRecommendedAgents: (agents: RecommendedAgents) => void;
  toast: any;
  t: any;
}

export const useMaturityNavigationLogic = ({
  currentStep,
  setCurrentStep,
  profileType,
  questions,
  currentQuestionIndex,
  setCurrentQuestionIndex,
  answers,
  calculateScores,
  getRecommendations,
  setScores,
  setRecommendedAgents,
  toast,
  t
}: UseMaturityNavigationLogicProps) => {

  const handleNext = useCallback(() => {
    if (currentStep === 'profileType') {
      if (!profileType) {
        toast({
          title: t.selectProfile,
          variant: 'destructive'
        });
        return;
      }
      setCurrentStep('questions');
    } else if (currentStep === 'questions') {
      const currentQuestion = questions[currentQuestionIndex];
      if (!answers[currentQuestion.id]) {
        toast({
          title: t.answerQuestion,
          variant: 'destructive'
        });
        return;
      }

      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        const finalScores = calculateScores();
        const recommendations = getRecommendations(finalScores);
        setScores(finalScores);
        setRecommendedAgents(recommendations);
        setCurrentStep('results');
      }
    }
  }, [currentStep, profileType, questions, currentQuestionIndex, answers, t, toast, calculateScores, getRecommendations, setCurrentStep, setCurrentQuestionIndex, setScores, setRecommendedAgents]);

  const handleBack = useCallback(() => {
    if (currentStep === 'questions' && currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    } else if (currentStep === 'questions' && currentQuestionIndex === 0) {
      setCurrentStep('profileType');
    } else if (currentStep === 'results') {
      setCurrentStep('questions');
      setCurrentQuestionIndex(questions.length - 1);
    }
  }, [currentStep, currentQuestionIndex, questions.length, setCurrentStep, setCurrentQuestionIndex]);

  return {
    handleNext,
    handleBack
  };
};
