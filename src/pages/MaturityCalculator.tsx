
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CulturalMaturityWizard } from '@/components/cultural/CulturalMaturityWizard';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '@/context/LanguageContext';
import { CategoryScore } from '@/components/maturity/types';
import { RecommendedAgents } from '@/types/dashboard';
import { motion } from 'framer-motion';

const MaturityCalculator = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { language } = useLanguage();
  
  const handleComplete = (scores: CategoryScore, recommendedAgents: RecommendedAgents) => {
    // Save results to localStorage
    localStorage.setItem('maturityScores', JSON.stringify(scores));
    localStorage.setItem('recommendedAgents', JSON.stringify(recommendedAgents));
    localStorage.setItem('onboardingCompleted', 'true');
    
    // Show toast notification
    toast({
      title: language === 'en' ? 'Assessment Completed!' : '¡Evaluación Completada!',
      description: language === 'en' 
        ? "Your personalized dashboard is ready with the recommended tools."
        : "Tu panel personalizado está listo con las herramientas recomendadas."
    });
    
    // Navigate to dashboard
    navigate('/dashboard');
  };
  
  return (
    <div className="min-h-screen h-screen w-full overflow-hidden bg-white flex items-center justify-center">
      <div className="absolute inset-0 overflow-hidden">
        {/* Very subtle gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-purple-50/40"></div>
        
        {/* Extremely subtle animated background elements */}
        <motion.div 
          className="absolute top-0 right-0 w-[70vw] h-[70vh] rounded-full bg-gradient-to-br from-purple-100/20 to-purple-200/10 opacity-10 blur-3xl"
          animate={{ 
            scale: [1, 1.03, 1],
            x: [0, 5, 0],
            y: [0, -5, 0], 
          }}
          transition={{ 
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse" 
          }}
        />
        
        <motion.div 
          className="absolute bottom-0 left-0 w-[60vw] h-[60vh] rounded-full bg-gradient-to-tr from-purple-100/20 to-purple-200/10 opacity-5 blur-3xl"
          animate={{ 
            scale: [1, 1.05, 1],
            x: [0, -8, 0],
            y: [0, 8, 0], 
          }}
          transition={{ 
            duration: 25,
            repeat: Infinity,
            repeatType: "reverse" 
          }}
        />
      </div>
      
      <div className="relative z-10 w-full h-full max-h-full flex items-center justify-center px-4">
        <CulturalMaturityWizard onComplete={handleComplete} />
      </div>
    </div>
  );
};

export default MaturityCalculator;
