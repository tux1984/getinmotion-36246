
import React from 'react';
import { Agent, CategoryScore, RecommendedAgents } from '@/types/dashboard';
import { AgentMiniDashboard } from './AgentMiniDashboard';
import { CollapsibleMoreTools } from './CollapsibleMoreTools';
import QuickActionsPanel from './QuickActionsPanel';
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
          language="es"
          welcomeText="Bienvenido a tu Espacio Creativo"
          subtitleText="Tu plataforma personalizada de asistencia creativa impulsada por IA"
          activeAgentsCount={agents.length}
          completedTasksCount={0}
          overallProgress={maturityScores ? Math.round((maturityScores.ideaValidation + maturityScores.userExperience + maturityScores.marketFit + maturityScores.monetization) / 4) : 0}
          maturityScores={maturityScores}
          profileData={profileData}
          onMaturityCalculatorClick={onMaturityCalculatorClick}
        />

        {/* Main Dashboard Grid - Redesigned Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-8">
          {/* Left Column - Primary Content */}
          <div className="lg:col-span-8 space-y-6">
            {/* Task Management Interface - Priority Section */}
            <TaskManagementInterface 
              language="es"
              maturityScores={maturityScores}
              profileData={profileData}
              onTaskCreate={() => {}}
              onTaskUpdate={() => {}}
            />
            
            {/* Agents Grid - Secondary Section */}
            <ModernAgentsGrid 
              agents={agents}
              recommendedAgents={recommendedAgents}
              maturityScores={maturityScores}
              onSelectAgent={onSelectAgent}
              onAgentManagerClick={onAgentManagerClick}
              language="es"
            />
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            {/* Quick Actions Panel - Most Important */}
            <QuickActionsPanel 
              language="es"
              onMasterAgentChat={() => {}}
              activeTasks={0}
            />
            
            {/* Mini Dashboard - Compact Stats */}
            <AgentMiniDashboard 
              agentId="general" 
              language="es" 
            />
            
            {/* More Tools - Collapsed by Default */}
            <CollapsibleMoreTools 
              language="es" 
              agentId="general" 
            />
          </div>
        </div>
      </div>
    </div>
  );
};
