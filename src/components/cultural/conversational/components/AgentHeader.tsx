import React from 'react';
import { motion } from 'framer-motion';
import { Bot, Sparkles, CheckCircle } from 'lucide-react';
import { ConversationBlock } from '../types/conversationalTypes';

interface AgentHeaderProps {
  language: 'en' | 'es';
  currentBlock: ConversationBlock;
  progress: number;
  businessType?: string;
  agentPersonality?: string;
  personalizationCount?: number;
}

export const AgentHeader: React.FC<AgentHeaderProps> = ({
  language,
  currentBlock,
  progress,
  businessType,
  agentPersonality,
  personalizationCount
}) => {
  const translations = {
    en: {
      title: "Your Growth Agent",
      subtitle: "I'm here to understand your business and create a personalized growth path",
      currentStep: "We're talking about"
    },
    es: {
      title: "Tu Agente de Crecimiento",
      subtitle: "Estoy aquí para entender tu negocio y crear un camino de crecimiento personalizado",
      currentStep: "Estamos hablando sobre"
    }
  };

  const t = translations[language];

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-r from-purple-50 to-violet-50 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-purple-200/50 shadow-lg"
    >
      {/* Agent Avatar and Identity */}
      <div className="flex items-center gap-4 mb-4">
        <div className="relative">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-violet-600 rounded-full flex items-center justify-center shadow-lg">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center"
          >
            <Sparkles className="w-2 h-2 text-white" />
          </motion.div>
        </div>
        
        <div>
          <h1 className="text-xl font-bold text-foreground">{t.title}</h1>
          <p className="text-sm text-muted-foreground">{t.subtitle}</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-3">
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
          <span>{t.currentStep}: {currentBlock.title}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-purple-100 rounded-full h-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="bg-gradient-to-r from-purple-600 to-violet-600 h-2 rounded-full relative overflow-hidden shadow-sm"
          >
            <motion.div
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            />
          </motion.div>
        </div>
      </div>

      {/* Current Block Indicator */}
      <div className="flex items-center gap-2 text-sm">
        <CheckCircle className="w-4 h-4 text-green-500" />
        <span className="text-muted-foreground">{currentBlock.subtitle}</span>
      </div>
    </motion.div>
  );
};