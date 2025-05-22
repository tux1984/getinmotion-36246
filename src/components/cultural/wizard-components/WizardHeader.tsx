
import React from 'react';
import { motion } from 'framer-motion';
import { Music, PaintBucket, Wrench, Projector, Package, Palette } from 'lucide-react';

interface WizardHeaderProps {
  step: number;
  totalSteps: number;
  language: 'en' | 'es';
  industry?: string;
}

export const WizardHeader: React.FC<WizardHeaderProps> = ({
  step,
  totalSteps,
  language,
  industry
}) => {
  const t = {
    en: {
      title: "Cultural Project Assessment",
      subtitle: "Let's understand your creative project to provide personalized recommendations",
      industries: {
        music: "Music",
        visual_arts: "Visual Arts",
        crafts: "Crafts",
        theater: "Performance Arts",
        events: "Cultural Production",
        other: "Cultural Project"
      }
    },
    es: {
      title: "Evaluación de Proyecto Cultural",
      subtitle: "Comprendamos tu proyecto creativo para brindarte recomendaciones personalizadas",
      industries: {
        music: "Música",
        visual_arts: "Artes Visuales",
        crafts: "Artesanía",
        theater: "Artes Escénicas",
        events: "Producción Cultural",
        other: "Proyecto Cultural"
      }
    }
  };
  
  const getIndustryIcon = () => {
    switch (industry) {
      case 'music':
        return <Music className="w-8 h-8" />;
      case 'visual_arts':
        return <PaintBucket className="w-8 h-8" />;
      case 'crafts':
        return <Wrench className="w-8 h-8" />;
      case 'theater':
        return <Projector className="w-8 h-8" />;
      case 'events':
        return <Palette className="w-8 h-8" />;
      default:
        return <Package className="w-8 h-8" />;
    }
  };
  
  const getIndustryText = () => {
    if (!industry) return '';
    return t[language].industries[industry as keyof typeof t.en.industries] || t[language].industries.other;
  };
  
  return (
    <div className="p-8 pb-6 bg-gradient-to-r from-purple-600 to-purple-500 text-white border-b border-purple-400 shadow-md">
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-1">
            {t[language].title}
          </h1>
          <p className="text-purple-100 md:text-lg">
            {t[language].subtitle}
          </p>
        </motion.div>
        
        {industry && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="mt-4 md:mt-0"
          >
            <div className="flex items-center gap-3 px-5 py-3 bg-white/10 backdrop-blur-sm rounded-xl shadow-sm">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-300 to-indigo-400 text-white flex items-center justify-center">
                {getIndustryIcon()}
              </div>
              <div>
                <div className="text-sm text-purple-200 font-medium uppercase tracking-wide">
                  {language === 'en' ? 'Your Industry' : 'Tu Industria'}
                </div>
                <div className="text-lg font-semibold text-white">
                  {getIndustryText()}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};
