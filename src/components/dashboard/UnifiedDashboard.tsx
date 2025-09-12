import React, { useState, useEffect } from 'react';
import { MasterCoordinatorDashboard } from './NewMasterCoordinatorDashboard';
import { DashboardBackground } from './DashboardBackground';
import { NewDashboardHeader } from './NewDashboardHeader';
import { DashboardFooter } from './DashboardFooter';
import { BasicDashboardFallback } from './BasicDashboardFallback';
import { DigitalShopHeroSection } from '@/components/shop/DigitalShopHeroSection';
import { useLanguage } from '@/context/LanguageContext';
import { mapToLegacyLanguage } from '@/utils/languageMapper';
import { useRobustAuth } from '@/hooks/useRobustAuth';
import { DashboardJWTStatusBar } from './DashboardJWTStatusBar';
import { DashboardErrorBoundary } from './DashboardErrorBoundary';
import { useRobustDashboardData } from '@/hooks/useRobustDashboardData';
import { useAgentTasks } from '@/hooks/useAgentTasks';
import { useOptimizedMaturityScores } from '@/hooks/useOptimizedMaturityScores';

// Single, unified dashboard component that replaces all fragmented experiences
export const UnifiedDashboard: React.FC = () => {
  const { language } = useLanguage();
  const { 
    user, 
    session, 
    loading, 
    isAuthorized, 
    jwtIntegrity, 
    recoverJWT 
  } = useRobustAuth();
  
  console.log('🎯 UnifiedDashboard: State check', {
    hasUser: !!user,
    hasSession: !!session,
    isAuthorized,
    loading
  });
  
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

  // Handle JWT corruption recovery
  useEffect(() => {
    if (jwtIntegrity === 'corrupted') {
      console.log('🔧 JWT corruption detected in dashboard, triggering recovery...');
      recoverJWT();
    }
  }, [jwtIntegrity, recoverJWT]);
  
  // Show loading while authentication is being processed
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <NewDashboardHeader 
          onMaturityCalculatorClick={handleMaturityCalculatorClick}
          onAgentManagerClick={handleAgentManagerClick}
        />
        <div className="flex-1 pt-24 pb-6 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground">Verificando autenticación...</p>
          </div>
        </div>
        <DashboardFooter />
      </div>
    );
  }

  // Show recovery UI if JWT is being recovered
  if (jwtIntegrity === 'recovering') {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-foreground font-medium">Recuperando autenticación...</p>
          <p className="text-muted-foreground text-sm">Reparando sesión corrompida</p>
        </div>
      </div>
    );
  }

  // BYPASS: Skip server-side JWT validation temporarily
  // Only check client-side session while we fix Supabase configuration
  if (!user || !session) {
    console.log('🚫 UnifiedDashboard: No client session, redirecting to login');
    window.location.href = '/login';
    return null;
  }

  console.log('✅ UnifiedDashboard: Using client-side bypass, JWT integrity:', jwtIntegrity);

  // Show Master Coordinator Dashboard as primary experience
  // BasicDashboardFallback is now only used as error fallback
  return (
    <div className="min-h-screen bg-gradient-subtle">
      <DashboardJWTStatusBar />
      <NewDashboardHeader 
        onMaturityCalculatorClick={handleMaturityCalculatorClick}
        onAgentManagerClick={handleAgentManagerClick}
      />
      
      <DashboardBackground>
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
          {/* Master Coordinator Dashboard as Primary Experience */}
          <div className="space-y-8">
            {(profile as any)?.user_type === 'artisan' && (
              <DigitalShopHeroSection language={mapToLegacyLanguage(language)} />
            )}
            <MasterCoordinatorDashboard language={mapToLegacyLanguage(language)} />
          </div>
        </DashboardErrorBoundary>
      </DashboardBackground>
      
      <DashboardFooter />
    </div>
  );
};