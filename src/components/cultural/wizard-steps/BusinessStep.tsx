
import React from 'react';
import { UserProfileData } from '../CulturalMaturityWizard';
import { RadioCards } from '../wizard-components/RadioCards';
import { Separator } from '@/components/ui/separator';
import { StepContainer } from '../wizard-components/StepContainer';
import { CreditCard, BadgeCheck, Calculator } from 'lucide-react';

interface BusinessStepProps {
  profileData: UserProfileData;
  updateProfileData: (data: Partial<UserProfileData>) => void;
  language: 'en' | 'es';
}

export const BusinessStep: React.FC<BusinessStepProps> = ({ 
  profileData, 
  updateProfileData, 
  language 
}) => {
  const t = {
    en: {
      title: "Business Maturity",
      subtitle: "Let's understand how your creative business operates",
      paymentQuestion: "How do you get paid for your work?",
      brandQuestion: "Do you have a defined brand or visual identity?",
      financialQuestion: "Do you have control over your income and expenses?",
      payment: {
        cash_or_transfer: "Cash or bank transfers only",
        digital_platforms: "Digital platforms",
        billing_system: "I have a billing system",
        managed_by_others: "Others manage payments for me (manager or platform)"
      },
      brand: {
        yes: "Yes, completely",
        somewhat: "I have something",
        no: "No, I use whatever works"
      },
      financial: {
        detailed: "Yes, detailed",
        somewhat: "More or less",
        intuition: "I go by intuition"
      }
    },
    es: {
      title: "Madurez del Negocio",
      subtitle: "Comprendamos cómo opera tu negocio creativo",
      paymentQuestion: "¿Cómo cobrás por tu trabajo?",
      brandQuestion: "¿Tenés una marca o identidad visual definida?",
      financialQuestion: "¿Tenés control de tus ingresos y gastos?",
      payment: {
        cash_or_transfer: "Solo efectivo o transferencias",
        digital_platforms: "Plataformas digitales",
        billing_system: "Tengo sistema de facturación",
        managed_by_others: "Cobran otros por mí (manager o plataforma)"
      },
      brand: {
        yes: "Sí, totalmente",
        somewhat: "Algo tengo",
        no: "No, uso lo que sale"
      },
      financial: {
        detailed: "Sí, detallado",
        somewhat: "Más o menos",
        intuition: "Me guío por intuición"
      }
    }
  };
  
  const paymentOptions = [
    { 
      id: 'cash_or_transfer', 
      label: t[language].payment.cash_or_transfer,
      icon: <CreditCard className="w-6 h-6 text-blue-500" />
    },
    { 
      id: 'digital_platforms', 
      label: t[language].payment.digital_platforms,
      icon: <CreditCard className="w-6 h-6 text-indigo-500" />
    },
    { 
      id: 'billing_system', 
      label: t[language].payment.billing_system,
      icon: <CreditCard className="w-6 h-6 text-purple-500" />
    },
    { 
      id: 'managed_by_others', 
      label: t[language].payment.managed_by_others,
      icon: <CreditCard className="w-6 h-6 text-violet-500" />
    }
  ];
  
  const brandOptions = [
    { 
      id: 'yes', 
      label: t[language].brand.yes,
      icon: <BadgeCheck className="w-6 h-6 text-emerald-500" />
    },
    { 
      id: 'somewhat', 
      label: t[language].brand.somewhat,
      icon: <BadgeCheck className="w-6 h-6 text-amber-500" />
    },
    { 
      id: 'no', 
      label: t[language].brand.no,
      icon: <BadgeCheck className="w-6 h-6 text-gray-400" />
    }
  ];
  
  const financialOptions = [
    { 
      id: 'detailed', 
      label: t[language].financial.detailed,
      icon: <Calculator className="w-6 h-6 text-emerald-500" />
    },
    { 
      id: 'somewhat', 
      label: t[language].financial.somewhat,
      icon: <Calculator className="w-6 h-6 text-amber-500" />
    },
    { 
      id: 'intuition', 
      label: t[language].financial.intuition,
      icon: <Calculator className="w-6 h-6 text-gray-400" />
    }
  ];
  
  return (
    <StepContainer
      title={t[language].title}
      subtitle={t[language].subtitle}
    >
      <div className="space-y-8">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">{t[language].paymentQuestion}</h3>
          <RadioCards
            name="payment"
            options={paymentOptions}
            selectedValue={profileData.paymentMethods}
            onChange={(value) => updateProfileData({ paymentMethods: value })}
            withIcons
          />
        </div>
        
        <Separator className="my-6" />
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium">{t[language].brandQuestion}</h3>
          <RadioCards
            name="brand"
            options={brandOptions}
            selectedValue={profileData.brandIdentity}
            onChange={(value) => updateProfileData({ brandIdentity: value })}
            withIcons
          />
        </div>
        
        <Separator className="my-6" />
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium">{t[language].financialQuestion}</h3>
          <RadioCards
            name="financial"
            options={financialOptions}
            selectedValue={profileData.financialControl}
            onChange={(value) => updateProfileData({ financialControl: value })}
            withIcons
          />
        </div>
      </div>
    </StepContainer>
  );
};
