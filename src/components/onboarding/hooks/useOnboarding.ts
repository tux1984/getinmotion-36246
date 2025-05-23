import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '@/context/LanguageContext';
import { ProfileType, CategoryScore, RecommendedAgents } from '@/types/dashboard';

interface UseOnboardingProps {
  profileType: ProfileType;
  onComplete: (scores: CategoryScore, recommendedAgents: RecommendedAgents) => void;
}

export const useOnboarding = ({ profileType, onComplete }: UseOnboardingProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showMaturityCalculator, setShowMaturityCalculator] = useState(true);
  const [maturityScores, setMaturityScores] = useState<CategoryScore | null>(null);
  const [initialRecommendations, setInitialRecommendations] = useState<RecommendedAgents | null>(null);
  const [showExtendedQuestions, setShowExtendedQuestions] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { language } = useLanguage();
  
  const totalSteps = showExtendedQuestions ? 5 : 4;
  
  const handleMaturityComplete = (scores: CategoryScore) => {
    setMaturityScores(scores);
    setShowMaturityCalculator(false);
    setCurrentStep(2); // Move to agent recommendation step
  };
  
  const handleComplete = () => {
    // Determine recommended agents based on profile type and maturity scores,
    // with preference given to extended recommendations if available
    const recommendedAgents: RecommendedAgents = {
      admin: true, // Always recommend the administrative assistant
      accounting: false,
      legal: false,
      operations: false,
      cultural: false
    };
    
    // If we have extended recommendations from deep analysis questions, use those
    if (initialRecommendations?.extended) {
      // Extract extended recommendations but exclude the 'extended' property itself
      Object.keys(initialRecommendations.extended).forEach((key) => {
        const typedKey = key as keyof Omit<RecommendedAgents, 'extended'>;
        if (typedKey !== 'extended') {
          recommendedAgents[typedKey] = initialRecommendations.extended?.[typedKey] ?? false;
        }
      });
    }
    // Otherwise use initial recommendations or fallback to profile-based recommendations
    else if (initialRecommendations) {
      Object.keys(initialRecommendations).forEach((key) => {
        if (key !== 'extended') {  // Skip the 'extended' property
          const typedKey = key as keyof Omit<RecommendedAgents, 'extended'>;
          recommendedAgents[typedKey] = initialRecommendations[typedKey];
        }
      });
    }
    // Profile-based fallback recommendations
    else {
      if (profileType === 'idea') {
        recommendedAgents.cultural = true;
      } else if (profileType === 'solo') {
        recommendedAgents.accounting = true;
        recommendedAgents.cultural = true;
      } else if (profileType === 'team') {
        recommendedAgents.accounting = true;
        recommendedAgents.operations = true;
        recommendedAgents.cultural = true;
      }
    }
    
    // Maturity score-based adjustments
    if (maturityScores) {
      if (maturityScores.monetization > 20) {
        recommendedAgents.accounting = true;
      }
      
      if (maturityScores.marketFit > 35) {
        recommendedAgents.legal = true;
      }
      
      if (maturityScores.marketFit > 50) {
        recommendedAgents.operations = true;
      }
    }
    
    // Save recommendations and maturity scores to localStorage
    localStorage.setItem('recommendedAgents', JSON.stringify(recommendedAgents));
    localStorage.setItem('onboardingCompleted', 'true');
    
    if (maturityScores) {
      localStorage.setItem('maturityScores', JSON.stringify(maturityScores));
    }
    
    // Notify parent component
    onComplete(maturityScores || {
      ideaValidation: 20,
      userExperience: 15,
      marketFit: 10,
      monetization: 5
    }, recommendedAgents);
    
    // Show completion toast
    toast({
      title: language === 'en' ? "Setup Completed!" : "¡Configuración Completada!",
      description: language === 'en' 
        ? "Your workspace is ready with recommended tools based on your project status." 
        : "Tu espacio de trabajo está listo con las herramientas recomendadas según el estado de tu proyecto."
    });
    
    // Navigate to dashboard
    navigate('/dashboard');
  };
  
  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };
  
  const handleSkip = () => {
    handleComplete();
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  return {
    currentStep,
    totalSteps,
    showMaturityCalculator,
    setShowMaturityCalculator,
    maturityScores,
    initialRecommendations,
    setInitialRecommendations,
    showExtendedQuestions,
    setShowExtendedQuestions,
    handleMaturityComplete,
    handleNext,
    handlePrevious,
    handleSkip,
    handleComplete
  };
};
