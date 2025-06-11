
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { useOptimizedAgentManagement } from '@/hooks/useOptimizedAgentManagement';
import { useDataRecovery } from '@/hooks/useDataRecovery';
import { NewDashboardHeader } from '@/components/dashboard/NewDashboardHeader';
import { DashboardBackground } from '@/components/dashboard/DashboardBackground';
import { ModernDashboardMain } from '@/components/dashboard/ModernDashboardMain';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, Wrench, CheckCircle } from 'lucide-react';

const DashboardHome = () => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [forceShow, setForceShow] = useState(false);
  
  const {
    agents,
    maturityScores,
    recommendedAgents,
    isLoading,
    error,
    hasOnboarding
  } = useOptimizedAgentManagement();

  const {
    needsRecovery,
    recovering,
    recovered,
    error: recoveryError,
    performEmergencyRecovery,
    checkAndRepair
  } = useDataRecovery();

  console.log('DashboardHome: Comprehensive state:', {
    isLoading,
    error,
    hasOnboarding,
    needsRecovery,
    recovering,
    recovered,
    agentsCount: agents.length,
    activeAgents: agents.filter(a => a.status === 'active').length,
    maturityScores: !!maturityScores,
    forceShow
  });

  // Lógica mejorada de redirección
  useEffect(() => {
    if (isLoading || recovering) return;

    // Si no hay onboarding Y no hay maturity scores Y no se está recuperando
    const shouldRedirect = !hasOnboarding && 
                          !maturityScores && 
                          !needsRecovery && 
                          !recovered && 
                          !forceShow;

    if (shouldRedirect) {
      console.log('User needs onboarding, redirecting to maturity calculator');
      navigate('/maturity-calculator', { replace: true });
    }
  }, [isLoading, recovering, hasOnboarding, maturityScores, needsRecovery, recovered, forceShow, navigate]);

  const handleNavigateToMaturityCalculator = () => {
    navigate('/maturity-calculator');
  };

  const handleSelectAgent = (agentId: string) => {
    navigate(`/dashboard/agent/${agentId}`);
  };

  const handleOpenAgentManager = () => {
    navigate('/dashboard/agents');
  };

  const handleForceAccess = () => {
    setForceShow(true);
  };

  const handleEmergencyRepair = async () => {
    const success = await performEmergencyRecovery();
    if (success) {
      window.location.reload();
    }
  };

  const handleManualRepair = async () => {
    await checkAndRepair();
    window.location.reload();
  };

  // Mostrar pantalla de carga mejorada
  if (isLoading && !forceShow) {
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
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {language === 'en' ? 'Loading your workspace...' : 'Cargando tu espacio de trabajo...'}
                </h3>
                <p className="text-sm text-gray-600 mb-6">
                  {language === 'en' 
                    ? 'Setting up your personalized dashboard...'
                    : 'Configurando tu dashboard personalizado...'
                  }
                </p>
                <Button onClick={handleForceAccess} variant="outline" size="sm">
                  {language === 'en' ? 'Force Access' : 'Acceder Directamente'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DashboardBackground>
    );
  }

  // Mostrar pantalla de recuperación si está recuperando
  if (recovering) {
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
                <Wrench className="w-12 h-12 animate-pulse mx-auto mb-4 text-blue-600" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {language === 'en' ? 'Repairing Your Data...' : 'Reparando tus Datos...'}
                </h3>
                <p className="text-gray-600">
                  {language === 'en' 
                    ? 'We are automatically fixing any data inconsistencies. This will only take a moment.'
                    : 'Estamos reparando automáticamente cualquier inconsistencia en los datos. Esto solo tomará un momento.'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </DashboardBackground>
    );
  }

  // Mostrar mensaje de recuperación exitosa
  if (recovered && !forceShow) {
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
                <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-600" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {language === 'en' ? 'Data Recovery Complete!' : '¡Recuperación de Datos Completa!'}
                </h3>
                <p className="text-gray-600 mb-6">
                  {language === 'en' 
                    ? 'Your workspace has been automatically repaired and is ready to use.'
                    : 'Tu espacio de trabajo ha sido reparado automáticamente y está listo para usar.'
                  }
                </p>
                <Button onClick={() => setForceShow(true)} className="mr-4">
                  {language === 'en' ? 'Continue to Dashboard' : 'Continuar al Dashboard'}
                </Button>
                <Button onClick={() => window.location.reload()} variant="outline">
                  {language === 'en' ? 'Refresh Page' : 'Actualizar Página'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DashboardBackground>
    );
  }

  // Mostrar opciones de reparación si necesita recovery
  if (needsRecovery && !forceShow) {
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
                {language === 'en' ? 'Setup Required' : 'Configuración Requerida'}
              </h2>
              <p className="text-gray-600 mb-6">
                {language === 'en' 
                  ? 'Your workspace needs to be set up. Choose an option below to continue.'
                  : 'Tu espacio de trabajo necesita ser configurado. Elige una opción abajo para continuar.'
                }
              </p>
              <div className="space-y-3">
                <Button onClick={handleNavigateToMaturityCalculator} className="w-full">
                  {language === 'en' ? 'Complete Assessment' : 'Completar Evaluación'}
                </Button>
                <Button onClick={handleEmergencyRepair} variant="outline" className="w-full">
                  <Wrench className="w-4 h-4 mr-2" />
                  {language === 'en' ? 'Quick Setup' : 'Configuración Rápida'}
                </Button>
                <Button onClick={handleForceAccess} variant="ghost" className="w-full">
                  {language === 'en' ? 'Skip Setup' : 'Saltar Configuración'}
                </Button>
              </div>
              {recoveryError && (
                <p className="text-red-600 text-sm mt-4">{recoveryError}</p>
              )}
            </div>
          </div>
        </div>
      </DashboardBackground>
    );
  }

  // Mostrar error con opciones de reparación
  if (error && !forceShow) {
    return (
      <DashboardBackground>
        <NewDashboardHeader 
          onMaturityCalculatorClick={handleNavigateToMaturityCalculator}
          onAgentManagerClick={handleOpenAgentManager}
        />
        <div className="pt-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6 text-center">
              <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {language === 'en' ? 'Error Loading Dashboard' : 'Error Cargando Dashboard'}
              </h2>
              <p className="text-gray-600 mb-6">{error}</p>
              <div className="space-y-3">
                <Button onClick={handleManualRepair} className="w-full">
                  <Wrench className="w-4 h-4 mr-2" />
                  {language === 'en' ? 'Auto-Repair' : 'Auto-Reparar'}
                </Button>
                <Button onClick={() => window.location.reload()} variant="outline" className="w-full">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  {language === 'en' ? 'Refresh Page' : 'Actualizar Página'}
                </Button>
                <Button onClick={handleForceAccess} variant="ghost" className="w-full">
                  {language === 'en' ? 'Force Access' : 'Acceso Forzado'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DashboardBackground>
    );
  }

  // Mostrar dashboard principal
  console.log('DashboardHome: Showing main dashboard with data:', {
    agentsCount: agents.length,
    hasMaturityScores: !!maturityScores,
    recommendedAgentsKeys: Object.keys(recommendedAgents || {})
  });

  return (
    <DashboardBackground>
      <NewDashboardHeader 
        onMaturityCalculatorClick={handleNavigateToMaturityCalculator}
        onAgentManagerClick={handleOpenAgentManager}
      />
      
      <div className="pt-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
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
