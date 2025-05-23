
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { ProfileType, RecommendedAgents } from '@/types/dashboard';
import { IdeaProfileQuestions } from './questions/IdeaProfileQuestions';
import { TeamProfileQuestions } from './questions/TeamProfileQuestions';
import { SoloProfileQuestions } from './questions/SoloProfileQuestions';

interface ProfileQuestionsProps {
  profileType: ProfileType;
  onComplete: (initialRecommendations: RecommendedAgents) => void;
  showExtendedQuestions: boolean;
  language: 'en' | 'es';
}

export const ProfileQuestions: React.FC<ProfileQuestionsProps> = ({
  profileType,
  onComplete,
  showExtendedQuestions,
  language
}) => {
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  
  // Generate recommendations based on profile type and answers
  const generateRecommendations = (): RecommendedAgents => {
    const recommendations: RecommendedAgents = {
      admin: true, // Always recommend admin agent
      accounting: false,
      legal: false,
      operations: false,
      cultural: false
    };
    
    // Basic recommendations based on profile type
    if (profileType === 'idea') {
      // For idea profiles, focus on validation and planning
      recommendations.cultural = true;
    } else if (profileType === 'solo') {
      // For solo profiles, focus on efficiency and management
      recommendations.accounting = true;
      recommendations.cultural = true;
    } else if (profileType === 'team') {
      // For team profiles, focus on coordination and organization
      recommendations.accounting = true;
      recommendations.operations = true;
      recommendations.cultural = true;
    }
    
    // Further refine based on specific answers if available
    if (answers.monetization && answers.monetization === 'yes') {
      recommendations.accounting = true;
    }
    
    if (answers.legalStructure && answers.legalStructure === 'yes') {
      recommendations.legal = true;
    }
    
    if (answers.teamSize && parseInt(answers.teamSize) > 3) {
      recommendations.operations = true;
    }
    
    return recommendations;
  };
  
  const handleAnswer = (questionId: string, value: any) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };
  
  const handleNext = () => {
    if (isComplete) {
      // Generate recommendations and complete the step
      const recommendations = generateRecommendations();
      onComplete(recommendations);
      return;
    }
    
    // If we're at the last basic question and not in extended mode
    const totalQuestions = showExtendedQuestions ? 10 : 5;
    
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setIsComplete(true);
    }
  };
  
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setIsComplete(false);
    }
  };
  
  const renderQuestionsByProfileType = () => {
    if (isComplete) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-8"
        >
          <h2 className="text-2xl font-bold mb-4 text-purple-800">
            {language === 'en' ? "Great! We have what we need." : "¡Genial! Ya tenemos lo que necesitamos."}
          </h2>
          <p className="text-gray-600 mb-8">
            {language === 'en' 
              ? "Click continue to see our recommendations based on what you've shared." 
              : "Haz clic en continuar para ver nuestras recomendaciones basadas en lo que has compartido."}
          </p>
        </motion.div>
      );
    }
    
    switch (profileType) {
      case 'idea':
        return (
          <IdeaProfileQuestions
            currentQuestionIndex={currentQuestionIndex}
            showExtendedQuestions={showExtendedQuestions}
            answers={answers}
            onAnswer={handleAnswer}
            language={language}
          />
        );
      case 'team':
        return (
          <TeamProfileQuestions
            currentQuestionIndex={currentQuestionIndex}
            showExtendedQuestions={showExtendedQuestions}
            answers={answers}
            onAnswer={handleAnswer}
            language={language}
          />
        );
      case 'solo':
      default:
        return (
          <SoloProfileQuestions
            currentQuestionIndex={currentQuestionIndex}
            showExtendedQuestions={showExtendedQuestions}
            answers={answers}
            onAnswer={handleAnswer}
            language={language}
          />
        );
    }
  };
  
  const t = {
    en: {
      previous: "Back",
      next: "Continue",
      complete: "See Recommendations",
    },
    es: {
      previous: "Atrás",
      next: "Continuar",
      complete: "Ver Recomendaciones",
    }
  };
  
  return (
    <div className="w-full max-w-3xl mx-auto">
      {renderQuestionsByProfileType()}
      
      <div className="flex justify-between mt-10">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          className="px-6 py-2 flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          {t[language].previous}
        </Button>
        
        <Button
          onClick={handleNext}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-2 flex items-center gap-2"
        >
          {isComplete ? t[language].complete : t[language].next}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
