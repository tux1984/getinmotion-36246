
import { useMemo } from 'react';
import { ProfileType } from '@/types/dashboard';
import { getProfileSpecificQuestions } from '@/components/maturity/getProfileSpecificQuestions';

export const useOptimizedQuestions = (language: 'en' | 'es', profileType: ProfileType | null) => {
  const questions = useMemo(() => {
    if (!profileType) return [];
    return getProfileSpecificQuestions(language, profileType);
  }, [language, profileType]);

  const totalSteps = useMemo(() => {
    return questions.length + 2; // +2 for profile type and results
  }, [questions.length]);

  return { questions, totalSteps };
};
