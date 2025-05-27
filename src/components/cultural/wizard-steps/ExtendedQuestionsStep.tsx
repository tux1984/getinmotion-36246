
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { UserProfileData } from '../types/wizardTypes';
import { RadioCards } from '../wizard-components/RadioCards';

interface ExtendedQuestionsStepProps {
  profileData: UserProfileData;
  updateProfileData: (data: Partial<UserProfileData>) => void;
  language: 'en' | 'es';
  currentStepNumber: number;
  totalSteps: number;
  onNext: () => void;
  onPrevious: () => void;
  isStepValid: boolean;
}

export const ExtendedQuestionsStep: React.FC<ExtendedQuestionsStepProps> = ({
  profileData,
  updateProfileData,
  language,
  currentStepNumber,
  totalSteps,
  onNext,
  onPrevious,
  isStepValid
}) => {
  const translations = {
    en: {
      title: "Extended Analysis Questions",
      subtitle: "These additional questions will help us provide more detailed recommendations",
      pricing: "How do you currently set your prices?",
      international: "Do you sell internationally?",
      formalized: "Is your business formalized?",
      collaboration: "How do you handle collaborations?",
      sustainability: "What's your approach to economic sustainability?",
      previous: "Back",
      next: "Next"
    },
    es: {
      title: "Preguntas de Análisis Profundo",
      subtitle: "Estas preguntas adicionales nos ayudarán a brindarte recomendaciones más detalladas",
      pricing: "¿Cómo establecés actualmente tus precios?",
      international: "¿Vendés internacionalmente?",
      formalized: "¿Tu negocio está formalizado?",
      collaboration: "¿Cómo manejás las colaboraciones?",
      sustainability: "¿Cuál es tu enfoque hacia la sostenibilidad económica?",
      previous: "Atrás",
      next: "Siguiente"
    }
  };

  const t = translations[language];

  const pricingOptions = [
    { id: 'intuitive', label: language === 'en' ? 'Intuitive/by feeling' : 'Intuitivo/por sensación' },
    { id: 'market-research', label: language === 'en' ? 'Market research' : 'Investigación de mercado' },
    { id: 'cost-plus', label: language === 'en' ? 'Cost + margin' : 'Costo + margen' },
    { id: 'value-based', label: language === 'en' ? 'Value-based' : 'Basado en valor' }
  ];

  const yesNoOptions = [
    { id: 'yes', label: language === 'en' ? 'Yes' : 'Sí' },
    { id: 'no', label: language === 'en' ? 'No' : 'No' }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-medium">
            {language === 'en' ? `Step ${currentStepNumber} of ${totalSteps}` : `Paso ${currentStepNumber} de ${totalSteps}`}
          </span>
        </div>
        <h2 className="text-3xl font-bold text-purple-800 mb-4">{t.title}</h2>
        <p className="text-lg text-gray-600">{t.subtitle}</p>
      </div>

      {/* Questions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8 mb-12"
      >
        {/* Pricing Method */}
        <div>
          <h3 className="text-xl font-semibold text-purple-800 mb-4">{t.pricing}</h3>
          <RadioCards
            name="pricingMethod"
            options={pricingOptions}
            selectedValue={profileData.pricingMethod}
            onChange={(value) => updateProfileData({ pricingMethod: value })}
          />
        </div>

        {/* International Sales */}
        <div>
          <h3 className="text-xl font-semibold text-purple-800 mb-4">{t.international}</h3>
          <RadioCards
            name="internationalSales"
            options={yesNoOptions}
            selectedValue={profileData.internationalSales}
            onChange={(value) => updateProfileData({ internationalSales: value })}
          />
        </div>

        {/* Formalized Business */}
        <div>
          <h3 className="text-xl font-semibold text-purple-800 mb-4">{t.formalized}</h3>
          <RadioCards
            name="formalizedBusiness"
            options={yesNoOptions}
            selectedValue={profileData.formalizedBusiness}
            onChange={(value) => updateProfileData({ formalizedBusiness: value })}
          />
        </div>
      </motion.div>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={onPrevious}
          className="px-6 py-3"
        >
          {t.previous}
        </Button>
        
        <Button
          onClick={onNext}
          disabled={!isStepValid}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3"
        >
          {t.next}
        </Button>
      </div>
    </div>
  );
};
