
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
import { AlertTriangle, RefreshCw } from 'lucide-react';

const DashboardHome = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [redirectAttempts, setRedirectAttempts] = useState(0);
  const [showEscapeHatch, setShowEscapeHatch] = useState(false);
  const [loadingStage, setLoadingStage] = useState('Iniciando...');
  
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

  // ARREGLO: Añadir timeout para evitar carga infinita
  useEffect(() => {
    if (isLoading) {
      setLoadingStage('Cargando datos del usuario...');
      
      // Timeout de seguridad para evitar carga infinita
      const timeout = setTimeout(() => {
        console.log('DashboardHome: Loading timeout reached, showing escape hatch');
        setShowEscapeHatch(true);
        setLoadingStage('Tiempo de carga agotado');
      }, 20000); // 20 segundos

      return () => clearTimeout(timeout);
    }
  }, [isLoading]);

  // ARREGLO: Mejor lógica de redirección con escape hatch
  useEffect(() => {
    if (isLoading) return;

    setLoadingStage('Verificando onboarding...');

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

  const handleForceRefresh = () => {
    console.log('DashboardHome: Force refresh');
    window.location.reload();
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

  // ARREGLO: Mostrar indicador específico de qué está cargando
  if (isLoading && !showEscapeHatch) {
    return (
      <DashboardBackground>
        <NewDashboardHeader 
          onMaturityCalculatorClick={handleNavigateToMaturityCalculator}
          onAgentManagerClick={handleOpenAgentManager}
        />
        <div className="pt-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-purple-600" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">{loadingStage}</h3>
                <p className="text-sm text-gray-600 mb-6">
                  Esto puede tomar unos momentos...
                </p>
                <Button 
                  onClick={handleForceRefresh} 
                  variant="outline" 
                  size="sm"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Actualizar Página
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DashboardBackground>
    );
  }

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
                {language === 'en' ? 'Loading Issue Detected' : 'Problema de Carga Detectado'}
              </h2>
              <p className="text-gray-600 mb-6">
                {language === 'en' 
                  ? 'The dashboard is taking too long to load. You can try refreshing or force access.'
                  : 'El dashboard está tardando demasiado en cargar. Puedes intentar actualizar o forzar el acceso.'
                }
              </p>
              <div className="space-y-3">
                <Button onClick={handleForceRefresh} variant="outline" className="w-full">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  {language === 'en' ? 'Refresh Page' : 'Actualizar Página'}
                </Button>
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
