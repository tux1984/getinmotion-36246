
import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Language } from './types';

interface CompletionScreenProps {
  language: Language;
}

export const CompletionScreen: React.FC<CompletionScreenProps> = ({ language }) => {
  return (
    <div className="text-center p-8">
      <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
      <h3 className="text-2xl font-bold text-gray-900 mb-2">
        {language === 'en' ? 'Assessment Completed!' : '¡Evaluación Completada!'}
      </h3>
      <p className="text-gray-600">
        {language === 'en' 
          ? 'Your results are being analyzed...' 
          : 'Tus resultados están siendo analizados...'}
      </p>
    </div>
  );
};
