
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Clock, AlertTriangle } from 'lucide-react';

interface AIRecommendation {
  title: string;
  description: string;
  priority: 'High' | 'Medium' | 'Low' | 'Alta' | 'Media' | 'Baja';
  timeframe: string;
}

interface AIRecommendationsProps {
  recommendations: AIRecommendation[];
  language: 'en' | 'es';
  isLoading?: boolean;
}

export const AIRecommendations: React.FC<AIRecommendationsProps> = ({
  recommendations,
  language,
  isLoading = false
}) => {
  const t = {
    en: {
      title: "Personalized Action Plan",
      subtitle: "AI-generated recommendations based on your assessment",
      noRecommendations: "No recommendations available at this time",
      priority: {
        High: "High Priority",
        Medium: "Medium Priority", 
        Low: "Low Priority"
      },
      loading: "Generating personalized recommendations..."
    },
    es: {
      title: "Plan de Acción Personalizado",
      subtitle: "Recomendaciones generadas por IA basadas en tu evaluación",
      noRecommendations: "No hay recomendaciones disponibles en este momento",
      priority: {
        Alta: "Prioridad Alta",
        Media: "Prioridad Media",
        Baja: "Prioridad Baja"
      },
      loading: "Generando recomendaciones personalizadas..."
    }
  };

  const getPriorityColor = (priority: string) => {
    const normalizedPriority = priority.toLowerCase();
    if (normalizedPriority.includes('high') || normalizedPriority.includes('alta')) {
      return 'from-red-500 to-orange-600';
    }
    if (normalizedPriority.includes('medium') || normalizedPriority.includes('media')) {
      return 'from-yellow-500 to-amber-600';
    }
    return 'from-green-500 to-emerald-600';
  };

  const getPriorityIcon = (priority: string) => {
    const normalizedPriority = priority.toLowerCase();
    if (normalizedPriority.includes('high') || normalizedPriority.includes('alta')) {
      return AlertTriangle;
    }
    return Clock;
  };

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-lg p-8 relative overflow-hidden"
      >
        <div className="flex items-center justify-center space-x-3">
          <div className="animate-spin w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full"></div>
          <span className="text-purple-700 font-medium">{t[language].loading}</span>
        </div>
      </motion.div>
    );
  }

  if (!recommendations || recommendations.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-lg p-8 text-center"
      >
        <Sparkles className="w-12 h-12 text-gray-400 mx-auto mb-3" />
        <p className="text-gray-600">{t[language].noRecommendations}</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-lg p-8 relative overflow-hidden"
    >
      <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-purple-100 blur-3xl opacity-60"></div>
      <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-blue-100 blur-3xl opacity-60"></div>
      
      <div className="relative z-10">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
              {t[language].title}
            </h3>
            <p className="text-sm text-gray-600">{t[language].subtitle}</p>
          </div>
        </div>
        
        <div className="space-y-4">
          {recommendations.map((recommendation, index) => {
            const IconComponent = getPriorityIcon(recommendation.priority);
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className="p-5 rounded-xl bg-gradient-to-br from-slate-50 to-white border border-slate-200/50 hover:shadow-md transition-all"
              >
                <div className="flex gap-4">
                  <div className="shrink-0">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getPriorityColor(recommendation.priority)} text-white flex items-center justify-center`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">{recommendation.title}</h4>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium text-white bg-gradient-to-r ${getPriorityColor(recommendation.priority)}`}>
                          {t[language].priority[recommendation.priority as keyof typeof t.en.priority] || recommendation.priority}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-700 text-sm mb-3">{recommendation.description}</p>
                    <div className="flex items-center text-xs text-gray-500">
                      <Clock className="w-3 h-3 mr-1" />
                      <span>{recommendation.timeframe}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};
