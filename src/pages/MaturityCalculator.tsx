
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { SimpleCulturalMaturityCalculator } from '@/components/cultural/SimpleCulturalMaturityCalculator';
import { ProfileTypeSelector } from '@/components/cultural/components/ProfileTypeSelector';
import { DashboardBackground } from '@/components/dashboard/DashboardBackground';
import { NewDashboardHeader } from '@/components/dashboard/NewDashboardHeader';
import { CategoryScore, ProfileType } from '@/components/maturity/types';
import { useLanguage } from '@/context/LanguageContext';
import { useMaturityScores } from '@/hooks/useMaturityScores';

const MaturityCalculator = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { saveMaturityScores } = useMaturityScores();
  
  // Get profile type from location state or default to null
  const initialProfileType = location.state?.profileType as ProfileType | null;
  const [profileType, setProfileType] = useState<ProfileType | null>(initialProfileType);
  const [showCalculator, setShowCalculator] = useState(!!initialProfileType);

  console.log('MaturityCalculator: Initial state', { initialProfileType, showCalculator });

  useEffect(() => {
    if (initialProfileType) {
      setProfileType(initialProfileType);
      setShowCalculator(true);
    }
  }, [initialProfileType]);

  const translations = {
    en: {
      title: 'Maturity Calculator',
      subtitle: 'Evaluate your cultural project maturity',
      selectProfile: 'Select your profile to start the assessment',
      back: 'Back to Dashboard',
      profileTypeTitle: 'Select Your Profile Type',
      profileTypeSubtitle: 'Choose the option that best describes your current situation',
      idea: {
        title: 'I have an idea',
        description: 'I have a cultural idea but haven\'t started yet'
      },
      solo: {
        title: 'Solo creator',
        description: 'I\'m working on my cultural project independently'
      },
      team: {
        title: 'Team project',
        description: 'I\'m part of a team developing a cultural project'
      }
    },
    es: {
      title: 'Calculadora de Madurez',
      subtitle: 'Evalúa la madurez de tu proyecto cultural',
      selectProfile: 'Selecciona tu perfil para comenzar la evaluación',
      back: 'Volver al Dashboard',
      profileTypeTitle: 'Selecciona tu Tipo de Perfil',
      profileTypeSubtitle: 'Elige la opción que mejor describa tu situación actual',
      idea: {
        title: 'Tengo una idea',
        description: 'Tengo una idea cultural pero aún no he empezado'
      },
      solo: {
        title: 'Creador independiente',
        description: 'Estoy trabajando en mi proyecto cultural de forma independiente'
      },
      team: {
        title: 'Proyecto en equipo',
        description: 'Formo parte de un equipo desarrollando un proyecto cultural'
      }
    }
  };

  const t = translations[language];

  const handleProfileSelect = (selectedProfile: ProfileType) => {
    console.log('Profile selected:', selectedProfile);
    setProfileType(selectedProfile);
    setShowCalculator(true);
  };

  const handleCalculatorComplete = async (scores: CategoryScore) => {
    console.log('Maturity calculator completed with scores:', scores);
    
    try {
      // Update maturity scores in the database
      await saveMaturityScores(scores, {
        profileType: profileType,
        industry: 'musica',
        experience: scores.ideaValidation < 50 ? 'beginner' : 
                   scores.ideaValidation < 80 ? 'intermediate' : 'advanced'
      });
      console.log('Maturity scores updated successfully');
      
      // Navigate back to dashboard with completion flag
      navigate('/dashboard', { 
        state: { 
          maturityCompleted: true,
          scores,
          profileType
        }
      });
    } catch (error) {
      console.error('Error updating maturity scores:', error);
      // Still navigate back but without the completion state
      navigate('/dashboard');
    }
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  const handleBackToProfileSelection = () => {
    setShowCalculator(false);
    setProfileType(null);
  };

  return (
    <DashboardBackground>
      <NewDashboardHeader 
        onMaturityCalculatorClick={handleBackToDashboard}
        onAgentManagerClick={() => {}}
      />
      
      <div className="pt-24 min-h-screen">
        {!showCalculator ? (
          <div className="max-w-4xl mx-auto p-6">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-slate-900 mb-4">
                {t.title}
              </h1>
              <p className="text-lg text-slate-600 mb-8">
                {t.subtitle}
              </p>
              <p className="text-slate-500">
                {t.selectProfile}
              </p>
            </div>
            
            <ProfileTypeSelector
              profileType={profileType}
              onSelect={handleProfileSelect}
              t={t}
            />
          </div>
        ) : profileType ? (
          <SimpleCulturalMaturityCalculator
            profileType={profileType}
            onComplete={handleCalculatorComplete}
            onBack={handleBackToProfileSelection}
          />
        ) : null}
      </div>
    </DashboardBackground>
  );
};

export default MaturityCalculator;
