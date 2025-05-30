
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
    console.log('MaturityCalculator: Assessment completed, saving results');
    
    // Save results to localStorage
    localStorage.setItem('maturityScores', JSON.stringify(scores));
    localStorage.setItem('recommendedAgents', JSON.stringify(recommendedAgents));
    localStorage.setItem('onboardingCompleted', 'true');
    
    // Clear any saved progress since assessment is completed
    localStorage.removeItem('maturityCalculatorProgress');
    
    console.log('MaturityCalculator: Results saved, onboardingCompleted set to true');
    
    // Show toast notification
    toast({
      title: language === 'en' ? 'Assessment Completed!' : '¡Evaluación Completada!',
      description: language === 'en' 
        ? "Your personalized dashboard is ready with the recommended tools."
        : "Tu panel personalizado está listo con las herramientas recomendadas."
    });
    
    // Navigate to dashboard - this will now work correctly since onboardingCompleted is true
    console.log('MaturityCalculator: Navigating to dashboard');
    navigate('/dashboard', { replace: true });
  };
  
  return (
    <div className="min-h-screen bg-white">
      {/* Simplified background with subtle gradients */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-purple-50/30"></div>
        
        <motion.div 
          className="absolute top-0 right-0 w-[60vw] h-[60vh] rounded-full bg-gradient-to-br from-purple-100/15 to-purple-200/8 opacity-10 blur-3xl"
          animate={{ 
            scale: [1, 1.02, 1],
            x: [0, 3, 0],
            y: [0, -3, 0], 
          }}
          transition={{ 
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse" 
          }}
        />
      </div>
      
      {/* Main content without restrictive containers */}
      <div className="relative z-10 w-full px-4 py-8">
        {/* Centered logo */}
        <div className="text-center mb-8">
          <MotionLogo variant="dark" size="lg" />
        </div>
        
        {/* Calculator component with full width and no card wrapper */}
        <div className="w-full max-w-6xl mx-auto">
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
