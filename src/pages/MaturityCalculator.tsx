
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SimpleCulturalMaturityCalculator } from '@/components/cultural/SimpleCulturalMaturityCalculator';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '@/context/LanguageContext';
import { CategoryScore, RecommendedAgents } from '@/types/dashboard';
import { motion } from 'framer-motion';
import { MotionLogo } from '@/components/MotionLogo';

const MaturityCalculator = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { language } = useLanguage();
  
  const handleComplete = (scores: CategoryScore, recommendedAgents: RecommendedAgents) => {
    // Save results to localStorage
    localStorage.setItem('maturityScores', JSON.stringify(scores));
    localStorage.setItem('recommendedAgents', JSON.stringify(recommendedAgents));
    localStorage.setItem('onboardingCompleted', 'true');
    
    // Clear any saved progress since assessment is completed
    localStorage.removeItem('maturityCalculatorProgress');
    
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
    <div className="min-h-screen h-screen w-full overflow-hidden bg-white flex flex-col items-center justify-center">
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
      
      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 flex flex-col items-center">
        {/* Large centered logo */}
        <div className="mb-8">
          <MotionLogo variant="dark" size="lg" />
        </div>
        
        {/* Calculator component */}
        <div className="w-full">
          <SimpleCulturalMaturityCalculator 
            language={language}
            onComplete={handleComplete} 
          />
        </div>
      </div>
    </div>
  );
};

export default MaturityCalculator;
