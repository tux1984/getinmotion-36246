
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
    <div className="min-h-screen bg-gradient-to-br from-white via-emerald-50 to-teal-100">
      <div className="absolute inset-0 overflow-hidden">
        {/* Abstract background elements */}
        <motion.div 
          className="absolute top-20 right-20 w-96 h-96 rounded-full bg-gradient-to-br from-emerald-200 to-teal-300 opacity-20 blur-3xl"
          animate={{ 
            scale: [1, 1.1, 1],
            x: [0, 20, 0],
            y: [0, -20, 0], 
          }}
          transition={{ 
            duration: 15,
            repeat: Infinity,
            repeatType: "reverse" 
          }}
        />
        
        <motion.div 
          className="absolute bottom-20 left-20 w-80 h-80 rounded-full bg-gradient-to-tr from-emerald-300 to-teal-200 opacity-20 blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            x: [0, -30, 0],
            y: [0, 30, 0], 
          }}
          transition={{ 
            duration: 18,
            repeat: Infinity,
            repeatType: "reverse" 
          }}
        />
      </div>
      
      <div className="relative z-10">
        <div className="container py-12 md:py-16 xl:py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <CulturalMaturityWizard onComplete={handleComplete} />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default MaturityCalculator;
