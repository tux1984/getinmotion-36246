
import React from 'react';

export interface QuestionOption {
  id: string;
  text: string;
  value: number;
  icon?: React.ReactNode;
}

export interface Question {
  id: string;
  question: string;
  options: QuestionOption[];
}

export type ProfileType = 'idea' | 'solo' | 'team';
export type Language = 'en' | 'es';
