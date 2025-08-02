
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useRobustDashboardData } from '@/hooks/useRobustDashboardData';
import { StablePremiumDashboardHero } from './StablePremiumDashboardHero';
import { SafeTaskManagementInterface } from './SafeTaskManagementInterface';
import { RobustModernAgentsGrid } from './RobustModernAgentsGrid';
import { PremiumSidebar } from './PremiumSidebar';
import { DashboardBackground } from './DashboardBackground';

export const RobustPremiumDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile, maturityScores, userAgents, loading, error } = useRobustDashboardData();

  console.log('RobustPremiumDashboard: Rendering', {
    user: user?.email,
    loading,
    error
  });

  const handleSelectAgent = (agentId: string) => {
    console.log('Selecting agent:', agentId);
    navigate(`/dashboard/agent/${agentId}`);
  };

  const handleMaturityCalculator = () => {
    navigate('/maturity-calculator');
  };

  const handleAgentManager = () => {
    navigate('/agent-manager');
  };

  if (loading) {
    return (
      <DashboardBackground>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-300 mx-auto mb-4"></div>
              <p className="text-white text-lg">Cargando dashboard...</p>
            </div>
          </div>
        </div>
      </DashboardBackground>
    );
  }

  return (
    <DashboardBackground>
      <div className="min-h-screen">
        {/* Hero Section */}
        <StablePremiumDashboardHero 
          profile={profile}
          maturityScores={maturityScores}
          activeAgentsCount={userAgents.filter(ua => ua.is_enabled).length}
          onMaturityCalculatorClick={handleMaturityCalculator}
        />

        {/* Main Content Grid - Tasks First Layout */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-12 gap-6">
            {/* Full Width - Priority Tasks Section */}
            <div className="col-span-12 space-y-6">
              {/* Task Management - Now Full Width and Prominent */}
              <SafeTaskManagementInterface 
                language="es"
                maturityScores={maturityScores}
                profileData={profile}
                enabledAgents={userAgents.filter(ua => ua.is_enabled).map(ua => ua.agent_id)}
                onSelectAgent={handleSelectAgent}
              />
            </div>

            {/* Secondary Content Grid */}
            <div className="col-span-12 lg:col-span-8 space-y-6">
              {/* Agents Grid - Now Secondary */}
              <RobustModernAgentsGrid 
                userAgents={userAgents}
                maturityScores={maturityScores}
                onSelectAgent={handleSelectAgent}
                onAgentManagerClick={handleAgentManager}
                language="es"
              />
            </div>

            {/* Right Column - Sidebar */}
            <div className="col-span-12 lg:col-span-4">
              <PremiumSidebar 
                profile={profile}
                maturityScores={maturityScores}
                language="es"
              />
            </div>
          </div>
        </div>
      </div>
    </DashboardBackground>
  );
};
