import React from 'react';
import { motion } from 'framer-motion';
import { Bot, Sparkles, CheckCircle, Star, Zap, Target, Palette, Users, TrendingUp, Heart, Lightbulb, Building, DollarSign, AlertTriangle } from 'lucide-react';
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

  // Dynamic styling based on conversation block
  const getSectionStyling = (blockId: string) => {
    switch (blockId) {
      case 'welcome':
        return {
          gradient: 'from-pink-100 via-rose-100 to-pink-100',
          border: 'border-pink-300/60',
          icon: Heart,
          iconColor: 'text-pink-600',
          textColor: 'from-pink-800 to-rose-800',
          accentGradient: 'from-pink-200/30'
        };
      case 'businessType':
        return {
          gradient: 'from-blue-100 via-indigo-100 to-blue-100',
          border: 'border-blue-300/60',
          icon: Building,
          iconColor: 'text-blue-600',
          textColor: 'from-blue-800 to-indigo-800',
          accentGradient: 'from-blue-200/30'
        };
      case 'currentSituation':
        return {
          gradient: 'from-green-100 via-emerald-100 to-green-100',
          border: 'border-green-300/60',
          icon: TrendingUp,
          iconColor: 'text-green-600',
          textColor: 'from-green-800 to-emerald-800',
          accentGradient: 'from-green-200/30'
        };
      case 'salesReality':
        return {
          gradient: 'from-orange-100 via-amber-100 to-orange-100',
          border: 'border-orange-300/60',
          icon: DollarSign,
          iconColor: 'text-orange-600',
          textColor: 'from-orange-800 to-amber-800',
          accentGradient: 'from-orange-200/30'
        };
      case 'currentChallenges':
        return {
          gradient: 'from-red-100 via-rose-100 to-red-100',
          border: 'border-red-300/60',
          icon: AlertTriangle,
          iconColor: 'text-red-600',
          textColor: 'from-red-800 to-rose-800',
          accentGradient: 'from-red-200/30'
        };
      case 'vision':
        return {
          gradient: 'from-purple-100 via-violet-100 to-purple-100',
          border: 'border-purple-300/60',
          icon: Target,
          iconColor: 'text-purple-600',
          textColor: 'from-purple-800 to-violet-800',
          accentGradient: 'from-purple-200/30'
        };
      default:
        return {
          gradient: 'from-gray-100 via-slate-100 to-gray-100',
          border: 'border-gray-300/60',
          icon: Lightbulb,
          iconColor: 'text-gray-600',
          textColor: 'from-gray-800 to-slate-800',
          accentGradient: 'from-gray-200/30'
        };
    }
  };

  const styling = getSectionStyling(currentBlock.id);
  const SectionIcon = styling.icon;

  return (
    <motion.div
      key={currentBlock.id}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`bg-gradient-to-r ${styling.gradient} backdrop-blur-sm rounded-2xl p-6 mb-6 border ${styling.border} shadow-xl relative overflow-hidden`}
    >
      {/* Animated background accent */}
      <motion.div
        animate={{ x: ['-100%', '100%'] }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        className={`absolute inset-0 bg-gradient-to-r from-transparent via-${styling.accentGradient} to-transparent`}
      />
      
      {/* Agent Avatar and Identity */}
      <div className="flex items-center gap-4 mb-4 relative z-10">
        <div className="relative">
          <div className={`w-14 h-14 bg-gradient-to-br ${styling.iconColor.replace('text-', 'from-')} to-opacity-80 rounded-full flex items-center justify-center shadow-lg border-2 ${styling.border}`}>
            <Bot className="w-7 h-7 text-white" />
          </div>
          <motion.div
            animate={{ scale: [1, 1.3, 1], rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center shadow-md"
          >
            <Sparkles className="w-2.5 h-2.5 text-white" />
          </motion.div>
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
            className="absolute -bottom-1 -left-1 w-4 h-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center"
          >
            <Star className="w-2 h-2 text-white" />
          </motion.div>
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h1 className={`text-xl font-bold bg-gradient-to-r ${styling.textColor} bg-clip-text text-transparent`}>{t.title}</h1>
            <SectionIcon className={`w-5 h-5 ${styling.iconColor}`} />
          </div>
          <p className={`text-sm ${styling.iconColor.replace('text-', 'text-').replace('-600', '-700')} font-medium`}>{t.subtitle}</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-3">
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
          <span>{t.currentStep}: {currentBlock.title}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className={`w-full ${styling.gradient.replace('from-', 'bg-').split(' ')[0].replace('bg-', 'bg-').replace('-100', '-200')} rounded-full h-2`}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className={`bg-gradient-to-r ${styling.iconColor.replace('text-', 'from-')} to-opacity-80 h-2 rounded-full relative overflow-hidden shadow-sm`}
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
      <div className="flex items-center gap-2 text-sm relative z-10">
        <SectionIcon className={`w-4 h-4 ${styling.iconColor}`} />
        <span className={`${styling.iconColor.replace('text-', 'text-').replace('-600', '-700')} font-medium`}>{currentBlock.subtitle}</span>
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="ml-auto"
        >
          <CheckCircle className="w-4 h-4 text-emerald-500" />
        </motion.div>
      </div>
    </motion.div>
  );
};