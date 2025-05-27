
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Agent, CategoryScore, RecommendedAgents } from '@/types/dashboard';
import { MaturityComparison } from './MaturityComparison';
import { RecommendedAgentsSection } from './RecommendedAgentsSection';

interface NewDashboardMainProps {
  onSelectAgent: (id: string) => void;
  onMaturityCalculatorClick: () => void;
  agents: Agent[];
  maturityScores: CategoryScore | null;
  recommendedAgents: RecommendedAgents;
}

export const NewDashboardMain: React.FC<NewDashboardMainProps> = ({ 
  onSelectAgent,
  onMaturityCalculatorClick,
  agents,
  maturityScores,
  recommendedAgents
}) => {
  const { language } = useLanguage();
  
  const translations = {
    en: {
      greeting: "Hello, Manu!",
      welcome: "Welcome to your cultural creation dashboard",
      subtitle: "Manage your creative projects and AI agents from here"
    },
    es: {
      greeting: "¡Hola, Manu!",
      welcome: "Bienvenido a tu dashboard de creación cultural",
      subtitle: "Gestiona tus proyectos creativos y agentes IA desde aquí"
    }
  };

  const t = translations[language];

  // Get previous scores from localStorage for comparison
  const getPreviousScores = (): CategoryScore | undefined => {
    try {
      const scoreHistory = localStorage.getItem('maturityScoreHistory');
      if (scoreHistory) {
        const history = JSON.parse(scoreHistory);
        return history.length > 1 ? history[history.length - 2] : undefined;
      }
    } catch (error) {
      console.error('Error reading score history:', error);
    }
    return undefined;
  };

  const previousScores = getPreviousScores();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Welcome section */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            {t.greeting}
          </h1>
          <p className="text-lg text-gray-600">{t.welcome}</p>
          <p className="text-gray-500">{t.subtitle}</p>
        </div>
        
        {/* Maturity Overview */}
        {maturityScores && (
          <MaturityComparison
            currentScores={maturityScores}
            previousScores={previousScores}
            language={language}
            onRetakeAssessment={onMaturityCalculatorClick}
          />
        )}
        
        {/* Agents section */}
        <RecommendedAgentsSection
          agents={agents}
          recommendedAgents={recommendedAgents}
          onSelectAgent={onSelectAgent}
          language={language}
        />
      </div>
    </div>
  );
};
