
import React from 'react';
import { MasterCoordinatorDashboard } from '@/components/dashboard/MasterCoordinatorDashboard';

// Nueva implementación centrada en el Coordinador Maestro
const DashboardHome = () => {
  console.log('DashboardHome: Using Master Coordinator as main entry point');
  return <MasterCoordinatorDashboard />;
};

export default DashboardHome;
