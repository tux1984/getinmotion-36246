
import React, { useMemo, useEffect, useState } from 'react';
import { CategoryScore, ProfileType, RecommendedAgents } from '@/types/dashboard';
import { useOptimizedQuestions } from './hooks/useOptimizedQuestions';
import { getExtendedQuestions } from '@/components/maturity/questions';
import { OnboardingErrorBoundary } from './components/OnboardingErrorBoundary';
import { useMaturityCalculatorLogic } from './hooks/useMaturityCalculatorLogic';
import { useMaturityNavigationLogic } from './hooks/useMaturityNavigationLogic';
import { RecoverProgressDialog } from './components/RecoverProgressDialog';
import { useMaturityProgress } from './hooks/useMaturityProgress';
import { useIsMobile } from '@/hooks/use-mobile';
import { useNavigate } from 'react-router-dom';
import { CalculatorLayout } from './components/CalculatorLayout';
import { StepContentContainer } from './components/StepContentContainer';

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
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [showRecoverDialog, setShowRecoverDialog] = useState(false);

  const {
    hasSavedProgress,
    savedProgress,
    saveProgress,
    clearProgress,
    loadProgress
  } = useMaturityProgress();

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

  // Check for saved progress on mount
  useEffect(() => {
    if (hasSavedProgress && savedProgress) {
      setShowRecoverDialog(true);
    }
  }, [hasSavedProgress, savedProgress]);

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

  // Updated translations with new name
  const translations = useMemo(() => ({
    en: {
      title: "Business Maturity",
      subtitle: "Let's evaluate your business development stage",
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
      resultsTitle: "Your Business Maturity Results",
      resultsSubtitle: "Here's your assessment with recommended tools",
      primaryRecommendations: "Primary Recommendations",
      secondaryRecommendations: "Secondary Recommendations",
      deeperAnalysis: "Want a deeper analysis?",
      moreQuestions: "Answer more questions for detailed insights",
      finishAssessment: "Finish Assessment"
    },
    es: {
      title: "Madurez de Negocio",
      subtitle: "Vamos a evaluar la etapa de desarrollo de tu negocio",
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
      resultsTitle: "Tus Resultados de Madurez de Negocio",
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

  // Save progress function
  const handleSaveAndExit = () => {
    saveProgress({
      currentStep,
      currentQuestionIndex,
      profileType,
      answers,
      extendedAnswers,
      analysisType
    });
    navigate('/dashboard');
  };

  // Continue with saved progress
  const handleContinueProgress = () => {
    const progress = loadProgress();
    if (progress) {
      setCurrentStep(progress.currentStep);
      setCurrentQuestionIndex(progress.currentQuestionIndex);
      if (progress.profileType) handleProfileSelect(progress.profileType);
      Object.entries(progress.answers).forEach(([id, value]) => {
        handleSelectOption(id, value);
      });
      Object.entries(progress.extendedAnswers).forEach(([id, value]) => {
        handleSelectOption(id, value);
      });
      if (progress.analysisType) setAnalysisType(progress.analysisType);
    }
    setShowRecoverDialog(false);
  };

  // Start new assessment
  const handleStartNew = () => {
    clearProgress();
    setShowRecoverDialog(false);
  };

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

  // Improved auto-scroll to ensure navigation buttons are visible
  useEffect(() => {
    if (isMobile) {
      // Scroll to top first, then ensure navigation is visible
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      // After a brief delay, scroll to ensure navigation buttons are visible
      setTimeout(() => {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const navigationHeight = 80; // Height of mobile navigation
        
        if (documentHeight > windowHeight) {
          const scrollPosition = Math.max(0, documentHeight - windowHeight + navigationHeight);
          window.scrollTo({ top: scrollPosition, behavior: 'smooth' });
        }
      }, 300);
    }
  }, [currentStep, currentQuestionIndex, isMobile]);

  return (
    <OnboardingErrorBoundary>
      {/* Recovery Dialog */}
      <RecoverProgressDialog
        isOpen={showRecoverDialog}
        onContinue={handleContinueProgress}
        onStartNew={handleStartNew}
        language={language}
        lastSaveTime={savedProgress?.timestamp}
      />

      <CalculatorLayout
        currentStepNumber={currentStepNumber}
        totalSteps={totalSteps}
        title={t.title}
        language={language}
        onBack={handleBack}
        onNext={handleNext}
        canGoBack={currentStep !== 'profileType'}
        showNext={currentStep !== 'results'}
        nextLabel={
          currentStep === 'extendedQuestions' && currentQuestionIndex === extendedQuestions.length - 1 
            ? t.complete 
            : t.next
        }
        backLabel={t.back}
        onExit={handleSaveAndExit}
      >
        <StepContentContainer
          currentStep={currentStep}
          currentQuestionIndex={currentQuestionIndex}
          questions={questions}
          extendedQuestions={extendedQuestions}
          profileType={profileType}
          answers={answers}
          extendedAnswers={extendedAnswers}
          analysisType={analysisType}
          scores={scores}
          recommendedAgents={recommendedAgents}
          language={language}
          t={t}
          characterImage={getCurrentCharacterImage}
          nextCharacterImage={getNextCharacterImage}
          onProfileSelect={handleProfileSelect}
          onSelectOption={handleSelectOption}
          onAnalysisChoice={handleAnalysisChoice}
          onComplete={handleComplete}
        />
      </CalculatorLayout>
    </OnboardingErrorBoundary>
  );
};
