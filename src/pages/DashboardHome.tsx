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
import { AlertTriangle, RefreshCw, Wrench, CheckCircle, Home } from 'lucide-react';
import { useOptimizedMaturityScores } from '@/hooks/useOptimizedMaturityScores';
import { useOptimizedRecommendedTasks } from '@/hooks/useOptimizedRecommendedTasks';
import { useAgentTasks, AgentTask } from '@/hooks/useAgentTasks';

const DashboardHome = () => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [forceShow, setForceShow] = useState(false);
  const [debugInfo, setDebugInfo] = useState<any>(null);
  
  const {
    agents,
    maturityScores,
    recommendedAgents,
    isLoading,
    error,
    hasOnboarding
  } = useOptimizedAgentManagement();

  const { profileData, loading: scoresLoading, error: scoresError } = useOptimizedMaturityScores();

  const {
    needsRecovery,
    recovering,
    recovered,
    error: recoveryError,
    performEmergencyRecovery,
    checkAndRepair
  } = useDataRecovery();

  // --- Task Synchronization Logic ---
  const activeAgents = agents?.filter(a => a.status === 'active') || [];
  const agentPool = activeAgents.map(a => a.id);
  
  const { tasks: recommendedTasks, loading: recommendedTasksLoading } = useOptimizedRecommendedTasks(maturityScores, profileData, agentPool);
  const { tasks: persistentTasks, createTask } = useAgentTasks();

  useEffect(() => {
    if (recommendedTasks.length === 0 || !persistentTasks || !createTask) return;

    const syncTasks = async () => {
      const newTasksToCreate = recommendedTasks.filter(recTask => 
        !persistentTasks.some(persistedTask => persistedTask.title === recTask.title)
      );

      if (newTasksToCreate.length > 0) {
        console.log(`DashboardHome: Syncing ${newTasksToCreate.length} recommended tasks to DB.`);
        
        const creationPromises = newTasksToCreate.map(recTask => {
          const taskToCreate: Partial<AgentTask> = {
            title: recTask.title,
            description: recTask.description,
            agent_id: recTask.agentId,
            relevance: recTask.priority,
          };
          return createTask(taskToCreate);
        });
        
        await Promise.all(creationPromises);
        console.log("DashboardHome: Sync complete.");
      }
    };
    
    syncTasks();
  }, [recommendedTasks, persistentTasks, createTask]);
  // --- End Task Synchronization Logic ---

  // Debug logging mejorado
  useEffect(() => {
    const debugData = {
      timestamp: new Date().toISOString(),
      user: !!user,
      userId: user?.id,
      isLoading,
      error,
      hasOnboarding,
      needsRecovery,
      recovering,
      recovered,
      agentsCount: agents?.length || 0,
      activeAgents: agents?.filter(a => a.status === 'active')?.length || 0,
      maturityScores: !!maturityScores,
      profileData: !!profileData,
      maturityScoresData: maturityScores,
      recommendedAgentsKeys: recommendedAgents ? Object.keys(recommendedAgents) : [],
      forceShow,
      recommendedTasksCount: recommendedTasks?.length,
      persistentTasksCount: persistentTasks?.length,
    };
    
    setDebugInfo(debugData);
    console.log('DashboardHome: Comprehensive state update:', debugData);
  }, [
    user, isLoading, error, hasOnboarding, needsRecovery, 
    recovering, recovered, agents, maturityScores, recommendedAgents, forceShow,
    profileData, recommendedTasks, persistentTasks
  ]);

  // Lógica mejorada de redirección con más validaciones
  useEffect(() => {
    if (!user) {
      console.log('DashboardHome: No user, redirecting to auth');
      return;
    }

    if (isLoading || recovering) {
      console.log('DashboardHome: Loading or recovering, waiting...');
      return;
    }

    // Verificar si realmente necesita onboarding
    const hasAnyData = maturityScores || 
                       agents?.some(a => a.status === 'active') || 
                       hasOnboarding;

    const shouldRedirect = !hasAnyData && 
                          !needsRecovery && 
                          !recovered && 
                          !forceShow &&
                          !error;

    console.log('DashboardHome: Redirect check:', {
      hasAnyData,
      shouldRedirect,
      maturityScores: !!maturityScores,
      activeAgents: agents?.filter(a => a.status === 'active')?.length || 0,
      hasOnboarding,
      needsRecovery,
      recovered,
      forceShow,
      error
    });

    if (shouldRedirect) {
      console.log('User needs onboarding, redirecting to maturity calculator');
      navigate('/maturity-calculator', { replace: true });
    }
  }, [
    user, isLoading, recovering, hasOnboarding, maturityScores, 
    agents, needsRecovery, recovered, forceShow, error, navigate
  ]);

  const handleNavigateToMaturityCalculator = () => {
    navigate('/maturity-calculator');
  };

  const handleSelectAgent = (agentId: string) => {
    console.log('DashboardHome: Selecting agent:', agentId);
    navigate(`/dashboard/agent/${agentId}`);
  };

  const handleOpenAgentManager = () => {
    navigate('/dashboard/agents');
  };

  const handleForceAccess = () => {
    console.log('DashboardHome: Force access triggered');
    setForceShow(true);
  };

  const handleEmergencyRepair = async () => {
    console.log('DashboardHome: Emergency repair triggered');
    const success = await performEmergencyRecovery();
    if (success) {
      console.log('Emergency repair successful, reloading page');
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    }
  };

  const handleManualRepair = async () => {
    console.log('DashboardHome: Manual repair triggered');
    await checkAndRepair();
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const handleCompleteReset = () => {
    console.log('DashboardHome: Complete reset triggered');
    localStorage.clear();
    navigate('/maturity-calculator', { replace: true });
  };

  // Mostrar pantalla de carga mejorada
  if ((isLoading || scoresLoading || recommendedTasksLoading) && !forceShow) {
    return (
      <DashboardBackground>
        <NewDashboardHeader 
          onMaturityCalculatorClick={handleNavigateToMaturityCalculator}
          onAgentManagerClick={handleOpenAgentManager}
        />
        <div className="pt-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center max-w-md">
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
                <div className="space-y-3">
                  <Button onClick={handleForceAccess} variant="outline" size="sm">
                    {language === 'en' ? 'Force Access' : 'Acceder Directamente'}
                  </Button>
                  <Button onClick={handleEmergencyRepair} variant="outline" size="sm">
                    <Wrench className="w-4 h-4 mr-2" />
                    {language === 'en' ? 'Emergency Setup' : 'Configuración de Emergencia'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DashboardBackground>
    );
  }

  // Mostrar pantalla de recuperación
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
                <div className="space-y-3">
                  <Button onClick={() => setForceShow(true)} className="mr-4">
                    <Home className="w-4 h-4 mr-2" />
                    {language === 'en' ? 'Continue to Dashboard' : 'Continuar al Dashboard'}
                  </Button>
                  <Button onClick={() => window.location.reload()} variant="outline">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    {language === 'en' ? 'Refresh Page' : 'Actualizar Página'}
                  </Button>
                </div>
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

  // Mostrar error con opciones de reparación mejoradas
  const combinedError = error || scoresError;
  if (combinedError && !forceShow) {
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
              <p className="text-gray-600 mb-6">{combinedError}</p>
              <div className="space-y-3">
                <Button onClick={handleManualRepair} className="w-full">
                  <Wrench className="w-4 h-4 mr-2" />
                  {language === 'en' ? 'Auto-Repair' : 'Auto-Reparar'}
                </Button>
                <Button onClick={handleEmergencyRepair} variant="outline" className="w-full">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  {language === 'en' ? 'Emergency Setup' : 'Configuración de Emergencia'}
                </Button>
                <Button onClick={handleCompleteReset} variant="outline" className="w-full">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  {language === 'en' ? 'Complete Reset' : 'Reset Completo'}
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

  // Mostrar dashboard principal con validaciones adicionales
  const safeAgents = agents || [];
  const safeMaturityScores = maturityScores || null;
  const safeRecommendedAgents = recommendedAgents || {};
  const safeProfileData = profileData || null;

  console.log('DashboardHome: Showing main dashboard with data:', {
    agentsCount: safeAgents.length,
    activeAgents: safeAgents.filter(a => a?.status === 'active').length,
    hasMaturityScores: !!safeMaturityScores,
    hasProfileData: !!safeProfileData,
    recommendedAgentsKeys: Object.keys(safeRecommendedAgents),
    debugInfo
  });

  return (
    <DashboardBackground>
      <NewDashboardHeader 
        onMaturityCalculatorClick={handleNavigateToMaturityCalculator}
        onAgentManagerClick={handleOpenAgentManager}
      />
      
      <div className="pt-24">
        <ModernDashboardMain 
          onSelectAgent={handleSelectAgent}
          onMaturityCalculatorClick={handleNavigateToMaturityCalculator}
          onAgentManagerClick={handleOpenAgentManager}
          agents={safeAgents}
          maturityScores={safeMaturityScores}
          recommendedAgents={safeRecommendedAgents}
          profileData={safeProfileData}
        />
      </div>
    </DashboardBackground>
  );
};

export default DashboardHome;
