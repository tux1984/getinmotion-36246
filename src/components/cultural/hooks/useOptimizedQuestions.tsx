
import { useMemo } from 'react';
import { ProfileType } from '@/types/dashboard';
import { Question } from '@/components/maturity/types';
import { getProfileSpecificQuestions } from '@/components/maturity/questions';

export const useOptimizedQuestions = (language: 'en' | 'es', profileType: ProfileType | null) => {
  const questions = useMemo((): Question[] => {
    if (!profileType) return [];
    return getProfileSpecificQuestions(language, profileType);
  }, [language, profileType]);

  const totalSteps = useMemo(() => {
    return questions.length + 2; // +2 for profile type and results
  }, [questions.length]);

  return { questions, totalSteps };
};
