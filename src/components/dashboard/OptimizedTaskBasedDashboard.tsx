import React from 'react';
import { CategoryScore, RecommendedAgents } from '@/types/dashboard';
import { useOptimizedRecommendedTasks, OptimizedRecommendedTask } from '@/hooks/useOptimizedRecommendedTasks';
import { TaskCard } from './TaskCard';
import { MaturityScoreDisplay } from './MaturityScoreDisplay';
import { QuickStatsCards } from './QuickStatsCards';
import { Lightbulb, TrendingUp, Users } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface OptimizedTaskBasedDashboardProps {
  maturityScores: CategoryScore | null;
  recommendedAgents: RecommendedAgents;
  enabledAgents: string[];
  language: 'en' | 'es';
  onSelectAgent: (id: string) => void;
  onMaturityCalculatorClick: () => void;
}

export const OptimizedTaskBasedDashboard: React.FC<OptimizedTaskBasedDashboardProps> = ({
  maturityScores,
  recommendedAgents,
  enabledAgents,
  language,
  onSelectAgent,
  onMaturityCalculatorClick
}) => {
  const isMobile = useIsMobile();
  const { tasks, loading, markTaskCompleted } = useOptimizedRecommendedTasks(maturityScores, enabledAgents);

  const translations = {
    en: {
      welcome: 'Welcome to your Creative Workspace',
      subtitle: 'Your personalized AI-powered creative assistance platform',
      priorityTasks: 'Priority Tasks for You',
      noTasks: 'No tasks available',
      noTasksDescription: 'Complete your maturity assessment to get personalized recommendations',
      startAssessment: 'Start Assessment',
      insights: 'Your Creative Insights',
      quickStats: 'Quick Stats'
    },
    es: {
      welcome: 'Bienvenido a tu Espacio Creativo',
      subtitle: 'Tu plataforma personalizada de asistencia creativa impulsada por IA',
      priorityTasks: 'Tareas Prioritarias para Ti',
      noTasks: 'No hay tareas disponibles',
      noTasksDescription: 'Completa tu evaluación de madurez para obtener recomendaciones personalizadas',
      startAssessment: 'Comenzar Evaluación',
      insights: 'Tus Insights Creativos',
      quickStats: 'Estadísticas Rápidas'
    }
  };

  const t = translations[language];

  const handleTaskAction = (taskId: string, agentId: string) => {
    console.log('Task action triggered:', { taskId, agentId });
    markTaskCompleted(taskId);
    onSelectAgent(agentId);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${isMobile ? 'px-4' : ''}`}>
      {/* Welcome Header */}
      <div className="text-center mb-8">
        <h1 className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold text-gray-900 mb-2`}>
          {t.welcome}
        </h1>
        <p className={`text-gray-600 ${isMobile ? 'text-sm' : ''}`}>
          {t.subtitle}
        </p>
      </div>

      {/* Quick Stats */}
      <div className="mb-8">
        <h2 className={`${isMobile ? 'text-lg' : 'text-xl'} font-semibold text-gray-900 mb-4`}>
          {t.quickStats}
        </h2>
        <QuickStatsCards 
          maturityScores={maturityScores}
          enabledAgentsCount={enabledAgents.length}
          tasksCount={tasks.length}
          language={language}
        />
      </div>

      {/* Layout: Mobile Stack, Desktop Grid */}
      <div className={`${isMobile ? 'space-y-6' : 'grid grid-cols-1 lg:grid-cols-3 gap-6'}`}>
        {/* Priority Tasks Section */}
        <div className={`${isMobile ? '' : 'lg:col-span-2'}`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className={`${isMobile ? 'text-lg' : 'text-xl'} font-semibold text-gray-900`}>
              {t.priorityTasks}
            </h2>
            <Lightbulb className={`${isMobile ? 'w-5 h-5' : 'w-6 h-6'} text-yellow-500`} />
          </div>
          
          {tasks.length > 0 ? (
            <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}`}>
              {tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  language={language}
                  onAction={() => handleTaskAction(task.id, task.agentId)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">{t.noTasks}</h3>
              <p className="text-gray-600 mb-4">{t.noTasksDescription}</p>
              <button
                onClick={onMaturityCalculatorClick}
                className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                {t.startAssessment}
              </button>
            </div>
          )}
        </div>

        {/* Insights Sidebar */}
        <div className={`${isMobile ? '' : 'lg:col-span-1'}`}>
          <div className="flex items-center mb-4">
            <h2 className={`${isMobile ? 'text-lg' : 'text-xl'} font-semibold text-gray-900 mr-2`}>
              {t.insights}
            </h2>
            <Users className={`${isMobile ? 'w-5 h-5' : 'w-6 h-6'} text-purple-500`} />
          </div>
          
          <div className="space-y-4">
            {maturityScores && (
              <MaturityScoreDisplay 
                scores={maturityScores}
                language={language}
                compact={isMobile}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
