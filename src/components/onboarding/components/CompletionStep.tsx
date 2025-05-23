
import React from 'react';
import { CheckCheck } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export const CompletionStep: React.FC = () => {
  const { language } = useLanguage();
  
  return (
    <div className="text-center py-12">
      <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 text-green-700 flex items-center justify-center">
        <CheckCheck className="w-10 h-10" />
      </div>
      
      <h3 className="text-xl font-bold mb-2">
        {language === 'en' ? "Your workspace is ready!" : "¡Tu espacio de trabajo está listo!"}
      </h3>
      
      <p className="text-gray-600 mb-6">
        {language === 'en' 
          ? "We've set up your dashboard with the recommended tools based on your project status."
          : "Hemos configurado tu panel con las herramientas recomendadas según el estado de tu proyecto."}
      </p>
    </div>
  );
};
