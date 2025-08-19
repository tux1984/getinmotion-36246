import React from 'react';
import { MasterCoordinatorDashboard } from './NewMasterCoordinatorDashboard';
import { DashboardBackground } from './DashboardBackground';
import { useLanguage } from '@/context/LanguageContext';

// Single, unified dashboard component that replaces all fragmented experiences
export const UnifiedDashboard: React.FC = () => {
  const { language } = useLanguage();
  
  // Everything flows through the Master Coordinator - no more fragmentation
  // Disable FloatingMasterAgent on main dashboard to avoid duplication
  return (
    <DashboardBackground showFloatingAgent={false}>
      <MasterCoordinatorDashboard language={language} />
    </DashboardBackground>
  );
};