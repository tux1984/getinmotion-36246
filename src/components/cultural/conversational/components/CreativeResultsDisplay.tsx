import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Sparkles, CheckCircle, ArrowRight, Star, Palette, Target, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UserProfileData } from '../../types/wizardTypes';
import { MaturityLevel, PersonalizedTask } from '../types/conversationalTypes';

interface CreativeResultsDisplayProps {
  profileData: UserProfileData;
  maturityLevel: MaturityLevel | null;
  personalizedTasks: PersonalizedTask[];
  language: 'en' | 'es';
  businessType: string;
  onComplete: () => void;
}

export const CreativeResultsDisplay: React.FC<CreativeResultsDisplayProps> = ({
  profileData,
  maturityLevel,
  personalizedTasks,
  language,
  businessType,
  onComplete
}) => {
  const [isCompleting, setIsCompleting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const translations = {
    en: {
      title: 'Your Creative Business Profile',
      subtitle: 'Personalized insights and action plan',
      maturityTitle: 'Your Current Stage',
      tasksTitle: 'Your Personalized Action Plan',
      detectedAs: 'Detected as',
      characteristics: 'Key Characteristics',
      nextSteps: 'Recommended Next Steps',
      startJourney: 'Start Your Growth Journey',
      completing: 'Setting up your dashboard...',
      completed: 'Ready!',
      businessTypes: {
        creative: 'Creative Entrepreneur',
        service: 'Service Provider',
        product: 'Product Maker',
        tech: 'Tech Entrepreneur',
        other: 'Entrepreneur'
      }
    },
    es: {
      title: 'Tu Perfil de Negocio Creativo',
      subtitle: 'Insights personalizados y plan de acción',
      maturityTitle: 'Tu Etapa Actual',
      tasksTitle: 'Tu Plan de Acción Personalizado',
      detectedAs: 'Detectado como',
      characteristics: 'Características Clave',
      nextSteps: 'Siguientes Pasos Recomendados',
      startJourney: 'Comenzar tu Viaje de Crecimiento',
      completing: 'Configurando tu dashboard...',
      completed: '¡Listo!',
      businessTypes: {
        creative: 'Emprendedor Creativo',
        service: 'Proveedor de Servicios',
        product: 'Creador de Productos',
        tech: 'Emprendedor Tech',
        other: 'Emprendedor'
      }
    }
  };

  const t = translations[language];

  const handleComplete = async () => {
    setIsCompleting(true);
    
    // Provide immediate feedback then navigate
    setTimeout(() => {
      setIsCompleted(true);
      // Navigate immediately after visual feedback
      setTimeout(() => {
        onComplete();
      }, 300);
    }, 100);
  };

  const getBusinessIcon = () => {
    switch (businessType) {
      case 'creative':
        return <Palette className="w-6 h-6" />;
      case 'service':
        return <Target className="w-6 h-6" />;
      case 'product':
        return <TrendingUp className="w-6 h-6" />;
      default:
        return <Sparkles className="w-6 h-6" />;
    }
  };

  const getProfileSummary = () => {
    const businessName = profileData.businessDescription?.split(' ').slice(0, 4).join(' ') || 
      (language === 'es' ? 'tu proyecto creativo' : 'your creative project');
    
    if (language === 'es') {
      return `Hemos analizado ${businessName} y detectado que eres un ${t.businessTypes[businessType]} en la etapa "${maturityLevel?.name}". Basándome en tus respuestas específicas, he creado un plan de acción personalizado para ayudarte a crecer de manera estratégica.`;
    } else {
      return `We've analyzed ${businessName} and detected that you're a ${t.businessTypes[businessType]} at the "${maturityLevel?.name}" stage. Based on your specific responses, I've created a personalized action plan to help you grow strategically.`;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-4xl mx-auto p-6"
    >
      {/* Header with Achievement */}
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-6"
        >
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-primary via-accent to-secondary rounded-full flex items-center justify-center shadow-lg">
            <Trophy className="w-10 h-10 text-white" />
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-center justify-center gap-2 mb-2"
          >
            <Star className="w-5 h-5 text-accent" />
            <span className="text-accent font-medium">
              {t.detectedAs}: {t.businessTypes[businessType]}
            </span>
            <Star className="w-5 h-5 text-accent" />
          </motion.div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-3xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent mb-2"
        >
          {t.title}
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-muted-foreground text-lg"
        >
          {t.subtitle}
        </motion.p>
      </div>

      {/* Profile Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl p-6 mb-8 border border-border/50"
      >
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 p-3 bg-gradient-to-br from-primary to-accent rounded-lg text-white">
            {getBusinessIcon()}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground mb-2">
              {language === 'es' ? 'Resumen de tu Perfil' : 'Your Profile Summary'}
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              {getProfileSummary()}
            </p>
          </div>
        </div>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Maturity Level */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-background border border-border rounded-2xl p-6 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Target className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground">{t.maturityTitle}</h3>
          </div>
          
          {maturityLevel && (
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-lg text-foreground mb-1">
                  {maturityLevel.name}
                </h4>
                <p className="text-muted-foreground text-sm">
                  {maturityLevel.description}
                </p>
              </div>
              
              <div>
                <h5 className="font-medium text-foreground mb-2 text-sm">
                  {t.characteristics}
                </h5>
                <ul className="space-y-1">
                  {maturityLevel.characteristics.slice(0, 3).map((char, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="w-3 h-3 text-accent flex-shrink-0" />
                      {char}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </motion.div>

        {/* Personalized Tasks */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-background border border-border rounded-2xl p-6 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-accent/10 rounded-lg">
              <Sparkles className="w-5 h-5 text-accent" />
            </div>
            <h3 className="font-semibold text-foreground">{t.tasksTitle}</h3>
          </div>
          
          <div className="space-y-3">
            {personalizedTasks.slice(0, 4).map((task, index) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                className="p-3 bg-muted/30 rounded-lg border border-border/50"
              >
                <div className="flex items-start gap-3">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 mt-2 ${
                    task.priority === 'high' ? 'bg-destructive' :
                    task.priority === 'medium' ? 'bg-accent' : 'bg-muted-foreground'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-foreground text-sm mb-1">
                      {task.title}
                    </h4>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {task.description}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-muted-foreground">
                        {task.estimatedTime}
                      </span>
                      <span className="text-xs text-accent">
                        {task.category}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Next Steps */}
      {maturityLevel && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-gradient-to-r from-accent/5 to-secondary/5 rounded-2xl p-6 mb-8 border border-border/50"
        >
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-accent" />
            {t.nextSteps}
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {maturityLevel.nextSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9 + index * 0.1 }}
                className="flex items-center gap-2 p-3 bg-background/50 rounded-lg border border-border/30"
              >
                <span className="flex-shrink-0 w-6 h-6 bg-accent/20 text-accent rounded-full flex items-center justify-center text-xs font-medium">
                  {index + 1}
                </span>
                <span className="text-sm text-foreground">{step}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Action Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="text-center"
      >
        <Button
          onClick={handleComplete}
          disabled={isCompleting || isCompleted}
          size="lg"
          className="bg-gradient-to-r from-primary via-accent to-secondary hover:from-primary/90 hover:via-accent/90 hover:to-secondary/90 text-white px-8 py-6 text-lg font-medium shadow-lg"
        >
          {isCompleted ? (
            <>
              <CheckCircle className="w-5 h-5 mr-2" />
              {t.completed}
            </>
          ) : isCompleting ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="mr-2"
              >
                <Sparkles className="w-5 h-5" />
              </motion.div>
              {t.completing}
            </>
          ) : (
            <>
              {t.startJourney}
              <ArrowRight className="w-5 h-5 ml-2" />
            </>
          )}
        </Button>
      </motion.div>
    </motion.div>
  );
};