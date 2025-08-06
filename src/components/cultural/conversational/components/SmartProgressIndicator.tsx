import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, Check, Clock, Brain } from 'lucide-react';

interface SmartProgressIndicatorProps {
  language: 'en' | 'es';
  isGenerating?: boolean;
  isSaving?: boolean;
  hasUnsavedChanges?: boolean;
}

export const SmartProgressIndicator: React.FC<SmartProgressIndicatorProps> = ({ 
  language, 
  isGenerating = false,
  isSaving = false,
  hasUnsavedChanges = false
}) => {
  const [showIndicator, setShowIndicator] = useState(false);

  const translations = {
    en: {
      saving: "Saving progress...",
      saved: "Progress saved",
      generating: "Generating smart questions...",
      unsavedChanges: "Unsaved changes"
    },
    es: {
      saving: "Guardando progreso...",
      saved: "Progreso guardado",
      generating: "Generando preguntas inteligentes...",
      unsavedChanges: "Cambios sin guardar"
    }
  };

  const t = translations[language];

  useEffect(() => {
    if (isGenerating || isSaving || hasUnsavedChanges) {
      setShowIndicator(true);
    } else {
      const timer = setTimeout(() => setShowIndicator(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isGenerating, isSaving, hasUnsavedChanges]);

  const getIndicatorContent = () => {
    if (isGenerating) {
      return {
        icon: <Brain className="w-4 h-4 text-blue-500" />,
        text: t.generating,
        bgColor: "bg-blue-50 dark:bg-blue-900/20",
        borderColor: "border-blue-200 dark:border-blue-800"
      };
    }
    
    if (isSaving) {
      return {
        icon: <Save className="w-4 h-4 text-yellow-500 animate-pulse" />,
        text: t.saving,
        bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
        borderColor: "border-yellow-200 dark:border-yellow-800"
      };
    }
    
    if (hasUnsavedChanges) {
      return {
        icon: <Clock className="w-4 h-4 text-orange-500" />,
        text: t.unsavedChanges,
        bgColor: "bg-orange-50 dark:bg-orange-900/20",
        borderColor: "border-orange-200 dark:border-orange-800"
      };
    }
    
    return {
      icon: <Check className="w-4 h-4 text-green-500" />,
      text: t.saved,
      bgColor: "bg-green-50 dark:bg-green-900/20",
      borderColor: "border-green-200 dark:border-green-800"
    };
  };

  const content = getIndicatorContent();

  return (
    <AnimatePresence>
      {showIndicator && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          transition={{ duration: 0.3 }}
          className={`fixed top-4 right-4 z-50 ${content.bgColor} border ${content.borderColor} rounded-lg p-3 shadow-lg max-w-xs`}
        >
          <div className="flex items-center gap-2">
            <div className="flex-shrink-0">
              {content.icon}
            </div>
            <span className="text-sm font-medium text-foreground">
              {content.text}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};