
import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { Agent, CategoryScore, RecommendedAgents } from '@/types/dashboard';
import { useOptimizedRecommendedTasks } from '@/hooks/useOptimizedRecommendedTasks';
import { PremiumTaskCard } from './PremiumTaskCard';
import { PremiumStatsCard } from './PremiumStatsCard';
import { PremiumAgentCard } from './PremiumAgentCard';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  Sparkles, 
  TrendingUp, 
  Users, 
  Target,
  ArrowRight,
  Zap,
  Star
} from 'lucide-react';

interface PremiumDashboardMainProps {
  onSelectAgent: (id: string) => void;
  onMaturityCalculatorClick: () => void;
  onAgentManagerClick: () => void;
  agents: Agent[];
  maturityScores: CategoryScore | null;
  recommendedAgents: RecommendedAgents;
}

export const PremiumDashboardMain: React.FC<PremiumDashboardMainProps> = ({
  onSelectAgent,
  onMaturityCalculatorClick,
  onAgentManagerClick,
  agents,
  maturityScores,
  recommendedAgents
}) => {
  const { language } = useLanguage();
  const isMobile = useIsMobile();
  const { tasks, loading } = useOptimizedRecommendedTasks(maturityScores, agents.filter(a => a.status === 'active').map(a => a.id));

  const t = {
    en: {
      welcome: 'Welcome to your Creative Universe',
      subtitle: 'Where art meets innovation and dreams become reality',
      priorityTasks: 'Priority Actions',
      myAgents: 'Your AI Creative Team',
      insights: 'Creative Insights',
      getStarted: 'Get Started',
      exploreAgents: 'Explore All Agents',
      noTasks: 'Ready to create magic?',
      noTasksDesc: 'Complete your creative assessment to unlock personalized recommendations',
      startAssessment: 'Start Creative Assessment',
      activeAgents: 'Active Assistants',
      completedTasks: 'Completed Today',
      projectProgress: 'Project Progress'
    },
    es: {
      welcome: 'Bienvenido a tu Universo Creativo',
      subtitle: 'Donde el arte se encuentra con la innovación y los sueños se hacen realidad',
      priorityTasks: 'Acciones Prioritarias',
      myAgents: 'Tu Equipo Creativo IA',
      insights: 'Insights Creativos',
      getStarted: 'Comenzar',
      exploreAgents: 'Explorar Todos los Agentes',
      noTasks: '¿Listo para crear magia?',
      noTasksDesc: 'Completa tu evaluación creativa para desbloquear recomendaciones personalizadas',
      startAssessment: 'Iniciar Evaluación Creativa',
      activeAgents: 'Asistentes Activos',
      completedTasks: 'Completadas Hoy',
      projectProgress: 'Progreso del Proyecto'
    }
  };

  const activeAgents = agents.filter(agent => agent.status === 'active');
  const overallProgress = maturityScores 
    ? Math.round((maturityScores.ideaValidation + maturityScores.userExperience + maturityScores.marketFit + maturityScores.monetization) / 4)
    : 0;

  const handleTaskAction = (taskId: string, agentId: string) => {
    console.log('Starting task:', taskId, 'with agent:', agentId);
    onSelectAgent(agentId);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section with Gradient Background */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%239C92AC\" fill-opacity=\"0.05\"%3E%3Ccircle cx=\"30\" cy=\"30\" r=\"2\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
        
        <motion.div 
          className={`relative z-10 ${isMobile ? 'px-4 py-8' : 'px-6 py-12'}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-lg border border-white/20 mb-6"
            >
              <Sparkles className="w-4 h-4 text-yellow-400 mr-2" />
              <span className="text-white/90 text-sm font-medium">
                {language === 'en' ? 'AI-Powered Creative Assistant' : 'Asistente Creativo con IA'}
              </span>
            </motion.div>
            
            <motion.h1 
              className={`font-bold text-white mb-4 ${isMobile ? 'text-3xl' : 'text-5xl'}`}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              {t[language].welcome}
            </motion.h1>
            
            <motion.p 
              className={`text-white/80 mb-8 ${isMobile ? 'text-base px-4' : 'text-xl max-w-2xl mx-auto'}`}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              {t[language].subtitle}
            </motion.p>

            {/* Quick Stats */}
            <motion.div 
              className={`grid gap-6 mb-8 ${isMobile ? 'grid-cols-1 px-2' : 'grid-cols-3 max-w-2xl mx-auto'}`}
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <PremiumStatsCard
                icon={Users}
                title={t[language].activeAgents}
                value={activeAgents.length}
                color="text-blue-400"
                bgColor="bg-blue-500/20"
              />
              <PremiumStatsCard
                icon={Target}
                title={t[language].completedTasks}
                value={tasks.filter(t => t.completed).length}
                color="text-green-400"
                bgColor="bg-green-500/20"
              />
              <PremiumStatsCard
                icon={TrendingUp}
                title={t[language].projectProgress}
                value={`${overallProgress}%`}
                color="text-purple-400"
                bgColor="bg-purple-500/20"
              />
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className={`${isMobile ? 'px-4 py-6' : 'px-6 py-8'} bg-gray-50`}>
        <div className="max-w-7xl mx-auto">
          <div className={`grid gap-8 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-3'}`}>
            
            {/* Priority Tasks - Main Column */}
            <div className={`${isMobile ? '' : 'lg:col-span-2'} space-y-6`}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center mr-3">
                      <Zap className="w-5 h-5 text-white" />
                    </div>
                    <h2 className={`font-bold text-gray-900 ${isMobile ? 'text-xl' : 'text-2xl'}`}>
                      {t[language].priorityTasks}
                    </h2>
                  </div>
                  <Star className="w-5 h-5 text-yellow-500" />
                </div>

                {loading ? (
                  <div className="grid gap-4 md:grid-cols-2">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="h-48 bg-gray-200 rounded-xl animate-pulse"></div>
                    ))}
                  </div>
                ) : tasks.length > 0 ? (
                  <div className={`grid gap-6 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}`}>
                    {tasks.slice(0, 6).map((task, index) => (
                      <motion.div
                        key={task.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 + index * 0.1, duration: 0.5 }}
                      >
                        <PremiumTaskCard
                          task={task}
                          language={language}
                          onAction={() => handleTaskAction(task.id, task.agentId)}
                        />
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <motion.div 
                    className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.7, duration: 0.5 }}
                  >
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center mx-auto mb-4">
                      <Sparkles className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{t[language].noTasks}</h3>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto">{t[language].noTasksDesc}</p>
                    <button
                      onClick={onMaturityCalculatorClick}
                      className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      {t[language].startAssessment}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </button>
                  </motion.div>
                )}
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Active Agents */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{t[language].myAgents}</h3>
                  <button
                    onClick={onAgentManagerClick}
                    className="text-purple-600 hover:text-purple-700 text-sm font-medium"
                  >
                    {t[language].exploreAgents}
                  </button>
                </div>
                
                <div className="space-y-3">
                  {activeAgents.slice(0, 4).map((agent, index) => (
                    <motion.div
                      key={agent.id}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.9 + index * 0.1, duration: 0.4 }}
                    >
                      <PremiumAgentCard
                        agent={agent}
                        language={language}
                        onSelect={() => onSelectAgent(agent.id)}
                      />
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Creative Insights */}
              {maturityScores && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.0, duration: 0.5 }}
                  className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl border border-purple-100 p-6"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">{t[language].insights}</h3>
                  <div className="space-y-4">
                    {[
                      { label: 'Idea Validation', value: maturityScores.ideaValidation, color: 'bg-blue-500' },
                      { label: 'User Experience', value: maturityScores.userExperience, color: 'bg-green-500' },
                      { label: 'Market Fit', value: maturityScores.marketFit, color: 'bg-yellow-500' },
                      { label: 'Monetization', value: maturityScores.monetization, color: 'bg-purple-500' }
                    ].map((item) => (
                      <div key={item.label} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-700">{item.label}</span>
                          <span className="font-medium text-gray-900">{item.value}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <motion.div
                            className={`h-2 rounded-full ${item.color}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${item.value}%` }}
                            transition={{ delay: 1.2, duration: 0.8 }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
