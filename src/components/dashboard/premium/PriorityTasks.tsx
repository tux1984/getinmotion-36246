
import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Star, Sparkles, ArrowRight } from 'lucide-react';
import { OptimizedRecommendedTask } from '@/hooks/useOptimizedRecommendedTasks';
import { PremiumTaskCard } from '../PremiumTaskCard';
import { useIsMobile } from '@/hooks/use-mobile';

interface PriorityTasksProps {
  language: 'en' | 'es';
  tasks: OptimizedRecommendedTask[];
  tasksLoading: boolean;
  onTaskAction: (taskId: string, agentId: string) => void;
  onMaturityCalculatorClick: () => void;
}

const t = {
    en: {
      priorityTasks: 'Priority Actions',
      noTasks: 'Ready to create magic?',
      noTasksDesc: 'Complete your creative assessment to unlock personalized recommendations',
      startAssessment: 'Start Creative Assessment',
    },
    es: {
      priorityTasks: 'Acciones Prioritarias',
      noTasks: '¿Listo para crear magia?',
      noTasksDesc: 'Completa tu evaluación creativa para desbloquear recomendaciones personalizadas',
      startAssessment: 'Iniciar Evaluación Creativa',
    }
};

export const PriorityTasks: React.FC<PriorityTasksProps> = ({
  language,
  tasks,
  tasksLoading,
  onTaskAction,
  onMaturityCalculatorClick
}) => {
  const isMobile = useIsMobile();

  return (
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

      {tasksLoading ? (
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
                onAction={() => onTaskAction(task.id, task.agentId)}
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
  );
};
