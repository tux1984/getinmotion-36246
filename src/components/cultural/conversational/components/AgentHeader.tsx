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
  agentMessage?: string;
}

export const AgentHeader: React.FC<AgentHeaderProps> = ({
  language,
  currentBlock,
  progress,
  businessType,
  agentPersonality,
  personalizationCount,
  agentMessage
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

  // Debug current block
  console.log('Current block ID:', currentBlock.id);

  // Dynamic styling based on conversation block - SIMPLIFIED GRADIENTS
  const getSectionStyling = (blockId: string) => {
    switch (blockId) {
      case 'welcome':
        return {
          gradient: 'bg-gradient-to-r from-pink-400 to-rose-400',
          border: 'border-pink-300',
          icon: Heart,
          iconColor: 'text-white',
          textColor: 'text-white',
          accentGradient: 'bg-pink-500/20'
        };
      case 'businessType':
        return {
          gradient: 'bg-gradient-to-r from-blue-400 to-indigo-400',
          border: 'border-blue-300',
          icon: Building,
          iconColor: 'text-white',
          textColor: 'text-white',
          accentGradient: 'bg-blue-500/20'
        };
      case 'currentSituation':
        return {
          gradient: 'bg-gradient-to-r from-green-400 to-emerald-400',
          border: 'border-green-300',
          icon: TrendingUp,
          iconColor: 'text-white',
          textColor: 'text-white',
          accentGradient: 'bg-green-500/20'
        };
      case 'salesReality':
        return {
          gradient: 'bg-gradient-to-r from-orange-400 to-amber-400',
          border: 'border-orange-300',
          icon: DollarSign,
          iconColor: 'text-white',
          textColor: 'text-white',
          accentGradient: 'bg-orange-500/20'
        };
      case 'currentChallenges':
        return {
          gradient: 'bg-gradient-to-r from-red-400 to-rose-400',
          border: 'border-red-300',
          icon: AlertTriangle,
          iconColor: 'text-white',
          textColor: 'text-white',
          accentGradient: 'bg-red-500/20'
        };
      case 'vision':
        return {
          gradient: 'bg-gradient-to-r from-purple-400 to-violet-400',
          border: 'border-purple-300',
          icon: Target,
          iconColor: 'text-white',
          textColor: 'text-white',
          accentGradient: 'bg-purple-500/20'
        };
      default:
        return {
          gradient: 'bg-gradient-to-r from-gray-400 to-slate-400',
          border: 'border-gray-300',
          icon: Lightbulb,
          iconColor: 'text-white',
          textColor: 'text-white',
          accentGradient: 'bg-gray-500/20'
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

      {/* Agent Message */}
      {agentMessage && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="mt-4 p-4 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30 relative z-10"
        >
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
            </div>
            <p className="text-white/90 text-sm leading-relaxed flex-1">
              {agentMessage}
            </p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};