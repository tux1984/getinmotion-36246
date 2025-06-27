
import React from 'react';
import { Agent, CategoryScore, RecommendedAgents } from '@/types/dashboard';
import { AgentMiniDashboard } from './AgentMiniDashboard';
import { AgentQuickActions } from './AgentQuickActions';
import { CollapsibleMoreTools } from './CollapsibleMoreTools';
import { TaskManagementInterface } from './TaskManagementInterface';
import { ModernAgentsGrid } from './ModernAgentsGrid';
import { PremiumDashboardHero } from './premium/PremiumDashboardHero';

interface PremiumDashboardMainProps {
  onSelectAgent: (id: string) => void;
  onMaturityCalculatorClick: () => void;
  onAgentManagerClick: () => void;
  agents: Agent[];
  maturityScores: CategoryScore | null;
  recommendedAgents: RecommendedAgents;
  profileData: any | null;
}

export const PremiumDashboardMain: React.FC<PremiumDashboardMainProps> = ({
  onSelectAgent,
  onMaturityCalculatorClick,
  onAgentManagerClick,
  agents,
  maturityScores,
  recommendedAgents,
  profileData
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900/20 via-transparent to-indigo-900/20">
      <div className="max-w-7xl mx-auto p-6 pt-24">
        {/* Hero Section */}
        <PremiumDashboardHero 
          maturityScores={maturityScores}
          profileData={profileData}
          onMaturityCalculatorClick={onMaturityCalculatorClick}
        />

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-12 gap-6 mt-8">
          {/* Left Column - Primary Content */}
          <div className="col-span-12 lg:col-span-8 space-y-6">
            {/* Task Management - Now properly positioned */}
            <div className="relative z-10">
              <TaskManagementInterface 
                language="es"
                onTaskCreate={() => {}}
                onTaskUpdate={() => {}}
              />
            </div>
            
            {/* Agents Grid */}
            <div className="relative z-0">
              <ModernAgentsGrid 
                agents={agents}
                onSelectAgent={onSelectAgent}
                onAgentManagerClick={onAgentManagerClick}
                language="es"
              />
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="col-span-12 lg:col-span-4 space-y-6">
            {/* Mini Dashboard */}
            <div className="h-[300px]">
              <AgentMiniDashboard 
                agentId="general" 
                language="es" 
              />
            </div>
            
            {/* Quick Actions */}
            <div className="h-[250px]">
              <AgentQuickActions 
                agentId="general" 
                language="es" 
              />
            </div>
            
            {/* More Tools */}
            <div className="h-[200px]">
              <CollapsibleMoreTools 
                language="es" 
                agentId="general" 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
