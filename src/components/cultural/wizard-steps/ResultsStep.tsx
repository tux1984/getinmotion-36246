import React, { useEffect, useState } from 'react';
import { UserProfileData } from '../types/wizardTypes';
import { StepContainer } from '../wizard-components/StepContainer';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Check, ChevronRight, Stars, Loader2 } from 'lucide-react';
import { CategoryScore } from '@/components/maturity/types';
import { RecommendedAgents } from '@/types/dashboard';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { calculateMaturityScores, ScoreBreakdown } from '../hooks/utils/scoreCalculation';
import { ScoreBreakdownDisplay } from '../components/ScoreBreakdownDisplay';

interface AIRecommendation {
  title: string;
  description: string;
  priority: 'High' | 'Medium' | 'Low' | 'Alta' | 'Media' | 'Baja';
  timeframe: string;
}

interface ResultsStepProps {
  profileData: UserProfileData;
  scores: CategoryScore;
  recommendedAgents: RecommendedAgents;
  language: 'en' | 'es';
  onComplete: () => void;
  illustration: string;
}

export const ResultsStep: React.FC<ResultsStepProps> = ({ 
  profileData,
  recommendedAgents, 
  language,
  onComplete,
  illustration
}) => {
  const [aiRecommendations, setAiRecommendations] = useState<AIRecommendation[]>([]);
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Recalculate scores and get breakdown for detailed view
  const { scores, breakdown } = calculateMaturityScores(profileData, language);

  const t = {
    en: {
      title: "Your Assessment Results",
      subtitle: "Here's your creative project analysis",
      overallMaturity: "Overall Project Maturity",
      categoriesTitle: "Categories Breakdown",
      recommendedAgents: "Recommended AI Assistants",
      aiRecommendations: "Priority Actions",
      loadingRecommendations: "Generating recommendations...",
      levels: {
        beginner: "Early Stage",
        developing: "Developing", 
        growing: "Growing",
        advanced: "Advanced"
      },
      categoryLabels: {
        ideaValidation: "Idea Validation",
        userExperience: "User Experience", 
        marketFit: "Market Fit",
        monetization: "Monetization"
      },
      agentNames: {
        admin: "Administrative Assistant",
        accounting: "Financial Advisor",
        legal: "Legal Consultant",
        operations: "Operations Manager",
        cultural: "Creative Specialist"
      },
      primaryButtonText: "Start Working with AI Agents",
      secondaryButtonText: "View Dashboard"
    },
    es: {
      title: "Resultados de tu Evaluación",
      subtitle: "Aquí está el análisis de tu proyecto creativo",
      overallMaturity: "Madurez General del Proyecto",
      categoriesTitle: "Desglose por Categorías",
      recommendedAgents: "Asistentes IA Recomendados",
      aiRecommendations: "Acciones Prioritarias",
      loadingRecommendations: "Generando recomendaciones...",
      levels: {
        beginner: "Etapa Inicial",
        developing: "Desarrollándose",
        growing: "Creciendo", 
        advanced: "Avanzado"
      },
      categoryLabels: {
        ideaValidation: "Validación de Idea",
        userExperience: "Experiencia de Usuario",
        marketFit: "Ajuste al Mercado",
        monetization: "Monetización"
      },
      agentNames: {
        admin: "Asistente Administrativo",
        accounting: "Asesor Financiero",
        legal: "Consultor Legal",
        operations: "Gerente de Operaciones",
        cultural: "Especialista Creativo"
      },
      primaryButtonText: "Comenzar a Trabajar con Agentes IA",
      secondaryButtonText: "Ver Dashboard"
    }
  };
  
  // Calculate overall score
  const overallScore = Math.round(
    (scores.ideaValidation + scores.userExperience + scores.marketFit + scores.monetization) / 4
  );
  
  // Determine maturity level
  const getMaturityLevel = () => {
    if (overallScore >= 80) return t[language].levels.advanced;
    if (overallScore >= 60) return t[language].levels.growing;
    if (overallScore >= 40) return t[language].levels.developing;
    return t[language].levels.beginner;
  };
  
  // Get category color
  const getCategoryColor = (score: number) => {
    if (score >= 80) return "bg-emerald-500";
    if (score >= 60) return "bg-blue-500";
    if (score >= 40) return "bg-amber-500";
    return "bg-rose-500";
  };

  const getRecommendedAgents = () => {
    const agents = [];
    
    if (recommendedAgents.admin) {
      agents.push({ id: 'admin', name: t[language].agentNames.admin });
    }
    if (recommendedAgents.cultural) {
      agents.push({ id: 'cultural', name: t[language].agentNames.cultural });
    }
    if (recommendedAgents.accounting) {
      agents.push({ id: 'accounting', name: t[language].agentNames.accounting });
    }
    if (recommendedAgents.legal) {
      agents.push({ id: 'legal', name: t[language].agentNames.legal });
    }
    if (recommendedAgents.operations) {
      agents.push({ id: 'operations', name: t[language].agentNames.operations });
    }

    return agents;
  };

  // Handle navigation to dashboard
  const handleActivateAgents = () => {
    console.log('🚀 Navigating to dashboard home');
    onComplete();
    navigate('/dashboard/home');
  };

  // Fetch AI recommendations
  useEffect(() => {
    const fetchAIRecommendations = async () => {
      try {
        setIsLoadingRecommendations(true);
        
        const { data, error } = await supabase.functions.invoke('ai-recommendations', {
          body: { scores, profileData, language }
        });

        if (error) {
          console.error('Error fetching AI recommendations:', error);
        } else if (data?.recommendations) {
          setAiRecommendations(data.recommendations);
        }
      } catch (error) {
        console.error('Error fetching AI recommendations:', error);
      } finally {
        setIsLoadingRecommendations(false);
      }
    };

    fetchAIRecommendations();
  }, [scores, profileData, language, toast]);
  
  return (
    <StepContainer
      title={t[language].title}
      subtitle={t[language].subtitle}
    >
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Character and Overall Score */}
        <motion.div 
          className="text-center space-y-6"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center shadow-lg mx-auto">
            <img 
              src={illustration} 
              alt="Character illustration" 
              className="w-16 h-16 object-contain"
            />
          </div>
          
          <div>
            <div className="text-4xl font-bold text-purple-900 mb-2">
              {overallScore}%
            </div>
            <div className="text-xl text-gray-600">
              {getMaturityLevel()}
            </div>
          </div>
        </motion.div>

        {/* Categories Grid */}
        <motion.div 
          className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-lg p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            {t[language].categoriesTitle}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(scores).map(([key, score], index) => (
              <div key={key}>
                <div className="flex justify-between items-center mb-3">
                  <span className="font-medium text-gray-700">
                    {t[language].categoryLabels[key as keyof typeof t[typeof language]['categoryLabels']]}
                  </span>
                  <span className="font-bold text-gray-900">
                    {score}%
                  </span>
                </div>
                <div className="relative h-3 w-full overflow-hidden rounded-full bg-slate-200">
                  <motion.div 
                    className={`h-full rounded-full ${getCategoryColor(score)}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${score}%` }}
                    transition={{ delay: 0.5 + (index * 0.2), duration: 1, ease: "easeOut" }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Score Breakdown Display */}
        {breakdown && (
          <motion.div
            className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-lg p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <ScoreBreakdownDisplay 
              breakdown={breakdown}
              scores={scores}
              language={language}
            />
          </motion.div>
        )}

        {/* Recommended Agents */}
        <motion.div
          className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-lg p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            {t[language].recommendedAgents}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {getRecommendedAgents().map((agent, index) => (
              <motion.div 
                key={agent.id}
                className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-100"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + (index * 0.1) }}
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 text-white flex items-center justify-center">
                  <Check className="w-4 h-4" />
                </div>
                <span className="font-medium text-gray-800">{agent.name}</span>
              </motion.div>
            ))}
          </div>
          
          <Button 
            onClick={handleActivateAgents}
            className="w-full gap-3 bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 font-semibold py-4 text-lg shadow-lg"
            size="lg"
          >
            <span>{t[language].primaryButtonText}</span>
            <ChevronRight className="w-5 h-5" />
          </Button>
        </motion.div>
      </div>
    </StepContainer>
  );
};
