
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Music, 
  PaintBucket, 
  Scissors, 
  Flower2
} from 'lucide-react';

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
  industry = ''
}) => {
  const t = {
    en: {
      title: "Cultural Maturity Assessment",
      musician: "Music Creator",
      visualArtist: "Visual Artist",
      textileArtisan: "Textile Artisan", 
      indigenousArtisan: "Indigenous Artisan"
    },
    es: {
      title: "Evaluación de Madurez Cultural",
      musician: "Creador Musical",
      visualArtist: "Artista Visual",
      textileArtisan: "Artesano Textil",
      indigenousArtisan: "Artesana Autóctona"
    }
  };
  
  const getIndustryName = () => {
    if (!industry) return '';
    
    switch (industry) {
      case 'music': return t[language].musician;
      case 'visual-arts': return t[language].visualArtist;
      case 'textile': return t[language].textileArtisan;
      case 'indigenous': return t[language].indigenousArtisan;
      default: return '';
    }
  };
  
  const getIndustryIcon = () => {
    switch (industry) {
      case 'music': return <Music className="w-5 h-5" />;
      case 'visual-arts': return <PaintBucket className="w-5 h-5" />;
      case 'textile': return <Scissors className="w-5 h-5" />;
      case 'indigenous': return <Flower2 className="w-5 h-5" />;
      default: return null;
    }
  };

  // Get background patterns/gradients based on industry
  const getIndustryPattern = () => {
    switch (industry) {
      case 'music':
        return 'bg-gradient-to-r from-indigo-600 to-purple-600';
      case 'visual-arts':
        return 'bg-gradient-to-r from-amber-500 to-orange-600';
      case 'textile':
        return 'bg-gradient-to-r from-teal-500 to-emerald-600';
      case 'indigenous':
        return 'bg-gradient-to-r from-rose-500 to-pink-600';
      default:
        return 'bg-gradient-to-r from-blue-600 to-indigo-600';
    }
  };
  
  return (
    <motion.div 
      className="relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Abstract Design Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-72 bg-gradient-to-b from-indigo-50 to-transparent"></div>
        <motion.div 
          className="absolute -top-32 -right-32 w-64 h-64 rounded-full bg-purple-200 blur-3xl opacity-40"
          animate={{ 
            x: [0, 10, 0],
            y: [0, -15, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: "mirror"
          }}
        ></motion.div>
        <motion.div 
          className="absolute -bottom-40 -left-24 w-72 h-72 rounded-full bg-indigo-200 blur-3xl opacity-30"
          animate={{ 
            x: [0, -10, 0],
            y: [0, 10, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            repeatType: "mirror"
          }}
        ></motion.div>
      </div>
      
      <div className="relative h-48 flex items-center justify-center p-6 z-10">
        <div className="text-center">
          <motion.h1 
            className="text-2xl md:text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-700"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            {t[language].title}
          </motion.h1>
          
          {industry && (
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full shadow-md"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5, type: "spring" }}
            >
              <div className={`w-8 h-8 rounded-full ${getIndustryPattern()} text-white flex items-center justify-center`}>
                {getIndustryIcon()}
              </div>
              <span className="font-medium">{getIndustryName()}</span>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
