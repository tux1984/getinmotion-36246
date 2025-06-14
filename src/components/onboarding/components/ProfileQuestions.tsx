import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, ArrowLeft, Zap, Brain } from 'lucide-react';
import { ProfileType, RecommendedAgents } from '@/types/dashboard';
import { IdeaProfileQuestions } from './questions/IdeaProfileQuestions';
import { TeamProfileQuestions } from './questions/TeamProfileQuestions';
import { SoloProfileQuestions } from './questions/SoloProfileQuestions';

interface ProfileQuestionsProps {
  profileType: ProfileType;
  onComplete: (initialRecommendations: RecommendedAgents) => void;
  showExtendedQuestions: boolean;
  language: 'en' | 'es';
  isMobile: boolean;
}

export const ProfileQuestions: React.FC<ProfileQuestionsProps> = ({
  profileType,
  onComplete,
  showExtendedQuestions,
  language,
  isMobile
}) => {
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showBifurcation, setShowBifurcation] = useState(false);
  const [selectedAnalysisType, setSelectedAnalysisType] = useState<'quick' | 'deep' | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  
  // Generate cultural entrepreneur recommendations based on answers
  const generateCulturalRecommendations = (analysisType: 'quick' | 'deep'): RecommendedAgents => {
    const recommendations: RecommendedAgents = {
      admin: true, // Always recommend admin agent
      accounting: false,
      legal: false,
      operations: false,
      cultural: true // Always recommend cultural for cultural entrepreneurs
    };

    // Basic recommendations based on profile type and answers
    if (profileType === 'idea') {
      // For idea profiles - focus on validation and planning
      if (answers.projectPhase === 'justIdea' || answers.projectPhase === 'research') {
        recommendations.cultural = true; // Idea validation
      }
      if (answers.initialResources === 'seeking' || answers.fundingNeeds === 'no') {
        recommendations.accounting = true; // Financial planning
      }
    } else if (profileType === 'solo') {
      // For solo profiles - focus on business maturity
      if (answers.paymentMethods === 'cash' || answers.financialControl === 'intuition') {
        recommendations.accounting = true;
      }
      if (answers.timeInBusiness === 'over2years' && answers.brandIdentity === 'complete') {
        recommendations.legal = true; // Formalization
      }
      if (answers.currentActivities?.includes('export')) {
        recommendations.operations = true; // Export support
      }
    } else if (profileType === 'team') {
      // For team profiles - focus on organization and structure
      recommendations.operations = true; // Team coordination
      if (answers.legalStructure === 'informal' || answers.legalStructure === 'process') {
        recommendations.legal = true;
      }
      if (answers.regularIncome === 'yes' || answers.regularIncome === 'partial') {
        recommendations.accounting = true;
      }
    }

    // Additional recommendations for deep analysis
    if (analysisType === 'deep') {
      // Add more sophisticated logic based on extended answers
      if (answers.exportExperience === 'no' && answers.currentActivities?.includes('export')) {
        recommendations.operations = true;
      }
      if (answers.priceDefinition === 'struggling') {
        recommendations.accounting = true;
      }
      if (answers.financialManagement === 'informal') {
        recommendations.accounting = true;
      }
    }
    
    return recommendations;
  };
  
  const handleAnswer = (questionId: string, value: any) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const getQuestionCount = () => {
    // Basic questions count per profile type
    const basicCounts = {
      idea: 6, // 3 cultural + 3 project state
      solo: 7, // 3 cultural + 4 business maturity  
      team: 9  // 3 cultural + 3 business state + 3 organization
    };
    
    return basicCounts[profileType] || 7;
  };

  const handleNext = () => {
    const totalBasicQuestions = getQuestionCount();
    
    if (currentQuestionIndex < totalBasicQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else if (!showBifurcation) {
      // Show bifurcation after basic questions
      setShowBifurcation(true);
    } else if (selectedAnalysisType === 'quick') {
      // Complete with quick recommendations
      const recommendations = generateCulturalRecommendations('quick');
      onComplete(recommendations);
    } else if (selectedAnalysisType === 'deep' && !showExtendedQuestions) {
      // Start extended questions
      setCurrentQuestionIndex(totalBasicQuestions);
      setShowBifurcation(false);
    } else if (showExtendedQuestions && !isComplete) {
      // Continue with extended questions or complete
      const extendedQuestionCount = 2; // Each profile has 2 extended questions
      if (currentQuestionIndex < totalBasicQuestions + extendedQuestionCount - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        setIsComplete(true);
      }
    } else if (isComplete) {
      // Complete with deep recommendations
      const recommendations = generateCulturalRecommendations('deep');
      onComplete(recommendations);
    }
  };
  
  const handlePrevious = () => {
    if (showBifurcation) {
      setShowBifurcation(false);
      setCurrentQuestionIndex(getQuestionCount() - 1);
    } else if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setIsComplete(false);
    }
  };

  const handleAnalysisChoice = (type: 'quick' | 'deep') => {
    setSelectedAnalysisType(type);
  };
  
  const renderQuestionsByProfileType = () => {
    if (showBifurcation) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-8 space-y-6"
        >
          <h2 className="text-2xl font-bold mb-4 text-purple-800">
            {language === 'en' ? "Choose your analysis type" : "Elegí tu tipo de análisis"}
          </h2>
          <p className="text-gray-600 mb-8">
            {language === 'en' 
              ? "Do you want a quick recommendation or would you prefer a deeper analysis?" 
              : "¿Querés una recomendación rápida o preferís un análisis más profundo?"}
          </p>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleAnalysisChoice('quick')}
              className={`p-6 rounded-xl border-2 transition-all ${
                selectedAnalysisType === 'quick' 
                  ? 'border-purple-500 bg-purple-50' 
                  : 'border-gray-200 hover:border-purple-300'
              }`}
            >
              <Zap className="h-12 w-12 text-purple-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-purple-800 mb-2">
                {language === 'en' ? 'Quick Recommendation' : 'Recomendación Rápida'}
              </h3>
              <p className="text-sm text-gray-600">
                {language === 'en' 
                  ? 'Get 2-3 personalized agents based on your current answers'
                  : 'Obtené 2-3 agentes personalizados basados en tus respuestas actuales'}
              </p>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleAnalysisChoice('deep')}
              className={`p-6 rounded-xl border-2 transition-all ${
                selectedAnalysisType === 'deep' 
                  ? 'border-purple-500 bg-purple-50' 
                  : 'border-gray-200 hover:border-purple-300'
              }`}
            >
              <Brain className="h-12 w-12 text-purple-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-purple-800 mb-2">
                {language === 'en' ? 'Deep Analysis' : 'Análisis Profundo'}
              </h3>
              <p className="text-sm text-gray-600">
                {language === 'en' 
                  ? 'Answer additional questions for a more detailed recommendation'
                  : 'Respondé preguntas adicionales para una recomendación más detallada'}
              </p>
            </motion.button>
          </div>
        </motion.div>
      );
    }

    if (isComplete) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-8"
        >
          <h2 className="text-2xl font-bold mb-4 text-purple-800">
            {language === 'en' ? "Great! We have everything we need." : "¡Genial! Ya tenemos todo lo que necesitamos."}
          </h2>
          <p className="text-gray-600 mb-8">
            {language === 'en' 
              ? "Click continue to see our personalized recommendations based on your cultural entrepreneur profile." 
              : "Hacé clic en continuar para ver nuestras recomendaciones personalizadas basadas en tu perfil de emprendedor cultural."}
          </p>
        </motion.div>
      );
    }
    
    const questionProps = {
      answers,
      onAnswerChange: handleAnswer,
      language,
      isMobile,
    };

    switch (profileType) {
      case 'idea':
        return <IdeaProfileQuestions {...questionProps} />;
      case 'team':
        return <TeamProfileQuestions {...questionProps} />;
      case 'solo':
      default:
        return <SoloProfileQuestions {...questionProps} />;
    }
  };
  
  const t = {
    en: {
      previous: "Back",
      next: "Continue", 
      complete: "See Recommendations",
      choose: "Choose"
    },
    es: {
      previous: "Atrás",
      next: "Continuar",
      complete: "Ver Recomendaciones",
      choose: "Elegir"
    }
  };
  
  return (
    <div className="w-full max-w-3xl mx-auto">
      {renderQuestionsByProfileType()}
      
      <div className="flex justify-between mt-10">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0 && !showBifurcation}
          className="px-6 py-2 flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          {t[language].previous}
        </Button>
        
        <Button
          onClick={handleNext}
          disabled={showBifurcation && !selectedAnalysisType}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-2 flex items-center gap-2"
        >
          {showBifurcation ? t[language].choose : 
           isComplete ? t[language].complete : t[language].next}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
