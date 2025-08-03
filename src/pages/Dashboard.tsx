
import React from 'react';
import { MasterCoordinatorDashboard } from '@/components/dashboard/MasterCoordinatorDashboard';

// Dashboard principal ahora es directamente el Coordinador Maestro
const Dashboard = () => {
  console.log('Dashboard: Rendering Master Coordinator as main entry point');
  return <MasterCoordinatorDashboard />;
};

export default Dashboard;
