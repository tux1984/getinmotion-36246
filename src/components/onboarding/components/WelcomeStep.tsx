
import React from 'react';
import { ProfileType } from '@/types/dashboard';
import { Lightbulb, User, Users } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface WelcomeStepProps {
  profileType: ProfileType;
}

export const WelcomeStep: React.FC<WelcomeStepProps> = ({ profileType }) => {
  const { language } = useLanguage();
  
  return (
    <div className="text-center py-8">
      <h2 className="text-2xl font-bold mb-4">{profileType === 'idea' 
        ? language === 'en' ? "Great! Let's define your vision" : "¡Genial! Definamos tu visión"
        : profileType === 'solo'
        ? language === 'en' ? "Let's help you get more efficient" : "Ayudémoste a ser más eficiente"
        : language === 'en' ? "Let's organize your team workflow" : "Organicemos el flujo de trabajo de tu equipo"
      }</h2>
      
      <p className="text-gray-600 mb-8">
        {profileType === 'idea' 
          ? language === 'en' 
            ? "We'll help you validate your idea and create a roadmap to bring it to life."
            : "Te ayudaremos a validar tu idea y crear una hoja de ruta para hacerla realidad."
          : profileType === 'solo'
          ? language === 'en'
            ? "We'll help you automate tasks and free up your time to focus on what matters."
            : "Te ayudaremos a automatizar tareas y liberar tu tiempo para enfocarte en lo importante."
          : language === 'en'
            ? "We'll help you coordinate your team and delegate tasks effectively."
            : "Te ayudaremos a coordinar tu equipo y delegar tareas de manera efectiva."
        }
      </p>
      
      <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
        {profileType === 'idea' 
          ? <Lightbulb className="w-12 h-12 text-white" />
          : profileType === 'solo'
          ? <User className="w-12 h-12 text-white" />
          : <Users className="w-12 h-12 text-white" />
        }
      </div>
    </div>
  );
};
