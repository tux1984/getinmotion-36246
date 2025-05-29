
import React from 'react';
import { UserProfileData } from '../types/wizardTypes';
import { RadioCards } from '../wizard-components/RadioCards';
import { CheckboxCards } from '../wizard-components/CheckboxCards';
import { Separator } from '@/components/ui/separator';
import { StepContainer } from '../wizard-components/StepContainer';
import { DollarSign, Globe, Briefcase, Users, Wallet } from 'lucide-react';

interface DetailedAnalysisStepProps {
  profileData: UserProfileData;
  updateProfileData: (data: Partial<UserProfileData>) => void;
  language: 'en' | 'es';
}

export const DetailedAnalysisStep: React.FC<DetailedAnalysisStepProps> = ({ 
  profileData, 
  updateProfileData, 
  language 
}) => {
  const t = {
    en: {
      title: "Detailed Analysis",
      subtitle: "A few more questions to provide personalized recommendations",
      pricingQuestion: "Do you define your prices yourself or with help?",
      internationalQuestion: "Do you have experience selling outside your country?",
      formalizedQuestion: "Have you legally formalized your business?",
      collaborationQuestion: "What types of collaboration do you engage in? (Select all that apply)",
      sustainabilityQuestion: "Does your project sustain you economically?",
      pricing: {
        myself: "I define them myself",
        help: "With help from others",
        market: "Based on the market"
      },
      international: {
        yes: "Yes",
        planning: "Planning to",
        no: "No"
      },
      formalized: {
        yes: "Yes",
        inProcess: "In process",
        no: "No"
      },
      collaboration: {
        other_creators: "With other creators/artists",
        businesses: "With businesses/brands",
        institutions: "With cultural institutions",
        online_communities: "In online communities",
        mentorship: "Mentoring or being mentored",
        none: "I don't collaborate"
      },
      sustainability: {
        yes: "Yes, completely",
        partially: "Partially",
        no: "No"
      }
    },
    es: {
      title: "Análisis Detallado",
      subtitle: "Algunas preguntas más para brindarte recomendaciones personalizadas",
      pricingQuestion: "¿Definís precios por tu cuenta o con ayuda?",
      internationalQuestion: "¿Tenés experiencia vendiendo fuera del país?",
      formalizedQuestion: "¿Formalizaste tu negocio legalmente?",
      collaborationQuestion: "¿En qué tipos de colaboración participás? (Seleccioná todas las que correspondan)",
      sustainabilityQuestion: "¿Tu proyecto te sostiene económicamente?",
      pricing: {
        myself: "Los defino yo mismo/a",
        help: "Con ayuda de otros",
        market: "Basado en el mercado"
      },
      international: {
        yes: "Sí",
        planning: "Planeo hacerlo",
        no: "No"
      },
      formalized: {
        yes: "Sí",
        inProcess: "En proceso",
        no: "No"
      },
      collaboration: {
        other_creators: "Con otros creadores/artistas",
        businesses: "Con empresas/marcas",
        institutions: "Con instituciones culturales",
        online_communities: "En comunidades online",
        mentorship: "Mentoreo o soy mentorado/a",
        none: "No colaboro"
      },
      sustainability: {
        yes: "Sí, completamente",
        partially: "Parcialmente",
        no: "No"
      }
    }
  };
  
  const pricingOptions = [
    { id: 'myself', label: t[language].pricing.myself, icon: <DollarSign className="w-6 h-6 text-emerald-500" /> },
    { id: 'help', label: t[language].pricing.help, icon: <DollarSign className="w-6 h-6 text-amber-500" /> },
    { id: 'market', label: t[language].pricing.market, icon: <DollarSign className="w-6 h-6 text-blue-500" /> }
  ];
  
  const internationalOptions = [
    { id: 'yes', label: t[language].international.yes, icon: <Globe className="w-6 h-6 text-emerald-500" /> },
    { id: 'planning', label: t[language].international.planning, icon: <Globe className="w-6 h-6 text-amber-500" /> },
    { id: 'no', label: t[language].international.no, icon: <Globe className="w-6 h-6 text-red-500" /> }
  ];
  
  const formalizedOptions = [
    { id: 'yes', label: t[language].formalized.yes, icon: <Briefcase className="w-6 h-6 text-emerald-500" /> },
    { id: 'inProcess', label: t[language].formalized.inProcess, icon: <Briefcase className="w-6 h-6 text-amber-500" /> },
    { id: 'no', label: t[language].formalized.no, icon: <Briefcase className="w-6 h-6 text-red-500" /> }
  ];
  
  const collaborationOptions = [
    { id: 'other_creators', label: t[language].collaboration.other_creators, icon: <Users className="w-6 h-6 text-purple-500" /> },
    { id: 'businesses', label: t[language].collaboration.businesses, icon: <Users className="w-6 h-6 text-blue-500" /> },
    { id: 'institutions', label: t[language].collaboration.institutions, icon: <Users className="w-6 h-6 text-indigo-500" /> },
    { id: 'online_communities', label: t[language].collaboration.online_communities, icon: <Users className="w-6 h-6 text-green-500" /> },
    { id: 'mentorship', label: t[language].collaboration.mentorship, icon: <Users className="w-6 h-6 text-amber-500" /> },
    { id: 'none', label: t[language].collaboration.none, icon: <Users className="w-6 h-6 text-gray-400" /> }
  ];
  
  const sustainabilityOptions = [
    { id: 'yes', label: t[language].sustainability.yes, icon: <Wallet className="w-6 h-6 text-emerald-500" /> },
    { id: 'partially', label: t[language].sustainability.partially, icon: <Wallet className="w-6 h-6 text-amber-500" /> },
    { id: 'no', label: t[language].sustainability.no, icon: <Wallet className="w-6 h-6 text-red-500" /> }
  ];

  const handleCollaborationChange = (value: string, isChecked: boolean) => {
    const currentCollabs = Array.isArray(profileData.collaboration) 
      ? profileData.collaboration 
      : profileData.collaboration ? [profileData.collaboration] : [];
    
    if (isChecked && !currentCollabs.includes(value)) {
      updateProfileData({ collaboration: [...currentCollabs, value] });
    } else if (!isChecked && currentCollabs.includes(value)) {
      updateProfileData({ collaboration: currentCollabs.filter(collab => collab !== value) });
    }
  };
  
  return (
    <StepContainer
      title={t[language].title}
      subtitle={t[language].subtitle}
    >
      <div className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">{t[language].pricingQuestion}</h3>
          <RadioCards
            name="pricing"
            options={pricingOptions}
            selectedValue={profileData.pricingMethod}
            onChange={(value) => updateProfileData({ pricingMethod: value })}
            withIcons
            compact
          />
        </div>
        
        <Separator />
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium">{t[language].internationalQuestion}</h3>
          <RadioCards
            name="international"
            options={internationalOptions}
            selectedValue={profileData.internationalSales}
            onChange={(value) => updateProfileData({ internationalSales: value })}
            withIcons
            compact
          />
        </div>
        
        <Separator />
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium">{t[language].formalizedQuestion}</h3>
          <RadioCards
            name="formalized"
            options={formalizedOptions}
            selectedValue={profileData.formalizedBusiness}
            onChange={(value) => updateProfileData({ formalizedBusiness: value })}
            withIcons
            compact
          />
        </div>
        
        <Separator />
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium">{t[language].collaborationQuestion}</h3>
          <CheckboxCards
            options={collaborationOptions}
            selectedValues={Array.isArray(profileData.collaboration) 
              ? profileData.collaboration 
              : profileData.collaboration ? [profileData.collaboration] : []}
            onChange={handleCollaborationChange}
            withIcons
          />
        </div>
        
        <Separator />
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium">{t[language].sustainabilityQuestion}</h3>
          <RadioCards
            name="sustainability"
            options={sustainabilityOptions}
            selectedValue={profileData.economicSustainability}
            onChange={(value) => updateProfileData({ economicSustainability: value })}
            withIcons
            compact
          />
        </div>
      </div>
    </StepContainer>
  );
};
