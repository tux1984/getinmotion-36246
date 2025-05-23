
import React from 'react';
import { motion, Variants } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

interface CompletionStepProps {
  language: 'en' | 'es';
  onComplete: () => void;
}

export const CompletionStep: React.FC<CompletionStepProps> = ({ 
  language,
  onComplete
}) => {
  const translations = {
    en: {
      title: "Your workspace is ready!",
      description: "We've set up your personalized workspace based on your preferences and project needs.",
      items: [
        "Recommended copilots have been added to your dashboard",
        "Your project profile has been saved",
        "You can customize your workspace anytime",
      ],
      button: "Go to My Dashboard"
    },
    es: {
      title: "¡Tu espacio de trabajo está listo!",
      description: "Hemos configurado tu espacio de trabajo personalizado según tus preferencias y necesidades del proyecto.",
      items: [
        "Los copilotos recomendados han sido añadidos a tu panel",
        "Tu perfil de proyecto ha sido guardado",
        "Puedes personalizar tu espacio de trabajo en cualquier momento",
      ],
      button: "Ir a Mi Panel"
    }
  };

  const t = translations[language];
  
  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };
  
  const item: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="p-6 md:p-8">
      <motion.div 
        className="text-center mb-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex justify-center mb-6">
          <motion.div 
            className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
          >
            <CheckCircle className="h-10 w-10 text-green-600" />
          </motion.div>
        </div>
        
        <h2 className="text-2xl md:text-3xl font-bold text-green-700 mb-3">
          {t.title}
        </h2>
        
        <p className="text-gray-600 max-w-lg mx-auto">
          {t.description}
        </p>
      </motion.div>
      
      <motion.div
        className="max-w-md mx-auto mb-10"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {t.items.map((item, index) => (
          <motion.div 
            key={index}
            variants={item}
            className="flex items-center mb-4 bg-green-50 p-4 rounded-lg border border-green-100"
          >
            <div className="h-8 w-8 rounded-full bg-green-200 flex items-center justify-center mr-4">
              <CheckCircle className="h-5 w-5 text-green-700" />
            </div>
            <span className="text-green-800">{item}</span>
          </motion.div>
        ))}
      </motion.div>
      
      <motion.div 
        className="text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <Button
          onClick={onComplete}
          className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-3 h-auto rounded-md shadow-md"
          size="lg"
        >
          {t.button}
        </Button>
      </motion.div>
    </div>
  );
};
