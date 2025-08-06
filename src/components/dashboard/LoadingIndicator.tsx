import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Sparkles } from 'lucide-react';

interface LoadingIndicatorProps {
  isVisible: boolean;
  message?: string;
}

export const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ 
  isVisible, 
  message = "Generando tareas inteligentes..." 
}) => {
  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center"
    >
      <div className="bg-card border border-border rounded-xl p-8 max-w-md mx-4 text-center shadow-xl">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center"
        >
          <Brain className="w-8 h-8 text-primary" />
        </motion.div>
        
        <div className="flex items-center justify-center gap-2 mb-3">
          <Sparkles className="w-5 h-5 text-primary animate-pulse" />
          <h3 className="text-lg font-semibold text-foreground">
            Coordinador Maestro
          </h3>
          <Sparkles className="w-5 h-5 text-primary animate-pulse" />
        </div>
        
        <p className="text-muted-foreground text-sm mb-4">
          {message}
        </p>
        
        <div className="flex justify-center space-x-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
              }}
              className="w-2 h-2 bg-primary rounded-full"
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};