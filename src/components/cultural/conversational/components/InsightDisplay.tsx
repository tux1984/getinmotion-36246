import React from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, TrendingUp, Target } from 'lucide-react';

interface InsightDisplayProps {
  insights: string[];
  language: 'en' | 'es';
}

export const InsightDisplay: React.FC<InsightDisplayProps> = ({
  insights,
  language
}) => {
  const translations = {
    en: {
      thinking: "I'm noticing...",
      opportunity: "Growth opportunity"
    },
    es: {
      thinking: "Estoy notando...",
      opportunity: "Oportunidad de crecimiento"
    }
  };

  const t = translations[language];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-3"
    >
      {insights.map((insight, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-4"
        >
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900 rounded-full flex items-center justify-center flex-shrink-0">
              {index % 3 === 0 && <Lightbulb className="w-4 h-4 text-amber-600 dark:text-amber-400" />}
              {index % 3 === 1 && <TrendingUp className="w-4 h-4 text-amber-600 dark:text-amber-400" />}
              {index % 3 === 2 && <Target className="w-4 h-4 text-amber-600 dark:text-amber-400" />}
            </div>
            <div className="flex-1">
              <p className="text-sm text-amber-800 dark:text-amber-200">{insight}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};