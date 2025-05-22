
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CulturalMaturityWizard } from '@/components/cultural/CulturalMaturityWizard';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '@/context/LanguageContext';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { CategoryScore } from '@/components/maturity/types';
import { RecommendedAgents } from '@/types/dashboard';

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
    <div className="min-h-screen bg-slate-50">
      <DashboardHeader />
      
      <div className="container py-8 md:py-12">
        <CulturalMaturityWizard onComplete={handleComplete} />
      </div>
    </div>
  );
};

export default MaturityCalculator;
