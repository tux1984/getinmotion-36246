import React, { useState, useEffect } from 'react';
import { MasterCoordinatorDashboard } from './MasterCoordinatorDashboard';
import { DashboardBackground } from './DashboardBackground';
import { NewDashboardHeader } from './NewDashboardHeader';
import { DashboardFooter } from './DashboardFooter';
import { DigitalShopHeroSection } from '@/components/shop/DigitalShopHeroSection';
import { useLanguage } from '@/context/LanguageContext';
import { mapToLegacyLanguage } from '@/utils/languageMapper';
import { useRobustAuth } from '@/hooks/useRobustAuth';
import { useRobustDashboardData } from '@/hooks/useRobustDashboardData';
import { useAgentTasks } from '@/hooks/useAgentTasks';
import { useOptimizedMaturityScores } from '@/hooks/useOptimizedMaturityScores';
import { clearSystemCache } from '@/utils/localStorage';

// Single, unified dashboard component that replaces all fragmented experiences
export const UnifiedDashboard: React.FC = () => {
  const { language } = useLanguage();
  const { 
    user, 
    session, 
    loading, 
    isAuthorized
  } = useRobustAuth();
  
  const [showMasterAgentChat, setShowMasterAgentChat] = useState(false);
  
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


  const handleMasterAgentChat = () => {
    setShowMasterAgentChat(true);
    console.log('Master Agent Chat opened');
  };

  // Clear cache on component mount for fresh data
  useEffect(() => {
    clearSystemCache();
  }, []);
  
  // Show loading while authentication is being processed
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <NewDashboardHeader 
          onMaturityCalculatorClick={handleMaturityCalculatorClick}
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

  // Simple auth check - no bypass needed
  if (!user || !session) {
    console.log('🚫 UnifiedDashboard: No session, redirecting to login');
    window.location.href = '/login';
    return null;
  }

  console.log('✅ UnifiedDashboard: User authenticated, loading dashboard');

  // Clean dashboard without bypass complexity
  return (
    <div className="min-h-screen bg-gradient-subtle">
      <NewDashboardHeader 
        onMaturityCalculatorClick={handleMaturityCalculatorClick}
      />
      
      <DashboardBackground>
        <div className="space-y-8">
          {(profile as any)?.user_type === 'artisan' && (
            <DigitalShopHeroSection language={mapToLegacyLanguage(language)} />
          )}
          <MasterCoordinatorDashboard 
            language={mapToLegacyLanguage(language)}
          />
        </div>
      </DashboardBackground>
      
      <DashboardFooter />
    </div>
  );
};