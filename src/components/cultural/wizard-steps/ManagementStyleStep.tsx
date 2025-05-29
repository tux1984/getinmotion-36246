
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Users, FileText, Target, ArrowRight, ArrowLeft } from 'lucide-react';
import { UserProfileData } from '../types/wizardTypes';
import { RadioCards } from '../wizard-components/RadioCards';
import { CheckboxCards } from '../wizard-components/CheckboxCards';

interface ManagementStyleStepProps {
  profileData: UserProfileData;
  updateProfileData: (data: Partial<UserProfileData>) => void;
  language: 'en' | 'es';
  onNext: () => void;
  onPrevious: () => void;
  currentStepNumber: number;
  totalSteps: number;
  isStepValid: boolean;
}

export const ManagementStyleStep: React.FC<ManagementStyleStepProps> = ({
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
      title: "Management Style",
      subtitle: "Tell us about how you organize and manage your work",
      teamQuestion: "Do you work alone or with someone else?",
      organizationQuestion: "How do you organize your tasks or projects? (Select all that apply)",
      decisionQuestion: "Do you find it easy to make business decisions?",
      team: {
        alone: "Completely alone",
        sometimes: "Someone helps me sometimes",
        fixed: "I have someone fixed (partner, collaborator, etc.)"
      },
      organization: {
        paper: "Paper or notebook",
        whatsapp: "WhatsApp and memory",
        digital: "Digital tools (Notion, Trello, Excel)",
        formal: "Formal processes and methodologies"
      },
      decision: {
        easy: "Yes",
        sometimes: "Sometimes",
        difficult: "It's very difficult for me"
      },
      back: "Back",
      continue: "Continue"
    },
    es: {
      title: "Estilo de Gestión",
      subtitle: "Contanos sobre cómo organizás y gestionás tu trabajo",
      teamQuestion: "¿Trabajás solo/a o con alguien más?",
      organizationQuestion: "¿Cómo organizás tus tareas o proyectos? (Seleccioná todas las que correspondan)",
      decisionQuestion: "¿Te resulta fácil tomar decisiones de negocio?",
      team: {
        alone: "Completamente solo/a",
        sometimes: "Me ayuda alguien de vez en cuando",
        fixed: "Tengo alguien fijo (socio, colaborador, pareja, etc.)"
      },
      organization: {
        paper: "En papel o libreta",
        whatsapp: "WhatsApp y memoria",
        digital: "Apps o herramientas (Notion, Trello, Excel)",
        formal: "Procesos formales y metodologías"
      },
      decision: {
        easy: "Sí",
        sometimes: "No tanto",
        difficult: "Me cuesta mucho"
      },
      back: "Atrás",
      continue: "Continuar"
    }
  };

  const t = translations[language];

  const teamOptions = [
    { id: 'alone', label: t.team.alone, icon: <Users className="h-5 w-5" /> },
    { id: 'sometimes', label: t.team.sometimes, icon: <Users className="h-5 w-5" /> },
    { id: 'fixed', label: t.team.fixed, icon: <Users className="h-5 w-5" /> }
  ];

  const organizationOptions = [
    { id: 'paper', label: t.organization.paper, icon: <FileText className="h-5 w-5" /> },
    { id: 'whatsapp', label: t.organization.whatsapp, icon: <FileText className="h-5 w-5" /> },
    { id: 'digital', label: t.organization.digital, icon: <FileText className="h-5 w-5" /> },
    { id: 'formal', label: t.organization.formal, icon: <FileText className="h-5 w-5" /> }
  ];

  const decisionOptions = [
    { id: 'easy', label: t.decision.easy, icon: <Target className="h-5 w-5" /> },
    { id: 'sometimes', label: t.decision.sometimes, icon: <Target className="h-5 w-5" /> },
    { id: 'difficult', label: t.decision.difficult, icon: <Target className="h-5 w-5" /> }
  ];

  const handleTaskOrganizationChange = (value: string, isChecked: boolean) => {
    const currentTasks = Array.isArray(profileData.taskOrganization) 
      ? profileData.taskOrganization 
      : profileData.taskOrganization ? [profileData.taskOrganization] : [];
    
    if (isChecked && !currentTasks.includes(value)) {
      updateProfileData({ taskOrganization: [...currentTasks, value] });
    } else if (!isChecked && currentTasks.includes(value)) {
      updateProfileData({ taskOrganization: currentTasks.filter(task => task !== value) });
    }
  };

  const getSelectedTaskOrganization = (): string[] => {
    if (Array.isArray(profileData.taskOrganization)) {
      return profileData.taskOrganization;
    }
    return profileData.taskOrganization ? [profileData.taskOrganization] : [];
  };

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
        {/* Team Structure Question */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <h3 className="text-xl font-semibold text-gray-800">{t.teamQuestion}</h3>
          <RadioCards
            name="teamStructure"
            options={teamOptions}
            selectedValue={profileData.teamStructure || ''}
            onChange={(value) => updateProfileData({ teamStructure: value })}
            withIcons
          />
        </motion.div>

        {/* Task Organization Question */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-6"
        >
          <h3 className="text-xl font-semibold text-gray-800">{t.organizationQuestion}</h3>
          <CheckboxCards
            options={organizationOptions}
            selectedValues={getSelectedTaskOrganization()}
            onChange={handleTaskOrganizationChange}
            withIcons
          />
        </motion.div>

        {/* Decision Making Question */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          <h3 className="text-xl font-semibold text-gray-800">{t.decisionQuestion}</h3>
          <RadioCards
            name="decisionMaking"
            options={decisionOptions}
            selectedValue={profileData.decisionMaking || ''}
            onChange={(value) => updateProfileData({ decisionMaking: value })}
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
