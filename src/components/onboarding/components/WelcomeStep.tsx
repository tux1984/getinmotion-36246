
import React from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { ProfileType } from '@/types/dashboard';

interface WelcomeStepProps {
  profileType: ProfileType;
  onNext: () => void;
  language: 'en' | 'es';
}

export const WelcomeStep: React.FC<WelcomeStepProps> = ({ 
  profileType,
  onNext,
  language
}) => {
  const translations = {
    en: {
      title: "Welcome to GET IN MOTION!",
      subtitle: "Let's set up your personalized workspace",
      description: "Based on your profile selection, we'll customize your experience and recommend the best tools for your needs.",
      ideaProfile: "For your idea",
      soloProfile: "For your solo project",
      teamProfile: "For your team project",
      startButton: "Get Started",
      helpText: "This will only take a few minutes"
    },
    es: {
      title: "¡Bienvenido a GET IN MOTION!",
      subtitle: "Vamos a configurar tu espacio de trabajo personalizado",
      description: "Basado en tu selección de perfil, personalizaremos tu experiencia y recomendaremos las mejores herramientas para tus necesidades.",
      ideaProfile: "Para tu idea",
      soloProfile: "Para tu proyecto individual",
      teamProfile: "Para tu proyecto en equipo",
      startButton: "Comenzar",
      helpText: "Esto solo tomará unos minutos"
    }
  };

  const t = translations[language];
  
  const getProfileImage = () => {
    switch(profileType) {
      case 'idea':
        return "/lovable-uploads/4da82626-7a63-45bd-a402-64023f2f2d44.png";
      case 'solo':
        return "/lovable-uploads/a2ebe4fd-31ed-43ec-9f9f-35fe6b529ad2.png";
      case 'team':
        return "/lovable-uploads/cfd16f14-72a3-4b55-bfd2-67adcd44eb78.png";
      default:
        return "/lovable-uploads/390caed4-1006-489e-9da8-b17d9f8fb814.png";
    }
  };
  
  const getProfileTitle = () => {
    switch(profileType) {
      case 'idea': return t.ideaProfile;
      case 'solo': return t.soloProfile;
      case 'team': return t.teamProfile;
      default: return "";
    }
  };
  
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="p-0 h-full">
      <div className="flex flex-col md:flex-row h-full">
        {/* Left side content */}
        <div className="flex-1 p-6 md:p-10 flex flex-col justify-between">
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="max-w-lg"
          >
            <motion.h1 variants={item} className="text-3xl md:text-4xl font-bold text-purple-800 mb-3">
              {t.title}
            </motion.h1>
            
            <motion.h2 variants={item} className="text-xl mb-6 text-indigo-600 font-medium">
              {t.subtitle}
            </motion.h2>
            
            <motion.div variants={item} className="bg-purple-50 p-4 rounded-xl border border-purple-100 mb-6">
              <div className="flex items-center">
                <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full w-10 h-10 flex items-center justify-center mr-4">
                  {profileType === 'idea' && (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" x2="9.01" y1="9" y2="9"/><line x1="15" x2="15.01" y1="9" y2="9"/></svg>
                  )}
                  {profileType === 'solo' && (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  )}
                  {profileType === 'team' && (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                  )}
                </div>
                <span className="font-medium text-purple-700">{getProfileTitle()}</span>
              </div>
            </motion.div>
            
            <motion.p variants={item} className="text-gray-600 mb-8">
              {t.description}
            </motion.p>
            
          </motion.div>
          
          <motion.div 
            variants={item}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Button 
              onClick={onNext}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-6 py-6 h-auto rounded-xl flex items-center gap-2 shadow-md"
              size="lg"
            >
              {t.startButton}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <p className="text-gray-500 text-sm mt-2">{t.helpText}</p>
          </motion.div>
        </div>
        
        {/* Right side image */}
        <motion.div 
          className="md:w-2/5 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 flex items-center justify-center overflow-hidden p-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <motion.div
            initial={{ scale: 0.8, rotate: -5 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ 
              delay: 0.3, 
              type: "spring",
              stiffness: 100,
              duration: 0.8
            }}
            className="w-64 h-64 md:w-80 md:h-80 relative"
          >
            <img 
              src={getProfileImage()} 
              alt={`${profileType} profile illustration`} 
              className="w-full h-full object-contain drop-shadow-2xl"
            />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};
