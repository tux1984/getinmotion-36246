import React from 'react';
import { NewMasterCoordinatorDashboard } from './NewMasterCoordinatorDashboard';

// Single, unified dashboard component that replaces all fragmented experiences
export const UnifiedDashboard: React.FC = () => {
  console.log('UnifiedDashboard: Rendering single, unified experience through Master Coordinator');
  
  // Everything flows through the Master Coordinator - no more fragmentation
  return <NewMasterCoordinatorDashboard />;
};