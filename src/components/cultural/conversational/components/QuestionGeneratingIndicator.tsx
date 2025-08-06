import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Sparkles } from 'lucide-react';

interface QuestionGeneratingIndicatorProps {
  language: 'en' | 'es';
  isVisible: boolean;
}

export const QuestionGeneratingIndicator: React.FC<QuestionGeneratingIndicatorProps> = ({
  language,
  isVisible
}) => {
  if (!isVisible) return null;

  const text = language === 'es' 
    ? 'Generando preguntas personalizadas basadas en tu negocio...' 
    : 'Generating personalized questions based on your business...';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-6"
    >
      <div className="flex items-center gap-3">
        <div className="relative">
          <Brain className="h-5 w-5 text-primary" />
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5] 
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut" 
            }}
            className="absolute -top-1 -right-1"
          >
            <Sparkles className="h-3 w-3 text-primary" />
          </motion.div>
        </div>
        
        <div className="flex-1">
          <p className="text-sm font-medium text-primary mb-1">
            {language === 'es' ? 'Inteligencia en acción' : 'Intelligence in action'}
          </p>
          <p className="text-xs text-muted-foreground">
            {text}
          </p>
        </div>
        
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "linear" 
          }}
          className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full"
        />
      </div>
    </motion.div>
  );
};