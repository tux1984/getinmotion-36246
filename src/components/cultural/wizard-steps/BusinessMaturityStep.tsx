
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { CreditCard, Eye, Calculator, ArrowRight, ArrowLeft } from 'lucide-react';
import { UserProfileData } from '../types/wizardTypes';
import { RadioCards } from '../wizard-components/RadioCards';

interface BusinessMaturityStepProps {
  profileData: UserProfileData;
  updateProfileData: (data: Partial<UserProfileData>) => void;
  language: 'en' | 'es';
  onNext: () => void;
  onPrevious: () => void;
  currentStepNumber: number;
  totalSteps: number;
  isStepValid: boolean;
}

export const BusinessMaturityStep: React.FC<BusinessMaturityStepProps> = ({
  profileData,
  updateProfileData,
  language,
  onNext,
  onPrevious,
  currentStepNumber,
  totalSteps,
  isStepValid
}) => {
  const translations = {
    en: {
      title: "Business Maturity",
      subtitle: "Tell us about the current state and structure of your business",
      paymentQuestion: "How do you currently get paid for your work or products?",
      brandQuestion: "Do you have a defined brand or visual identity?",
      financialQuestion: "Do you have control over your income and expenses?",
      payment: {
        cash: "Cash or bank transfers only",
        digital: "Digital platforms (PayPal, Stripe, etc.)",
        invoicing: "I have an invoicing system",
        others: "Others handle payments for me (manager or platform)"
      },
      brand: {
        complete: "Yes, completely",
        partial: "I have something",
        none: "No, I use whatever works"
      },
      financial: {
        detailed: "Yes, I keep detailed records",
        general: "I have a general idea",
        intuition: "No, I go by intuition"
      },
      back: "Back",
      continue: "Continue"
    },
    es: {
      title: "Madurez del Negocio",
      subtitle: "Contanos sobre el estado actual y estructura de tu negocio",
      paymentQuestion: "¿Cómo cobrás actualmente por tu trabajo o productos?",
      brandQuestion: "¿Tenés una marca o identidad visual definida?",
      financialQuestion: "¿Tenés control de tus ingresos y gastos?",
      payment: {
        cash: "Solo efectivo o transferencias",
        digital: "Plataformas digitales (MercadoPago, Nequi, etc.)",
        invoicing: "Tengo sistema de facturación",
        others: "Cobran otros por mí (manager o plataforma)"
      },
      brand: {
        complete: "Sí, totalmente",
        partial: "Algo tengo",
        none: "No, uso lo que sale"
      },
      financial: {
        detailed: "Sí, lo llevo detallado",
        general: "Lo tengo más o menos claro",
        intuition: "No, me guío por intuición"
      },
      back: "Atrás",
      continue: "Continuar"
    }
  };

  const t = translations[language];

  const paymentOptions = [
    { id: 'cash', label: t.payment.cash, icon: <CreditCard className="h-5 w-5" /> },
    { id: 'digital', label: t.payment.digital, icon: <CreditCard className="h-5 w-5" /> },
    { id: 'invoicing', label: t.payment.invoicing, icon: <CreditCard className="h-5 w-5" /> },
    { id: 'others', label: t.payment.others, icon: <CreditCard className="h-5 w-5" /> }
  ];

  const brandOptions = [
    { id: 'complete', label: t.brand.complete, icon: <Eye className="h-5 w-5" /> },
    { id: 'partial', label: t.brand.partial, icon: <Eye className="h-5 w-5" /> },
    { id: 'none', label: t.brand.none, icon: <Eye className="h-5 w-5" /> }
  ];

  const financialOptions = [
    { id: 'detailed', label: t.financial.detailed, icon: <Calculator className="h-5 w-5" /> },
    { id: 'general', label: t.financial.general, icon: <Calculator className="h-5 w-5" /> },
    { id: 'intuition', label: t.financial.intuition, icon: <Calculator className="h-5 w-5" /> }
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

      <div className="space-y-12">
        {/* Payment Methods Question */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <h3 className="text-xl font-semibold text-gray-800">{t.paymentQuestion}</h3>
          <RadioCards
            name="paymentMethods"
            options={paymentOptions}
            selectedValue={profileData.paymentMethods}
            onChange={(value) => updateProfileData({ paymentMethods: value })}
            withIcons
          />
        </motion.div>

        {/* Brand Identity Question */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-6"
        >
          <h3 className="text-xl font-semibold text-gray-800">{t.brandQuestion}</h3>
          <RadioCards
            name="brandIdentity"
            options={brandOptions}
            selectedValue={profileData.brandIdentity}
            onChange={(value) => updateProfileData({ brandIdentity: value })}
            withIcons
          />
        </motion.div>

        {/* Financial Control Question */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          <h3 className="text-xl font-semibold text-gray-800">{t.financialQuestion}</h3>
          <RadioCards
            name="financialControl"
            options={financialOptions}
            selectedValue={profileData.financialControl}
            onChange={(value) => updateProfileData({ financialControl: value })}
            withIcons
          />
        </motion.div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-12">
        <Button
          variant="outline"
          onClick={onPrevious}
          className="px-6 py-3 flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          {t.back}
        </Button>
        
        <Button
          onClick={onNext}
          disabled={!isStepValid}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 flex items-center gap-2"
        >
          {t.continue}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
