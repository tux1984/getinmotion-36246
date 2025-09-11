import React, { useState, useEffect } from 'react';
import { MasterCoordinatorDashboard } from './NewMasterCoordinatorDashboard';
import { DashboardBackground } from './DashboardBackground';
import { NewDashboardHeader } from './NewDashboardHeader';
import { DashboardFooter } from './DashboardFooter';
import { BasicDashboardFallback } from './BasicDashboardFallback';
import { useLanguage } from '@/context/LanguageContext';
import { mapToLegacyLanguage } from '@/utils/languageMapper';
import { useAuth } from '@/context/AuthContext';
import { DashboardErrorBoundary } from './DashboardErrorBoundary';
import { useRobustDashboardData } from '@/hooks/useRobustDashboardData';
import { useAgentTasks } from '@/hooks/useAgentTasks';
import { useOptimizedMaturityScores } from '@/hooks/useOptimizedMaturityScores';

// Single, unified dashboard component that replaces all fragmented experiences
export const UnifiedDashboard: React.FC = () => {
  const { language } = useLanguage();
  const { isAuthorized, loading, user, checkAuthorization } = useAuth();
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);
  
  // Get basic dashboard data
  const { profile, maturityScores, userAgents } = useRobustDashboardData();
  const { tasks } = useAgentTasks();
  const { currentScores } = useOptimizedMaturityScores();
  
  const completedTasksCount = tasks.filter(t => t.status === 'completed').length;
  const activeTasksCount = tasks.filter(t => t.status === 'pending' || t.status === 'in_progress').length;
  
  const handleMaturityCalculatorClick = () => {
    // TODO: Navigate to maturity calculator or show modal
    console.log('Maturity Calculator clicked');
  };

  const handleAgentManagerClick = () => {
    // TODO: Navigate to agent manager
    console.log('Agent Manager clicked');
  };

  // Auto-retry authorization on failure
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    if (!loading && user && !isAuthorized && retryCount < 3) {
      console.log(`Retrying authorization (attempt ${retryCount + 1})`);
      setIsRetrying(true);
      
      timeoutId = setTimeout(async () => {
        try {
          await checkAuthorization();
          setRetryCount(prev => prev + 1);
        } catch (error) {
          console.error('Authorization retry failed:', error);
        } finally {
          setIsRetrying(false);
        }
      }, (retryCount + 1) * 2000); // Progressive delay
    }
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [loading, user, isAuthorized, retryCount, checkAuthorization]);

  const handleRefreshAuth = async () => {
    setIsRetrying(true);
    try {
      await checkAuthorization();
      setRetryCount(0);
    } catch (error) {
      console.error('Manual auth refresh failed:', error);
    } finally {
      setIsRetrying(false);
    }
  };
  
  // Show loading while authentication is being processed
  if (loading || isRetrying) {
    return (
      <div className="min-h-screen flex flex-col">
        <NewDashboardHeader 
          onMaturityCalculatorClick={handleMaturityCalculatorClick}
          onAgentManagerClick={handleAgentManagerClick}
        />
        <div className="flex-1 pt-24 pb-6 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground">
              {isRetrying ? 'Reintentando autenticación...' : 'Cargando dashboard...'}
            </p>
          </div>
        </div>
        <DashboardFooter />
      </div>
    );
  }

  // Show recovery mode if not authorized after retries
  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex flex-col">
        <NewDashboardHeader 
          onMaturityCalculatorClick={handleMaturityCalculatorClick}
          onAgentManagerClick={handleAgentManagerClick}
        />
        <div className="flex-1 pt-24 pb-6">
          <DashboardBackground showFloatingAgent={false}>
            <DashboardErrorBoundary
              user={user}
              onRefreshAuth={handleRefreshAuth}
              isRetrying={isRetrying}
              retryCount={retryCount}
            />
          </DashboardBackground>
        </div>
        <DashboardFooter />
      </div>
    );
  }

  // Show Master Coordinator Dashboard as primary experience
  // BasicDashboardFallback is now only used as error fallback
  return (
    <div className="min-h-screen flex flex-col">
      <NewDashboardHeader 
        onMaturityCalculatorClick={handleMaturityCalculatorClick}
        onAgentManagerClick={handleAgentManagerClick}
      />
      
      <div className="flex-1 pt-24 pb-6">
        <DashboardBackground showFloatingAgent={false}>
          <DashboardErrorBoundary fallback={
            <BasicDashboardFallback
              onMaturityCalculatorClick={handleMaturityCalculatorClick}
              onAgentManagerClick={handleAgentManagerClick}
              tasks={tasks}
              currentScores={currentScores}
              completedTasksCount={completedTasksCount}
              activeTasksCount={activeTasksCount}
            />
          }>
            <MasterCoordinatorDashboard language={mapToLegacyLanguage(language)} />
          </DashboardErrorBoundary>
        </DashboardBackground>
      </div>
      
      <DashboardFooter />
    </div>
  );
};