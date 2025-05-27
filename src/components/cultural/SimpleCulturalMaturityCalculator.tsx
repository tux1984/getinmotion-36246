import React, { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { CategoryScore, ProfileType, RecommendedAgents } from '@/types/dashboard';
import { motion, AnimatePresence } from 'framer-motion';
import { QuestionCard } from '@/components/maturity/QuestionCard';
import { ProgressBar } from '@/components/maturity/ProgressBar';
import { useOptimizedQuestions } from './hooks/useOptimizedQuestions';
import { getExtendedQuestions } from '@/components/maturity/questions';
import { OptimizedCharacterImage } from './components/OptimizedCharacterImage';
import { OnboardingErrorBoundary } from './components/OnboardingErrorBoundary';
import { DebouncedButton } from './components/DebouncedButton';
import { ProfileTypeSelector } from './components/ProfileTypeSelector';
import { ResultsDisplay } from './components/ResultsDisplay';
import { BifurcationChoice } from './components/BifurcationChoice';
import { useMaturityCalculatorLogic } from './hooks/useMaturityCalculatorLogic';
import { useMaturityNavigationLogic } from './hooks/useMaturityNavigationLogic';

interface SimpleCulturalMaturityCalculatorProps {
  language: 'en' | 'es';
  onComplete: (scores: CategoryScore, recommendedAgents: RecommendedAgents) => void;
}

const characterImages = [
  "/lovable-uploads/cfd16f14-72a3-4b55-bfd2-67adcd44eb78.png",
  "/lovable-uploads/a2ebe4fd-31ed-43ec-9f9f-35fe6b529ad2.png",
  "/lovable-uploads/4da82626-7a63-45bd-a402-64023f2f2d44.png",
  "/lovable-uploads/390caed4-1006-489e-9da8-b17d9f8fb814.png",
  "/lovable-uploads/c131a30d-0ce5-4b65-ae3c-5715f73e4f4c.png",
  "/lovable-uploads/aad610ec-9f67-4ed0-93dc-8c2b3e8f98d3.png",
  "/lovable-uploads/e5849e7b-cac1-4c76-9858-c7d5222cce96.png",
];

export const SimpleCulturalMaturityCalculator: React.FC<SimpleCulturalMaturityCalculatorProps> = ({ 
  language, 
  onComplete 
}) => {
  const {
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
  } = useMaturityCalculatorLogic(language, onComplete);

  // Get questions based on current step
  const { questions } = useOptimizedQuestions(language, profileType);
  const extendedQuestions = useMemo(() => {
    return profileType ? getExtendedQuestions(language, profileType) : [];
  }, [language, profileType]);

  // Calculate current step number and total steps
  const currentStepNumber = useMemo(() => {
    if (currentStep === 'profileType') return 1;
    if (currentStep === 'questions') return currentQuestionIndex + 2;
    if (currentStep === 'bifurcation') return questions.length + 2;
    if (currentStep === 'extendedQuestions') return questions.length + 3 + currentQuestionIndex;
    return questions.length + 3 + (analysisType === 'deep' ? extendedQuestions.length : 0);
  }, [currentStep, currentQuestionIndex, questions.length, extendedQuestions.length, analysisType]);

  const totalSteps = useMemo(() => {
    return questions.length + 3 + (analysisType === 'deep' ? extendedQuestions.length : 0);
  }, [questions.length, extendedQuestions.length, analysisType]);

  // Memoized translations
  const translations = useMemo(() => ({
    en: {
      title: "Cultural Maturity Assessment",
      subtitle: "Let's evaluate your creative project's development stage",
      profileTypeTitle: "Where are you today with your cultural or creative project?",
      profileTypeSubtitle: "Choose the option that best describes your current situation",
      idea: {
        title: "I have an idea, but haven't started it yet",
        description: "I'm in the early stages with a creative concept or business idea I want to develop"
      },
      solo: {
        title: "My venture is already working, but I'm alone",
        description: "I'm an individual creator, freelancer, or solo entrepreneur managing my creative business"
      },
      team: {
        title: "I have a team assembled and running",
        description: "I manage a team or organization in the creative or cultural sector"
      },
      next: "Next",
      back: "Back",
      complete: "Complete Assessment",
      selectProfile: "Please select a profile type",
      answerQuestion: "Please answer the question before continuing",
      resultsTitle: "Your Cultural Maturity Results",
      resultsSubtitle: "Here's your assessment with recommended tools",
      primaryRecommendations: "Primary Recommendations",
      secondaryRecommendations: "Secondary Recommendations",
      deeperAnalysis: "Want a deeper analysis?",
      moreQuestions: "Answer more questions for detailed insights",
      finishAssessment: "Finish Assessment"
    },
    es: {
      title: "Evaluación de Madurez Cultural",
      subtitle: "Vamos a evaluar la etapa de desarrollo de tu proyecto creativo",
      profileTypeTitle: "¿Dónde estás hoy con tu proyecto cultural o creativo?",
      profileTypeSubtitle: "Elige la opción que mejor describe tu situación actual",
      idea: {
        title: "Tengo una idea, pero aún no la puse en marcha",
        description: "Estoy en las primeras etapas con un concepto creativo o idea de negocio que quiero desarrollar"
      },
      solo: {
        title: "Mi emprendimiento ya funciona, pero estoy solo/a",
        description: "Soy un creador individual, freelancer o emprendedor solitario que gestiona mi negocio creativo"
      },
      team: {
        title: "Tengo un equipo armado y en marcha",
        description: "Gestiono un equipo u organización en el sector creativo o cultural"
      },
      next: "Siguiente",
      back: "Atrás",
      complete: "Completar Evaluación",
      selectProfile: "Por favor selecciona un tipo de perfil",
      answerQuestion: "Por favor responde la pregunta antes de continuar",
      resultsTitle: "Tus Resultados de Madurez Cultural",
      resultsSubtitle: "Aquí está tu evaluación con herramientas recomendadas",
      primaryRecommendations: "Recomendaciones Principales",
      secondaryRecommendations: "Recomendaciones Secundarias",
      deeperAnalysis: "¿Quieres un análisis más profundo?",
      moreQuestions: "Responde más preguntas para obtener información detallada",
      finishAssessment: "Finalizar Evaluación"
    }
  }), []);

  const t = translations[language];

  const { handleNext, handleBack } = useMaturityNavigationLogic({
    currentStep,
    setCurrentStep,
    profileType,
    questions,
    extendedQuestions,
    currentQuestionIndex,
    setCurrentQuestionIndex,
    answers,
    extendedAnswers,
    analysisType,
    calculateScores,
    getRecommendations,
    setScores,
    setRecommendedAgents,
    toast,
    t,
    language
  });

  // Memoized image calculation
  const getCurrentCharacterImage = useMemo(() => {
    if (currentStep === 'profileType') {
      return characterImages[0];
    } else if (currentStep === 'questions') {
      return characterImages[(currentQuestionIndex % characterImages.length) + 1] || characterImages[1];
    } else if (currentStep === 'bifurcation') {
      return characterImages[3];
    } else if (currentStep === 'extendedQuestions') {
      return characterImages[(currentQuestionIndex % characterImages.length) + 4] || characterImages[4];
    } else {
      return characterImages[6];
    }
  }, [currentStep, currentQuestionIndex]);

  const getNextCharacterImage = useMemo(() => {
    if (currentStep === 'questions' && currentQuestionIndex < questions.length - 1) {
      return characterImages[((currentQuestionIndex + 1) % characterImages.length) + 1] || characterImages[1];
    } else if (currentStep === 'extendedQuestions' && currentQuestionIndex < extendedQuestions.length - 1) {
      return characterImages[((currentQuestionIndex + 1) % characterImages.length) + 4] || characterImages[4];
    }
    return undefined;
  }, [currentStep, currentQuestionIndex, questions.length, extendedQuestions.length]);

  return (
    <OnboardingErrorBoundary>
      <div className="w-full max-w-4xl mx-auto">
        <Card className="border-2 border-purple-100 rounded-3xl shadow-lg bg-white/95 backdrop-blur-sm">
          <CardContent className="pt-8 px-8">
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold text-purple-900 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
                  {t.title}
                </h3>
                <span className="text-sm bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-medium">
                  {language === 'en' 
                    ? `Step ${currentStepNumber} of ${totalSteps}` 
                    : `Paso ${currentStepNumber} de ${totalSteps}`}
                </span>
              </div>
              
              <ProgressBar current={currentStepNumber} total={totalSteps} />
            </div>

            <div className="flex gap-8 items-start">
              {/* Character Image */}
              <div className="hidden md:block w-1/3">
                <OptimizedCharacterImage
                  src={getCurrentCharacterImage}
                  alt="Character"
                  preloadNext={getNextCharacterImage}
                />
              </div>

              {/* Content */}
              <div className="flex-1">
                <AnimatePresence mode="wait">
                  {currentStep === 'profileType' && (
                    <motion.div
                      key="profileType"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ProfileTypeSelector
                        profileType={profileType}
                        onSelect={handleProfileSelect}
                        t={t}
                      />
                    </motion.div>
                  )}

                  {currentStep === 'questions' && questions[currentQuestionIndex] && (
                    <motion.div
                      key={`question-${currentQuestionIndex}`}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <QuestionCard 
                        question={questions[currentQuestionIndex]}
                        selectedValue={answers[questions[currentQuestionIndex].id]}
                        onSelectOption={handleSelectOption}
                      />
                    </motion.div>
                  )}

                  {currentStep === 'bifurcation' && (
                    <motion.div
                      key="bifurcation"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <BifurcationChoice
                        language={language}
                        selectedType={analysisType}
                        onSelect={handleAnalysisChoice}
                      />
                    </motion.div>
                  )}

                  {currentStep === 'extendedQuestions' && extendedQuestions[currentQuestionIndex] && (
                    <motion.div
                      key={`extended-${currentQuestionIndex}`}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <QuestionCard 
                        question={extendedQuestions[currentQuestionIndex]}
                        selectedValue={extendedAnswers[extendedQuestions[currentQuestionIndex].id]}
                        onSelectOption={handleSelectOption}
                      />
                    </motion.div>
                  )}

                  {currentStep === 'results' && scores && recommendedAgents && (
                    <motion.div
                      key="results"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ResultsDisplay
                        scores={scores}
                        recommendedAgents={recommendedAgents}
                        t={t}
                        language={language}
                        onComplete={handleComplete}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between pt-6 pb-4">
              <DebouncedButton 
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 'profileType'}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                {t.back}
              </DebouncedButton>

              {currentStep !== 'results' && (
                <DebouncedButton 
                  onClick={handleNext}
                  className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 flex items-center gap-2"
                >
                  {currentStep === 'extendedQuestions' && currentQuestionIndex === extendedQuestions.length - 1 
                    ? t.complete 
                    : t.next}
                  <ArrowRight className="h-4 w-4" />
                </DebouncedButton>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </OnboardingErrorBoundary>
  );
};
