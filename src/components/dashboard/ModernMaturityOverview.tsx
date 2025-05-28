
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
      title: "Business Maturity Analysis",
      retakeAssessment: "Retake Assessment",
      ideaValidation: "Idea Validation",
      userExperience: "User Experience", 
      marketFit: "Market Fit",
      monetization: "Monetization",
      noScores: "Complete your maturity assessment to see your progress",
      takeAssessment: "Take Assessment",
      overallProgress: "Overall Progress"
    },
    es: {
      title: "Análisis de Madurez Empresarial",
      retakeAssessment: "Repetir Evaluación",
      ideaValidation: "Validación de Idea",
      userExperience: "Experiencia de Usuario",
      marketFit: "Ajuste de Mercado", 
      monetization: "Monetización",
      noScores: "Completa tu evaluación de madurez para ver tu progreso",
      takeAssessment: "Realizar Evaluación",
      overallProgress: "Progreso General"
    }
  };

  const t = translations[language];

  const scoreCategories = [
    {
      key: 'ideaValidation' as keyof CategoryScore,
      label: t.ideaValidation,
      icon: Target,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'from-purple-500/10 to-purple-600/10'
    },
    {
      key: 'userExperience' as keyof CategoryScore,
      label: t.userExperience,
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'from-blue-500/10 to-blue-600/10'
    },
    {
      key: 'marketFit' as keyof CategoryScore,
      label: t.marketFit,
      icon: TrendingUp,
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'from-emerald-500/10 to-emerald-600/10'
    },
    {
      key: 'monetization' as keyof CategoryScore,
      label: t.monetization,
      icon: DollarSign,
      color: 'from-amber-500 to-amber-600',
      bgColor: 'from-amber-500/10 to-amber-600/10'
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

  const getOverallScore = () => {
    if (!currentScores) return 0;
    return Math.round(
      (currentScores.ideaValidation + 
       currentScores.userExperience + 
       currentScores.marketFit + 
       currentScores.monetization) / 4
    );
  };

  if (loading) {
    return (
      <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-2xl animate-pulse">
        <div className="h-8 bg-slate-700/50 rounded mb-6"></div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-slate-800/50 rounded-xl p-4">
              <div className="h-20 bg-slate-700/50 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!currentScores) {
    return (
      <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-2xl">
        <div className="text-center py-8">
          <Target className="w-16 h-16 text-purple-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">{t.noScores}</h3>
          <Button
            onClick={onRetakeAssessment}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 rounded-xl px-6 py-2 font-medium transition-all duration-200 hover:scale-105"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            {t.takeAssessment}
          </Button>
        </div>
      </div>
    );
  }

  const overallScore = getOverallScore();

  return (
    <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">{t.title}</h2>
          <div className="flex items-center gap-3">
            <span className="text-slate-300">{t.overallProgress}:</span>
            <span className={`text-2xl font-bold ${getScoreColor(overallScore)}`}>
              {overallScore}%
            </span>
          </div>
        </div>
        <Button
          onClick={onRetakeAssessment}
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 rounded-xl px-6 py-2 font-medium transition-all duration-200 hover:scale-105"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          {t.retakeAssessment}
        </Button>
      </div>

      {/* Two-column layout for scores */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {scoreCategories.map((category) => {
          const score = currentScores[category.key];
          const IconComponent = category.icon;
          const scoreChange = getScoreChange(category.key);
          
          return (
            <div
              key={category.key}
              className={`bg-gradient-to-br ${category.bgColor} backdrop-blur-sm rounded-xl p-5 border border-slate-600/30 hover:border-slate-500/50 transition-all duration-200`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 bg-gradient-to-br ${category.color} rounded-lg flex items-center justify-center`}>
                    <IconComponent className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{category.label}</p>
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
                </div>
              </div>
              
              {/* Large progress bar */}
              <div className="w-full bg-slate-700/50 rounded-full h-3">
                <div
                  className={`bg-gradient-to-r ${category.color} h-3 rounded-full transition-all duration-1000 ease-out`}
                  style={{ width: `${score}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
