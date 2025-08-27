import React from 'react';
import { MasterCoordinatorDashboard } from './NewMasterCoordinatorDashboard';
import { DashboardBackground } from './DashboardBackground';
import { NewDashboardHeader } from './NewDashboardHeader';
import { DashboardFooter } from './DashboardFooter';
import { useLanguage } from '@/context/LanguageContext';
import { mapToLegacyLanguage } from '@/utils/languageMapper';

// Single, unified dashboard component that replaces all fragmented experiences
export const UnifiedDashboard: React.FC = () => {
  const { language } = useLanguage();
  
  const handleMaturityCalculatorClick = () => {
    // TODO: Navigate to maturity calculator or show modal
    console.log('Maturity Calculator clicked');
  };

  const handleAgentManagerClick = () => {
    // TODO: Navigate to agent manager
    console.log('Agent Manager clicked');
  };
  
  // Everything flows through the Master Coordinator - no more fragmentation
  // Disable FloatingMasterAgent on main dashboard to avoid duplication
  return (
    <div className="min-h-screen flex flex-col">
      <NewDashboardHeader 
        onMaturityCalculatorClick={handleMaturityCalculatorClick}
        onAgentManagerClick={handleAgentManagerClick}
      />
      
      <div className="flex-1 pt-20"> {/* Add padding-top for fixed header */}
        <DashboardBackground showFloatingAgent={false}>
          <MasterCoordinatorDashboard language={mapToLegacyLanguage(language)} />
        </DashboardBackground>
      </div>
      
      <DashboardFooter />
    </div>
  );
};