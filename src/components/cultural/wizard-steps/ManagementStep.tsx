
import React from 'react';
import { UserProfileData } from '../CulturalMaturityWizard';
import { RadioCards } from '../wizard-components/RadioCards';
import { Separator } from '@/components/ui/separator';
import { StepContainer } from '../wizard-components/StepContainer';
import { Users, MessageSquare, Smartphone, ListTodo, Check, X } from 'lucide-react';

interface ManagementStepProps {
  profileData: UserProfileData;
  updateProfileData: (data: Partial<UserProfileData>) => void;
  language: 'en' | 'es';
}

export const ManagementStep: React.FC<ManagementStepProps> = ({ 
  profileData, 
  updateProfileData, 
  language 
}) => {
  const t = {
    en: {
      title: "Management Style",
      subtitle: "Let's understand how you manage your creative project",
      teamQuestion: "Do you work alone or with someone else?",
      organizationQuestion: "Where do you organize your tasks or projects?",
      decisionQuestion: "Do you find it easy to make business decisions?",
      team: {
        alone: "Completely alone",
        occasional: "Someone helps me occasionally",
        team: "I have someone permanent or a team"
      },
      organization: {
        paper: "Paper or memory",
        messaging: "WhatsApp",
        digital_tools: "Digital tools (Notion, Trello, Excel)"
      },
      decision: {
        yes: "Yes",
        sometimes: "Sometimes",
        no: "No"
      }
    },
    es: {
      title: "Estilo de Gestión",
      subtitle: "Comprendamos cómo gestionás tu proyecto creativo",
      teamQuestion: "¿Trabajás solo/a o con alguien más?",
      organizationQuestion: "¿Dónde organizás tus tareas o proyectos?",
      decisionQuestion: "¿Te resulta fácil tomar decisiones de negocio?",
      team: {
        alone: "Completamente solo/a",
        occasional: "Me ayuda alguien a veces",
        team: "Tengo alguien fijo o un equipo"
      },
      organization: {
        paper: "Papel o memoria",
        messaging: "WhatsApp",
        digital_tools: "Herramientas digitales (Notion, Trello, Excel)"
      },
      decision: {
        yes: "Sí",
        sometimes: "A veces",
        no: "No"
      }
    }
  };
  
  const teamOptions = [
    { 
      id: 'alone', 
      label: t[language].team.alone,
      icon: <Users className="w-6 h-6 text-blue-500" />
    },
    { 
      id: 'occasional', 
      label: t[language].team.occasional,
      icon: <Users className="w-6 h-6 text-indigo-500" />
    },
    { 
      id: 'team', 
      label: t[language].team.team,
      icon: <Users className="w-6 h-6 text-purple-500" />
    }
  ];
  
  const organizationOptions = [
    { 
      id: 'paper', 
      label: t[language].organization.paper,
      icon: <ListTodo className="w-6 h-6 text-amber-500" />
    },
    { 
      id: 'messaging', 
      label: t[language].organization.messaging,
      icon: <MessageSquare className="w-6 h-6 text-green-500" />
    },
    { 
      id: 'digital_tools', 
      label: t[language].organization.digital_tools,
      icon: <Smartphone className="w-6 h-6 text-indigo-500" />
    }
  ];
  
  const decisionOptions = [
    { 
      id: 'yes', 
      label: t[language].decision.yes,
      icon: <Check className="w-6 h-6 text-emerald-500" />
    },
    { 
      id: 'sometimes', 
      label: t[language].decision.sometimes,
      icon: <Check className="w-6 h-6 text-amber-500" />
    },
    { 
      id: 'no', 
      label: t[language].decision.no,
      icon: <X className="w-6 h-6 text-red-500" />
    }
  ];
  
  return (
    <StepContainer
      title={t[language].title}
      subtitle={t[language].subtitle}
    >
      <div className="space-y-8">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">{t[language].teamQuestion}</h3>
          <RadioCards
            name="team"
            options={teamOptions}
            selectedValue={profileData.teamStructure}
            onChange={(value) => updateProfileData({ teamStructure: value })}
            withIcons
          />
        </div>
        
        <Separator className="my-6" />
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium">{t[language].organizationQuestion}</h3>
          <RadioCards
            name="organization"
            options={organizationOptions}
            selectedValue={profileData.taskOrganization}
            onChange={(value) => updateProfileData({ taskOrganization: value })}
            withIcons
          />
        </div>
        
        <Separator className="my-6" />
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium">{t[language].decisionQuestion}</h3>
          <RadioCards
            name="decision"
            options={decisionOptions}
            selectedValue={profileData.decisionMaking}
            onChange={(value) => updateProfileData({ decisionMaking: value })}
            withIcons
          />
        </div>
      </div>
    </StepContainer>
  );
};
