import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { UserBusinessProfile } from '@/types/profile';
import { useLanguage } from '@/context/LanguageContext';
import { Calculator, User, TrendingUp } from 'lucide-react';

interface PersonalizedWelcomeSectionProps {
  businessProfile: UserBusinessProfile;
  onRecalculateMaturity: () => void;
  onEditProfile: () => void;
  completedTasksCount: number;
  activeTasksCount: number;
}

export const PersonalizedWelcomeSection: React.FC<PersonalizedWelcomeSectionProps> = ({
  businessProfile,
  onRecalculateMaturity,
  onEditProfile,
  completedTasksCount,
  activeTasksCount
}) => {
  const { language } = useLanguage();

  const getBusinessModelLabel = () => {
    const labels = {
      en: {
        artisan: 'Artisan Creator',
        services: 'Service Provider', 
        ecommerce: 'E-commerce Entrepreneur',
        saas: 'SaaS Founder',
        consulting: 'Consultant',
        retail: 'Retail Business',
        content: 'Content Creator',
        other: 'Entrepreneur'
      },
      es: {
        artisan: 'Creador Artesanal',
        services: 'Proveedor de Servicios',
        ecommerce: 'Emprendedor E-commerce', 
        saas: 'Fundador SaaS',
        consulting: 'Consultor',
        retail: 'Negocio Minorista',
        content: 'Creador de Contenido',
        other: 'Emprendedor'
      }
    };
    return labels[language][businessProfile.businessModel];
  };

  const getStageLabel = () => {
    const labels = {
      en: {
        idea: 'Idea Stage',
        mvp: 'MVP Stage',
        early: 'Early Stage',
        growth: 'Growth Stage',
        established: 'Established'
      },
      es: {
        idea: 'Etapa de Idea',
        mvp: 'Etapa MVP',
        early: 'Etapa Temprana',
        growth: 'Etapa de Crecimiento',
        established: 'Establecido'
      }
    };
    return labels[language][businessProfile.businessStage];
  };

  const getPersonalizedGreeting = () => {
    const hour = new Date().getHours();
    let timeGreeting = '';
    
    if (hour < 12) {
      timeGreeting = language === 'es' ? 'Buenos días' : 'Good morning';
    } else if (hour < 18) {
      timeGreeting = language === 'es' ? 'Buenas tardes' : 'Good afternoon';
    } else {
      timeGreeting = language === 'es' ? 'Buenas noches' : 'Good evening';
    }

    const businessSpecificGreeting = {
      artisan: {
        es: 'Vamos a convertir tu arte en un negocio próspero',
        en: 'Let\'s turn your art into a thriving business'
      },
      services: {
        es: 'Tu expertise puede generar grandes resultados',
        en: 'Your expertise can generate great results'
      },
      ecommerce: {
        es: 'Construyamos tu imperio de ventas digitales',
        en: 'Let\'s build your digital sales empire'
      }
    };

    const specificGreeting = businessSpecificGreeting[businessProfile.businessModel as keyof typeof businessSpecificGreeting] || {
      es: 'Llevemos tu emprendimiento al siguiente nivel',
      en: 'Let\'s take your venture to the next level'
    };

    return `${timeGreeting}, ${businessProfile.fullName}! ${specificGreeting[language]} 🚀`;
  };

  const getNextMilestone = () => {
    if (businessProfile.businessStage === 'idea') {
      return language === 'es' ? 'Validar tu idea de negocio' : 'Validate your business idea';
    }
    if (businessProfile.businessStage === 'mvp') {
      return language === 'es' ? 'Conseguir tus primeros clientes' : 'Get your first customers';
    }
    if (businessProfile.businessStage === 'early') {
      return language === 'es' ? 'Escalar tus operaciones' : 'Scale your operations';
    }
    return language === 'es' ? 'Optimizar y crecer' : 'Optimize and grow';
  };

  const t = {
    en: {
      profileType: 'Profile Type',
      currentStage: 'Current Stage',
      nextMilestone: 'Next Milestone',
      maturityLevel: 'Maturity Level',
      recalculateNeeds: 'Recalculate Needs',
      editProfile: 'Edit Profile',
      activeTasks: 'Active Tasks',
      completedTasks: 'Completed Tasks',
      yourProgress: 'Your Progress'
    },
    es: {
      profileType: 'Tipo de Perfil',
      currentStage: 'Etapa Actual',
      nextMilestone: 'Siguiente Hito',
      maturityLevel: 'Nivel de Madurez',
      recalculateNeeds: 'Recalcular Necesidades',
      editProfile: 'Editar Perfil',
      activeTasks: 'Tareas Activas',
      completedTasks: 'Tareas Completadas',
      yourProgress: 'Tu Progreso'
    }
  };

  return (
    <div className="space-y-6">
      {/* Main Welcome Card */}
      <Card className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/5 border-primary/10">
        <CardContent className="p-6 sm:p-8">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between space-y-6 lg:space-y-0">
            {/* Left: Greeting and Profile Info */}
            <div className="flex-1 space-y-4">
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground leading-tight">
                {getPersonalizedGreeting()}
              </h1>
              
              <div className="flex flex-wrap gap-3">
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                  {t[language].profileType}: {getBusinessModelLabel()}
                </Badge>
                <Badge variant="outline" className="bg-secondary/10 text-secondary-foreground border-secondary/20">
                  {t[language].currentStage}: {getStageLabel()}
                </Badge>
                <Badge variant="outline" className="bg-accent/10 text-accent-foreground border-accent/20">
                  {t[language].maturityLevel}: {businessProfile.maturityLevel}/5
                </Badge>
              </div>

              <p className="text-muted-foreground text-lg">
                <span className="font-medium text-foreground">{t[language].nextMilestone}:</span> {getNextMilestone()}
              </p>
            </div>

            {/* Right: Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 lg:flex-col lg:w-auto">
              <Button 
                onClick={onRecalculateMaturity}
                variant="outline"
                className="bg-background/80 backdrop-blur-sm border-primary/20 hover:bg-primary/5"
              >
                <Calculator className="w-4 h-4 mr-2" />
                {t[language].recalculateNeeds}
              </Button>
              <Button 
                onClick={onEditProfile}
                variant="outline"
                className="bg-background/80 backdrop-blur-sm border-secondary/20 hover:bg-secondary/5"
              >
                <User className="w-4 h-4 mr-2" />
                {t[language].editProfile}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progress Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200/50 dark:from-green-950/20 dark:to-emerald-950/20 dark:border-green-800/30">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {completedTasksCount}
            </div>
            <div className="text-sm text-green-700 dark:text-green-300">
              {t[language].completedTasks}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200/50 dark:from-blue-950/20 dark:to-cyan-950/20 dark:border-blue-800/30">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {activeTasksCount}
            </div>
            <div className="text-sm text-blue-700 dark:text-blue-300">
              {t[language].activeTasks}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200/50 dark:from-purple-950/20 dark:to-indigo-950/20 dark:border-purple-800/30">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {Math.round((completedTasksCount / Math.max(completedTasksCount + activeTasksCount, 1)) * 100)}%
            </div>
            <div className="text-sm text-purple-700 dark:text-purple-300">
              {t[language].yourProgress}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};