
import React from 'react';
import { Button } from '@/components/ui/button';
import { CategoryScore } from '@/types/dashboard';
import { TrendingUp, Target, Users, DollarSign, RefreshCw } from 'lucide-react';
import { useMaturityScores } from '@/hooks/useMaturityScores';

interface ModernMaturityOverviewProps {
  currentScores: CategoryScore | null;
  language: 'en' | 'es';
  onRetakeAssessment: () => void;
}

export const ModernMaturityOverview: React.FC<ModernMaturityOverviewProps> = ({
  language,
  onRetakeAssessment
}) => {
  const { currentScores, loading, getScoreComparison } = useMaturityScores();

  const translations = {
    en: {
      title: "Business Maturity Overview",
      retakeAssessment: "Retake Assessment",
      ideaValidation: "Idea Validation",
      userExperience: "User Experience", 
      marketFit: "Market Fit",
      monetization: "Monetization",
      noScores: "Complete your maturity assessment to see your progress",
      takeAssessment: "Take Assessment"
    },
    es: {
      title: "Resumen de Madurez Empresarial",
      retakeAssessment: "Repetir Evaluación",
      ideaValidation: "Validación de Idea",
      userExperience: "Experiencia de Usuario",
      marketFit: "Ajuste de Mercado", 
      monetization: "Monetización",
      noScores: "Completa tu evaluación de madurez para ver tu progreso",
      takeAssessment: "Realizar Evaluación"
    }
  };

  const t = translations[language];

  const scoreCategories = [
    {
      key: 'ideaValidation' as keyof CategoryScore,
      label: t.ideaValidation,
      icon: Target,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'from-purple-500/20 to-purple-600/20'
    },
    {
      key: 'userExperience' as keyof CategoryScore,
      label: t.userExperience,
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'from-blue-500/20 to-blue-600/20'
    },
    {
      key: 'marketFit' as keyof CategoryScore,
      label: t.marketFit,
      icon: TrendingUp,
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'from-emerald-500/20 to-emerald-600/20'
    },
    {
      key: 'monetization' as keyof CategoryScore,
      label: t.monetization,
      icon: DollarSign,
      color: 'from-amber-500 to-amber-600',
      bgColor: 'from-amber-500/20 to-amber-600/20'
    }
  ];

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreChange = (key: keyof CategoryScore) => {
    const comparison = getScoreComparison();
    if (!comparison) return null;
    
    const change = comparison[key];
    if (change === 0) return null;
    
    return {
      value: change,
      positive: change > 0
    };
  };

  if (loading) {
    return (
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-2xl animate-pulse">
        <div className="h-8 bg-white/20 rounded mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white/10 rounded-2xl p-4">
              <div className="h-20 bg-white/20 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!currentScores) {
    return (
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-2xl">
        <div className="text-center py-8">
          <Target className="w-16 h-16 text-purple-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">{t.noScores}</h3>
          <Button
            onClick={onRetakeAssessment}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 rounded-2xl px-6 py-2 font-medium transition-all duration-200 hover:scale-105"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            {t.takeAssessment}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">{t.title}</h2>
        <Button
          onClick={onRetakeAssessment}
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 rounded-2xl px-6 py-2 font-medium transition-all duration-200 hover:scale-105"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          {t.retakeAssessment}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {scoreCategories.map((category) => {
          const score = currentScores[category.key];
          const IconComponent = category.icon;
          const scoreChange = getScoreChange(category.key);
          
          return (
            <div
              key={category.key}
              className={`bg-gradient-to-br ${category.bgColor} backdrop-blur-sm rounded-2xl p-4 border border-white/10 hover:border-white/20 transition-all duration-200 hover:scale-105`}
            >
              <div className="flex items-center justify-between mb-3">
                <IconComponent className="w-6 h-6 text-white" />
                <div className="flex items-center gap-2">
                  <span className={`text-2xl font-bold ${getScoreColor(score)}`}>
                    {score}%
                  </span>
                  {scoreChange && (
                    <span className={`text-xs font-medium ${scoreChange.positive ? 'text-emerald-400' : 'text-red-400'}`}>
                      {scoreChange.positive ? '+' : ''}{scoreChange.value}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="text-white font-medium text-sm">{category.label}</p>
                
                {/* Progress bar */}
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div
                    className={`bg-gradient-to-r ${category.color} h-2 rounded-full transition-all duration-500`}
                    style={{ width: `${score}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
