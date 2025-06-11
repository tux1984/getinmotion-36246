
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { useOptimizedAgentManagement } from '@/hooks/useOptimizedAgentManagement';
import { NewDashboardHeader } from '@/components/dashboard/NewDashboardHeader';
import { DashboardBackground } from '@/components/dashboard/DashboardBackground';
import { DashboardLoadingState } from '@/components/dashboard/DashboardLoadingState';
import { DashboardErrorState } from '@/components/dashboard/DashboardErrorState';
import { ModernDashboardMain } from '@/components/dashboard/ModernDashboardMain';
import { DataSyncStatus } from '@/components/dashboard/DataSyncStatus';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

const DashboardHome = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [redirectAttempts, setRedirectAttempts] = useState(0);
  const [showEscapeHatch, setShowEscapeHatch] = useState(false);
  
  console.log('DashboardHome: Component rendering');
  
  const {
    agents,
    maturityScores,
    recommendedAgents,
    isLoading,
    error,
    hasOnboarding
  } = useOptimizedAgentManagement();

  console.log('DashboardHome: State values:', {
    isLoading,
    error,
    agentsCount: agents.length,
    hasMaturityScores: !!maturityScores,
    hasOnboarding,
    redirectAttempts
  });

  // ARREGLO CRÍTICO: Mejor lógica de redirección con escape hatch
  useEffect(() => {
    if (isLoading) return;

    // Si ya hicimos muchos intentos de redirect, mostrar escape hatch
    if (redirectAttempts >= 2) {
      console.log('DashboardHome: Too many redirect attempts, showing escape hatch');
      setShowEscapeHatch(true);
      return;
    }

    // Solo redirigir si realmente no tiene onboarding
    if (!hasOnboarding && !maturityScores) {
      console.log('DashboardHome: User needs onboarding, redirecting to maturity calculator');
      setRedirectAttempts(prev => prev + 1);
      
      // Añadir delay para evitar bucle inmediato
      setTimeout(() => {
        navigate('/maturity-calculator', { replace: true });
      }, 100);
    }
  }, [isLoading, hasOnboarding, maturityScores, navigate, redirectAttempts]);
  
  const handleNavigateToMaturityCalculator = () => {
    console.log('DashboardHome: Navigating to maturity calculator');
    navigate('/maturity-calculator');
  };

  const handleSelectAgent = (agentId: string) => {
    console.log('DashboardHome: Navigating to agent details:', agentId);
    navigate(`/dashboard/agent/${agentId}`);
  };

  const handleOpenAgentManager = () => {
    console.log('DashboardHome: Navigating to agent manager');
    navigate('/dashboard/agents');
  };

  // NUEVO: Escape hatch para usuarios atascados
  const handleForceAccess = () => {
    console.log('DashboardHome: Force access - setting default onboarding data');
    
    // Crear datos mínimos para permitir acceso
    const defaultScores = {
      ideaValidation: 20,
      userExperience: 15,
      marketFit: 10,
      monetization: 5
    };
    
    const defaultRecommendations = {
      cultural: true,
      admin: false,
      accounting: false,
      legal: false,
      operations: false
    };

    localStorage.setItem('maturityScores', JSON.stringify(defaultScores));
    localStorage.setItem('recommendedAgents', JSON.stringify(defaultRecommendations));
    localStorage.setItem('onboardingCompleted', 'true');
    
    // Recargar la página para aplicar cambios
    window.location.reload();
  };

  // Mostrar escape hatch si el usuario está atascado
  if (showEscapeHatch) {
    return (
      <DashboardBackground>
        <NewDashboardHeader 
          onMaturityCalculatorClick={handleNavigateToMaturityCalculator}
          onAgentManagerClick={handleOpenAgentManager}
        />
        <div className="pt-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6 text-center">
              <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {language === 'en' ? 'Access Issue Detected' : 'Problema de Acceso Detectado'}
              </h2>
              <p className="text-gray-600 mb-6">
                {language === 'en' 
                  ? 'We detected you might be stuck in a redirect loop. You can force access to the dashboard or try the assessment again.'
                  : 'Detectamos que podrías estar atascado en un bucle de redirección. Puedes forzar el acceso al dashboard o intentar la evaluación de nuevo.'
                }
              </p>
              <div className="space-y-3">
                <Button onClick={handleForceAccess} className="w-full">
                  {language === 'en' ? 'Force Access to Dashboard' : 'Forzar Acceso al Dashboard'}
                </Button>
                <Button 
                  onClick={handleNavigateToMaturityCalculator} 
                  variant="outline" 
                  className="w-full"
                >
                  {language === 'en' ? 'Try Assessment Again' : 'Intentar Evaluación de Nuevo'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DashboardBackground>
    );
  }

  // Show loading state
  if (isLoading) {
    console.log('DashboardHome: Showing loading state');
    return (
      <DashboardBackground>
        <NewDashboardHeader 
          onMaturityCalculatorClick={handleNavigateToMaturityCalculator}
          onAgentManagerClick={handleOpenAgentManager}
        />
        <div className="pt-24">
          <DashboardLoadingState />
        </div>
      </DashboardBackground>
    );
  }

  // Show error state
  if (error) {
    console.log('DashboardHome: Showing error state:', error);
    return (
      <DashboardBackground>
        <NewDashboardHeader 
          onMaturityCalculatorClick={handleNavigateToMaturityCalculator}
          onAgentManagerClick={handleOpenAgentManager}
        />
        <div className="pt-24">
          <DashboardErrorState error={error} />
        </div>
      </DashboardBackground>
    );
  }

  console.log('DashboardHome: Showing main dashboard');
  return (
    <DashboardBackground>
      <NewDashboardHeader 
        onMaturityCalculatorClick={handleNavigateToMaturityCalculator}
        onAgentManagerClick={handleOpenAgentManager}
      />
      
      <div className="pt-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Componente de sincronización de datos */}
          <DataSyncStatus />
          
          <ModernDashboardMain 
            onSelectAgent={handleSelectAgent}
            onMaturityCalculatorClick={handleNavigateToMaturityCalculator}
            onAgentManagerClick={handleOpenAgentManager}
            agents={agents}
            maturityScores={maturityScores}
            recommendedAgents={recommendedAgents}
          />
        </div>
      </div>
    </DashboardBackground>
  );
};

export default DashboardHome;
