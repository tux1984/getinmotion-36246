import React from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CategoryScore } from '@/types/dashboard';
import { TrendingUp, Target, Star, Award } from 'lucide-react';

interface MaturityProgressIndicatorProps {
  maturityScores: CategoryScore | null;
  completedTasksCount: number;
  totalTasksCount: number;
  language: 'en' | 'es';
}

export const MaturityProgressIndicator: React.FC<MaturityProgressIndicatorProps> = ({
  maturityScores,
  completedTasksCount,
  totalTasksCount,
  language
}) => {
  const translations = {
    en: {
      maturityProgress: 'Maturity Progress',
      currentLevel: 'Current Level',
      tasksCompleted: 'Tasks Completed',
      nextLevel: 'Next Level',
      levelUp: 'Level Up!',
      categories: {
        ideaValidation: 'Idea Validation',
        userExperience: 'User Experience',
        marketFit: 'Market Fit',
        monetization: 'Monetization'
      },
      levels: {
        beginner: 'Beginner',
        intermediate: 'Intermediate',
        advanced: 'Advanced',
        expert: 'Expert'
      }
    },
    es: {
      maturityProgress: 'Progreso de Madurez',
      currentLevel: 'Nivel Actual',
      tasksCompleted: 'Tareas Completadas',
      nextLevel: 'Siguiente Nivel',
      levelUp: '¡Subir de Nivel!',
      categories: {
        ideaValidation: 'Validación de Idea',
        userExperience: 'Experiencia de Usuario',
        marketFit: 'Encaje de Mercado',
        monetization: 'Monetización'
      },
      levels: {
        beginner: 'Principiante',
        intermediate: 'Intermedio',
        advanced: 'Avanzado',
        expert: 'Experto'
      }
    }
  };

  const t = translations[language];

  const getOverallMaturity = () => {
    if (!maturityScores) return { level: 'beginner', percentage: 25, color: 'from-purple-500 to-pink-500' };
    
    const average = Object.values(maturityScores).reduce((a, b) => a + b, 0) / 4;
    
    if (average >= 80) return { 
      level: 'expert', 
      percentage: average, 
      color: 'from-yellow-500 to-orange-500',
      nextLevel: null
    };
    if (average >= 60) return { 
      level: 'advanced', 
      percentage: average, 
      color: 'from-green-500 to-emerald-500',
      nextLevel: 'expert'
    };
    if (average >= 30) return { 
      level: 'intermediate', 
      percentage: average, 
      color: 'from-blue-500 to-cyan-500',
      nextLevel: 'advanced'
    };
    return { 
      level: 'beginner', 
      percentage: average, 
      color: 'from-purple-500 to-pink-500',
      nextLevel: 'intermediate'
    };
  };

  const getTaskProgress = () => {
    if (totalTasksCount === 0) return 0;
    return (completedTasksCount / totalTasksCount) * 100;
  };

  const getCategoryIcon = (category: keyof CategoryScore) => {
    const icons = {
      ideaValidation: Target,
      userExperience: Star,
      marketFit: TrendingUp,
      monetization: Award
    };
    return icons[category];
  };

  const getCategoryColor = (score: number) => {
    if (score >= 70) return 'text-green-600 bg-green-100';
    if (score >= 40) return 'text-blue-600 bg-blue-100';
    return 'text-purple-600 bg-purple-100';
  };

  const maturityData = getOverallMaturity();
  const taskProgress = getTaskProgress();

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <TrendingUp className="w-6 h-6 text-purple-600" />
        <h3 className="text-lg font-semibold text-gray-900">{t.maturityProgress}</h3>
      </div>

      {/* Overall Level */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">{t.currentLevel}</span>
          <span className="text-sm text-gray-600">{Math.round(maturityData.percentage)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
          <div 
            className={`bg-gradient-to-r ${maturityData.color} h-3 rounded-full transition-all duration-500`}
            style={{ width: `${maturityData.percentage}%` }}
          />
        </div>
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold text-gray-900">
            {t.levels[maturityData.level as keyof typeof t.levels]}
          </span>
          {maturityData.nextLevel && (
            <span className="text-sm text-gray-500">
              {t.nextLevel}: {t.levels[maturityData.nextLevel as keyof typeof t.levels]}
            </span>
          )}
        </div>
      </div>

      {/* Task Progress */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">{t.tasksCompleted}</span>
          <span className="text-sm text-gray-600">{completedTasksCount} / {totalTasksCount}</span>
        </div>
        <Progress value={taskProgress} className="h-2" />
      </div>

      {/* Category Breakdown */}
      {maturityScores && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Detalle por Categoría</h4>
          {Object.entries(maturityScores).map(([category, score]) => {
            const IconComponent = getCategoryIcon(category as keyof CategoryScore);
            const colorClass = getCategoryColor(score);
            
            return (
              <div key={category} className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${colorClass}`}>
                    <IconComponent className="w-4 h-4" />
                  </div>
                  <span className="text-sm text-gray-700">
                    {t.categories[category as keyof typeof t.categories]}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div 
                      className={`bg-gradient-to-r ${maturityData.color} h-2 rounded-full`}
                      style={{ width: `${score}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-8 text-right">
                    {score}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
};