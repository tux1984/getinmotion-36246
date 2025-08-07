import React from 'react';
import { MasterCoordinatorDashboard } from './NewMasterCoordinatorDashboard';
import { useLanguage } from '@/context/LanguageContext';

// Single, unified dashboard component that replaces all fragmented experiences
export const UnifiedDashboard: React.FC = () => {
  const { language } = useLanguage();
  console.log('UnifiedDashboard: Rendering single, unified experience through Master Coordinator with language:', language);
  
  // Everything flows through the Master Coordinator - no more fragmentation
  return <MasterCoordinatorDashboard language={language} />;
};