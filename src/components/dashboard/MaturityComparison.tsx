
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CategoryScore } from '@/types/dashboard';
import { TrendingUp, Calendar, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface MaturityComparisonProps {
  currentScores: CategoryScore;
  previousScores?: CategoryScore;
  language: 'en' | 'es';
}

export const MaturityComparison: React.FC<MaturityComparisonProps> = ({
  currentScores,
  previousScores,
  language
}) => {
  const navigate = useNavigate();

  const translations = {
    en: {
      maturityOverview: "Maturity Overview",
      currentAssessment: "Current Assessment",
      previousAssessment: "Previous Assessment",
      improvement: "Improvement",
      ideaValidation: "Idea Validation",
      userExperience: "User Experience", 
      marketFit: "Market Fit",
      monetization: "Monetization",
      noComparison: "Complete another assessment to see your progress",
      retakeAssessment: "Retake Assessment",
      lastAssessment: "Last assessment"
    },
    es: {
      maturityOverview: "Resumen de Madurez",
      currentAssessment: "Evaluación Actual",
      previousAssessment: "Evaluación Anterior",
      improvement: "Mejora",
      ideaValidation: "Validación de Idea",
      userExperience: "Experiencia de Usuario",
      marketFit: "Ajuste de Mercado", 
      monetization: "Monetización",
      noComparison: "Completa otra evaluación para ver tu progreso",
      retakeAssessment: "Repetir Evaluación",
      lastAssessment: "Última evaluación"
    }
  };

  const t = translations[language];

  const categories = [
    { key: 'ideaValidation', label: t.ideaValidation },
    { key: 'userExperience', label: t.userExperience },
    { key: 'marketFit', label: t.marketFit },
    { key: 'monetization', label: t.monetization }
  ];

  const averageScore = useMemo(() => {
    const scores = Object.values(currentScores);
    return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
  }, [currentScores]);

  const getImprovementColor = (current: number, previous?: number) => {
    if (!previous) return 'text-gray-500';
    if (current > previous) return 'text-green-600';
    if (current < previous) return 'text-red-600';
    return 'text-gray-500';
  };

  const handleRetakeAssessment = () => {
    navigate('/maturity-calculator');
  };

  return (
    <Card className="bg-white/95 backdrop-blur-sm border-purple-100">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold text-purple-900 flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            {t.maturityOverview}
          </CardTitle>
          <div className="text-right">
            <div className="text-2xl font-bold text-purple-600">{averageScore}%</div>
            <div className="text-sm text-gray-500 flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {t.lastAssessment}
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {categories.map(({ key, label }) => {
          const current = currentScores[key as keyof CategoryScore];
          const previous = previousScores?.[key as keyof CategoryScore];
          const improvement = previous ? current - previous : 0;
          
          return (
            <div key={key} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-700">{label}</span>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-purple-600">{current}%</span>
                  {previous && (
                    <span className={`text-sm flex items-center gap-1 ${getImprovementColor(current, previous)}`}>
                      <TrendingUp className="w-3 h-3" />
                      {improvement > 0 ? '+' : ''}{improvement}%
                    </span>
                  )}
                </div>
              </div>
              <Progress value={current} className="h-2" />
            </div>
          );
        })}
        
        {!previousScores && (
          <div className="bg-purple-50 p-4 rounded-lg text-center">
            <p className="text-purple-700 mb-3">{t.noComparison}</p>
            <Button 
              onClick={handleRetakeAssessment}
              className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700"
            >
              {t.retakeAssessment}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
