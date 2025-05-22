
import React from 'react';
import { UserProfileData } from '../CulturalMaturityWizard';
import { StepContainer } from '../wizard-components/StepContainer';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Check, ChevronRight } from 'lucide-react';
import { CategoryScore } from '@/components/maturity/types';
import { RecommendedAgents } from '@/types/dashboard';

interface ResultsStepProps {
  profileData: UserProfileData;
  scores: CategoryScore;
  recommendedAgents: RecommendedAgents;
  language: 'en' | 'es';
  onComplete: () => void;
}

export const ResultsStep: React.FC<ResultsStepProps> = ({ 
  profileData,
  scores,
  recommendedAgents, 
  language,
  onComplete
}) => {
  const t = {
    en: {
      title: "Your Results",
      subtitle: "Based on your responses, we've prepared these insights",
      overallMaturity: "Overall Project Maturity",
      maturityLabel: "Maturity Level",
      categoriesTitle: "Categories",
      recommendedAgents: "Recommended Agents",
      agentRecommendation: "Agent Recommendations",
      whyRecommended: "Why recommended:",
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
        accounting: "Accounting Agent",
        legal: "Legal Advisor",
        operations: "Operations Manager",
        cultural: "Cultural Creator Agent"
      },
      reasons: {
        admin: "Helps organize your tasks and manage your workflow.",
        accounting: "Assists with finances and pricing strategies.",
        legal: "Provides contract and legal compliance guidance.",
        operations: "Optimizes your production and collaboration processes.",
        cultural: "Specialized assistance for your creative field."
      },
      primaryButtonText: "Activate Agents",
      secondaryButtonText: "View Dashboard"
    },
    es: {
      title: "Tus Resultados",
      subtitle: "Basados en tus respuestas, hemos preparado estos análisis",
      overallMaturity: "Madurez General del Proyecto",
      maturityLabel: "Nivel de Madurez",
      categoriesTitle: "Categorías",
      recommendedAgents: "Agentes Recomendados",
      agentRecommendation: "Recomendaciones de Agentes",
      whyRecommended: "Por qué lo recomendamos:",
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
        accounting: "Agente Contable",
        legal: "Asesor Legal",
        operations: "Gerente de Operaciones",
        cultural: "Agente para Creadores Culturales"
      },
      reasons: {
        admin: "Te ayuda a organizar tus tareas y gestionar tu flujo de trabajo.",
        accounting: "Te asiste con finanzas y estrategias de precios.",
        legal: "Te proporciona orientación sobre contratos y cumplimiento legal.",
        operations: "Optimiza tus procesos de producción y colaboración.",
        cultural: "Asistencia especializada para tu campo creativo."
      },
      primaryButtonText: "Activar Agentes",
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
    return Object.keys(recommendedAgents)
      .filter(agent => recommendedAgents[agent as keyof RecommendedAgents])
      .map(agent => ({
        id: agent,
        name: t[language].agentNames[agent as keyof typeof t.en.agentNames],
        reason: t[language].reasons[agent as keyof typeof t.en.reasons]
      }));
  };
  
  return (
    <StepContainer
      title={t[language].title}
      subtitle={t[language].subtitle}
    >
      <div className="space-y-8">
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">{t[language].overallMaturity}</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{getMaturityLevel()}</span>
                <span className="text-lg font-bold">{overallScore}%</span>
              </div>
            </div>
            <Progress value={overallScore} className="h-3 bg-slate-100" />
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-4">{t[language].categoriesTitle}</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm">{t[language].categoryLabels.ideaValidation}</span>
                  <span className="text-xs font-medium">{scores.ideaValidation}%</span>
                </div>
                <Progress value={scores.ideaValidation} className={`h-2 ${getCategoryColor(scores.ideaValidation)}`} />
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm">{t[language].categoryLabels.userExperience}</span>
                  <span className="text-xs font-medium">{scores.userExperience}%</span>
                </div>
                <Progress value={scores.userExperience} className={`h-2 ${getCategoryColor(scores.userExperience)}`} />
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm">{t[language].categoryLabels.marketFit}</span>
                  <span className="text-xs font-medium">{scores.marketFit}%</span>
                </div>
                <Progress value={scores.marketFit} className={`h-2 ${getCategoryColor(scores.marketFit)}`} />
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm">{t[language].categoryLabels.monetization}</span>
                  <span className="text-xs font-medium">{scores.monetization}%</span>
                </div>
                <Progress value={scores.monetization} className={`h-2 ${getCategoryColor(scores.monetization)}`} />
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h3 className="text-lg font-medium mb-4">{t[language].agentRecommendation}</h3>
          
          <div className="space-y-4">
            {getRecommendedAgents().map((agent, index) => (
              <div 
                key={agent.id}
                className="p-4 border border-indigo-100 bg-indigo-50 rounded-lg flex items-start"
              >
                <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center mr-4 mt-1">
                  <Check className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-medium">{agent.name}</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    <span className="font-medium">{t[language].whyRecommended}</span> {agent.reason}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8">
            <Button 
              onClick={onComplete}
              className="w-full gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
            >
              {t[language].primaryButtonText}
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </StepContainer>
  );
};
