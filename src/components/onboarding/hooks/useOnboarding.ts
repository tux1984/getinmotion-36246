
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
  const navigate = useNavigate();
  const { toast } = useToast();
  const { language } = useLanguage();
  
  const totalSteps = 4;
  
  const handleMaturityComplete = (scores: CategoryScore) => {
    setMaturityScores(scores);
    setShowMaturityCalculator(false);
    setCurrentStep(2); // Move to agent recommendation step
  };
  
  const handleComplete = () => {
    // Determinar los agentes recomendados según el perfil y las puntuaciones de madurez
    const recommendedAgents: RecommendedAgents = {
      admin: false,
      accounting: false,
      legal: false,
      operations: false,
      cultural: false
    };
    
    // Por defecto, siempre se recomienda el asistente administrativo
    recommendedAgents.admin = true;
    
    if (maturityScores) {
      // Recomendaciones basadas en la puntuación de madurez
      if (profileType === 'idea') {
        // Para personas con ideas iniciales, enfocarse en validación
        recommendedAgents.legal = maturityScores.ideaValidation > 30;
        recommendedAgents.cultural = maturityScores.ideaValidation > 20;
      } else if (profileType === 'solo') {
        // Para emprendedores solitarios, enfocarse en eficiencia
        recommendedAgents.accounting = maturityScores.monetization > 20;
        recommendedAgents.legal = maturityScores.marketFit > 40;
        recommendedAgents.cultural = maturityScores.marketFit > 30;
      } else if (profileType === 'team') {
        // Para equipos, enfocarse en coordinación
        recommendedAgents.accounting = true;
        recommendedAgents.legal = maturityScores.marketFit > 30;
        recommendedAgents.operations = maturityScores.marketFit > 50;
        recommendedAgents.cultural = maturityScores.marketFit > 40;
      }
    } else {
      // Recomendaciones por defecto si no hay puntuaciones
      if (profileType === 'idea') {
        recommendedAgents.legal = true;
        recommendedAgents.cultural = true;
      } else if (profileType === 'solo') {
        recommendedAgents.accounting = true;
        recommendedAgents.cultural = true;
      } else if (profileType === 'team') {
        recommendedAgents.accounting = true;
        recommendedAgents.legal = true;
        recommendedAgents.cultural = true;
      }
    }
    
    // Guardar las recomendaciones en localStorage
    localStorage.setItem('recommendedAgents', JSON.stringify(recommendedAgents));
    localStorage.setItem('onboardingCompleted', 'true');
    
    if (maturityScores) {
      localStorage.setItem('maturityScores', JSON.stringify(maturityScores));
    }
    
    // Notificar al componente padre
    onComplete(maturityScores || {
      ideaValidation: 20,
      userExperience: 15,
      marketFit: 10,
      monetization: 5
    }, recommendedAgents);
    
    // Mostrar un mensaje de completado
    toast({
      title: language === 'en' ? "Setup Completed!" : "¡Configuración Completada!",
      description: language === 'en' 
        ? "Your workspace is ready with recommended tools based on your project status." 
        : "Tu espacio de trabajo está listo con las herramientas recomendadas según el estado de tu proyecto."
    });
    
    // Redirigir al dashboard
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
    handleMaturityComplete,
    handleNext,
    handlePrevious,
    handleSkip
  };
};
