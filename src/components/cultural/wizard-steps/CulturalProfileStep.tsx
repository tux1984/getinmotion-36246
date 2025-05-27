
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Palette, Music, Scissors, Drama, Heart, Calendar, ArrowRight } from 'lucide-react';
import { UserProfileData } from '../types/wizardTypes';
import { RadioCards } from '../wizard-components/RadioCards';
import { CheckboxCards } from '../wizard-components/CheckboxCards';

interface CulturalProfileStepProps {
  profileData: UserProfileData;
  updateProfileData: (data: Partial<UserProfileData>) => void;
  language: 'en' | 'es';
  onNext: () => void;
  currentStepNumber: number;
  totalSteps: number;
  isStepValid: boolean;
}

export const CulturalProfileStep: React.FC<CulturalProfileStepProps> = ({
  profileData,
  updateProfileData,
  language,
  onNext,
  currentStepNumber,
  totalSteps,
  isStepValid
}) => {
  const translations = {
    en: {
      title: "Cultural Profile",
      subtitle: "Tell us about your creative field and activities",
      industryQuestion: "What's your main creative industry or field?",
      activitiesQuestion: "What activities do you do as part of your work?",
      experienceQuestion: "How long have you been working in this field?",
      industries: {
        music: "Music",
        visualArts: "Visual or Fine Arts", 
        crafts: "Traditional or Modern Crafts",
        theater: "Theater / Dance / Performance",
        personalCare: "Personal or Home Care Products",
        events: "Cultural Events or Production",
        other: "Other"
      },
      activities: {
        physicalProducts: "Produce and sell physical objects",
        classes: "Give classes or workshops", 
        services: "Offer in-person services",
        shows: "Live performances or shows",
        digitalSales: "Manage sales through social media or platforms",
        export: "Export or sell to other countries",
        other: "Other"
      },
      experience: {
        less6months: "Less than 6 months",
        between6months2years: "Between 6 months and 2 years",
        more2years: "More than 2 years"
      },
      continue: "Continue"
    },
    es: {
      title: "Perfil Cultural",
      subtitle: "Contanos sobre tu campo creativo y actividades",
      industryQuestion: "¿Cuál es tu industria o campo creativo principal?",
      activitiesQuestion: "¿Qué tipo de actividades hacés como parte de tu trabajo?",
      experienceQuestion: "¿Hace cuánto tiempo trabajás en esto?",
      industries: {
        music: "Música",
        visualArts: "Artes visuales o plásticas",
        crafts: "Artesanía tradicional o moderna", 
        theater: "Teatro / danza / performance",
        personalCare: "Productos para el cuidado personal o del hogar",
        events: "Producción de eventos culturales",
        other: "Otro"
      },
      activities: {
        physicalProducts: "Produzco y vendo objetos físicos",
        classes: "Doy clases o talleres",
        services: "Ofrezco servicios presenciales", 
        shows: "Vivo de funciones o shows en vivo",
        digitalSales: "Manejo ventas por redes sociales o plataformas",
        export: "Exporto o vendo a otros países",
        other: "Otro"
      },
      experience: {
        less6months: "Menos de 6 meses",
        between6months2years: "Entre 6 meses y 2 años", 
        more2years: "Más de 2 años"
      },
      continue: "Continuar"
    }
  };

  const t = translations[language];

  const industryOptions = [
    { id: 'music', label: t.industries.music, icon: <Music className="h-5 w-5" /> },
    { id: 'visualArts', label: t.industries.visualArts, icon: <Palette className="h-5 w-5" /> },
    { id: 'crafts', label: t.industries.crafts, icon: <Scissors className="h-5 w-5" /> },
    { id: 'theater', label: t.industries.theater, icon: <Drama className="h-5 w-5" /> },
    { id: 'personalCare', label: t.industries.personalCare, icon: <Heart className="h-5 w-5" /> },
    { id: 'events', label: t.industries.events, icon: <Calendar className="h-5 w-5" /> },
    { id: 'other', label: t.industries.other }
  ];

  const activitiesOptions = [
    { id: 'physicalProducts', label: t.activities.physicalProducts },
    { id: 'classes', label: t.activities.classes },
    { id: 'services', label: t.activities.services },
    { id: 'shows', label: t.activities.shows },
    { id: 'digitalSales', label: t.activities.digitalSales },
    { id: 'export', label: t.activities.export },
    { id: 'other', label: t.activities.other }
  ];

  const experienceOptions = [
    { id: 'less6months', label: t.experience.less6months },
    { id: 'between6months2years', label: t.experience.between6months2years },
    { id: 'more2years', label: t.experience.more2years }
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
        {/* Industry Question */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <h3 className="text-xl font-semibold text-gray-800">{t.industryQuestion}</h3>
          <RadioCards
            name="industry"
            options={industryOptions}
            selectedValue={profileData.industry}
            onChange={(value) => updateProfileData({ industry: value })}
            withIcons
          />
        </motion.div>

        {/* Activities Question */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-6"
        >
          <h3 className="text-xl font-semibold text-gray-800">{t.activitiesQuestion}</h3>
          <CheckboxCards
            options={activitiesOptions}
            selectedValues={profileData.activities || []}
            onChange={(value, isChecked) => {
              const currentActivities = profileData.activities || [];
              const newActivities = isChecked 
                ? [...currentActivities, value]
                : currentActivities.filter(item => item !== value);
              updateProfileData({ activities: newActivities });
            }}
          />
        </motion.div>

        {/* Experience Question */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          <h3 className="text-xl font-semibold text-gray-800">{t.experienceQuestion}</h3>
          <RadioCards
            name="experience"
            options={experienceOptions}
            selectedValue={profileData.experience}
            onChange={(value) => updateProfileData({ experience: value })}
          />
        </motion.div>
      </div>

      {/* Navigation */}
      <div className="flex justify-end mt-12">
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
