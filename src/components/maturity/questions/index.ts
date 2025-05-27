
import { Question } from '../types';
import { ProfileType } from '@/types/dashboard';
import { getIdeaQuestions } from './ideaQuestions';
import { getSoloQuestions } from './soloQuestions';
import { getTeamQuestions } from './teamQuestions';

export const getProfileSpecificQuestions = (language: 'en' | 'es', profileType: ProfileType): Question[] => {
  switch (profileType) {
    case 'idea':
      return getIdeaQuestions(language);
    case 'solo':
      return getSoloQuestions(language);
    case 'team':
      return getTeamQuestions(language);
    default:
      return [];
  }
};
