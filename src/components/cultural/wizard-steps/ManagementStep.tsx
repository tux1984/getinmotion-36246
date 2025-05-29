
import React from 'react';
import { UserProfileData } from '../types/wizardTypes';
import { RadioCards } from '../wizard-components/RadioCards';
import { CheckboxCards } from '../wizard-components/CheckboxCards';
import { Separator } from '@/components/ui/separator';
import { StepContainer } from '../wizard-components/StepContainer';
import { Users, Clipboard, Brain } from 'lucide-react';

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
      subtitle: "Let's understand how you organize and make decisions",
      teamQuestion: "How do you structure your team or work?",
      taskQuestion: "How do you organize your tasks and projects? (Select all that apply)",
      decisionQuestion: "How do you make important decisions?",
      team: {
        solo: "I work alone",
        small_team: "Small team (2-5 people)",
        large_team: "Large team (6+ people)",
        network: "Network of collaborators"
      },
      task: {
        intuitive: "Intuitively, as things come up",
        lists: "To-do lists and notes",
        digital_tools: "Digital project management tools",
        formal_processes: "Formal processes and methodologies"
      },
      decision: {
        intuition: "Based on intuition",
        research: "After research and analysis",
        consultation: "Consulting with others",
        data: "Based on data and metrics"
      }
    },
    es: {
      title: "Estilo de Gestión",
      subtitle: "Comprendamos cómo te organizás y tomás decisiones",
      teamQuestion: "¿Cómo estructurás tu equipo o trabajo?",
      taskQuestion: "¿Cómo organizás tus tareas y proyectos? (Seleccioná todas las que correspondan)",
      decisionQuestion: "¿Cómo tomás decisiones importantes?",
      team: {
        solo: "Trabajo solo/a",
        small_team: "Equipo pequeño (2-5 personas)",
        large_team: "Equipo grande (6+ personas)",
        network: "Red de colaboradores"
      },
      task: {
        intuitive: "Intuitivamente, según van surgiendo",
        lists: "Listas de tareas y notas",
        digital_tools: "Herramientas digitales de gestión",
        formal_processes: "Procesos formales y metodologías"
      },
      decision: {
        intuition: "Basado en intuición",
        research: "Después de investigar y analizar",
        consultation: "Consultando con otros",
        data: "Basado en datos y métricas"
      }
    }
  };
  
  const teamOptions = [
    { 
      id: 'solo', 
      label: t[language].team.solo,
      icon: <Users className="w-6 h-6 text-blue-500" />
    },
    { 
      id: 'small_team', 
      label: t[language].team.small_team,
      icon: <Users className="w-6 h-6 text-green-500" />
    },
    { 
      id: 'large_team', 
      label: t[language].team.large_team,
      icon: <Users className="w-6 h-6 text-purple-500" />
    },
    { 
      id: 'network', 
      label: t[language].team.network,
      icon: <Users className="w-6 h-6 text-orange-500" />
    }
  ];
  
  const taskOptions = [
    { 
      id: 'intuitive', 
      label: t[language].task.intuitive,
      icon: <Clipboard className="w-6 h-6 text-gray-500" />
    },
    { 
      id: 'lists', 
      label: t[language].task.lists,
      icon: <Clipboard className="w-6 h-6 text-blue-500" />
    },
    { 
      id: 'digital_tools', 
      label: t[language].task.digital_tools,
      icon: <Clipboard className="w-6 h-6 text-green-500" />
    },
    { 
      id: 'formal_processes', 
      label: t[language].task.formal_processes,
      icon: <Clipboard className="w-6 h-6 text-purple-500" />
    }
  ];
  
  const decisionOptions = [
    { 
      id: 'intuition', 
      label: t[language].decision.intuition,
      icon: <Brain className="w-6 h-6 text-yellow-500" />
    },
    { 
      id: 'research', 
      label: t[language].decision.research,
      icon: <Brain className="w-6 h-6 text-blue-500" />
    },
    { 
      id: 'consultation', 
      label: t[language].decision.consultation,
      icon: <Brain className="w-6 h-6 text-green-500" />
    },
    { 
      id: 'data', 
      label: t[language].decision.data,
      icon: <Brain className="w-6 h-6 text-purple-500" />
    }
  ];

  const handleTaskChange = (value: string, isChecked: boolean) => {
    const currentTasks = Array.isArray(profileData.taskOrganization) 
      ? profileData.taskOrganization 
      : profileData.taskOrganization ? [profileData.taskOrganization] : [];
    
    if (isChecked && !currentTasks.includes(value)) {
      updateProfileData({ taskOrganization: [...currentTasks, value] });
    } else if (!isChecked && currentTasks.includes(value)) {
      updateProfileData({ taskOrganization: currentTasks.filter(task => task !== value) });
    }
  };
  
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
          <h3 className="text-lg font-medium">{t[language].taskQuestion}</h3>
          <CheckboxCards
            options={taskOptions}
            selectedValues={Array.isArray(profileData.taskOrganization) 
              ? profileData.taskOrganization 
              : profileData.taskOrganization ? [profileData.taskOrganization] : []}
            onChange={handleTaskChange}
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
