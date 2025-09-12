
import React from 'react';
import { Agent, CategoryScore, RecommendedAgents } from '@/types/dashboard';
import { AgentMiniDashboard } from './AgentMiniDashboard';
import { CollapsibleMoreTools } from './CollapsibleMoreTools';
import QuickActionsPanel from './QuickActionsPanel';
import { TaskManagementInterface } from './TaskManagementInterface';
import { ModernAgentsGrid } from './ModernAgentsGrid';
import RecommendedTasksSection from './RecommendedTasksSection';

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
        {/* Simplified Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Panel de Control
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Gestiona tu negocio con inteligencia artificial
          </p>
        </div>

        {/* Main Dashboard Grid - Reorganized Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Left Column - Primary Content (Takes more space) */}
          <div className="xl:col-span-3 space-y-6">
            {/* Recommended Tasks Section - HIGH PRIORITY */}
            <RecommendedTasksSection
              language="es"
              maturityScores={maturityScores}
            />
            
            {/* Task Management Interface - Secondary Section */}
            <TaskManagementInterface 
              language="es"
              maturityScores={maturityScores}
              profileData={profileData}
              onTaskCreate={() => {}}
              onTaskUpdate={() => {}}
              enabledAgents={recommendedAgents?.primary || []}
              onSelectAgent={onSelectAgent}
            />
            
            {/* Agents Grid - Secondary Section */}
            <ModernAgentsGrid 
              agents={agents}
              recommendedAgents={recommendedAgents}
              language="es"
              onSelectAgent={onSelectAgent}
              maturityScores={maturityScores}
              onAgentManagerClick={onAgentManagerClick}
            />

            {/* Quick Actions Panel */}
            <QuickActionsPanel 
              language="es"
              onMasterAgentChat={() => {}}
              activeTasks={0}
            />
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Mini Dashboard - Compact Stats */}
            <AgentMiniDashboard 
              language="es" 
              agentId="general"
            />
            
            {/* Coordinator Tools - Recalculate Maturity moved here */}
            <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-lg border border-slate-200 dark:border-slate-700">
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                Herramientas del Coordinador
              </h3>
              <button
                onClick={onMaturityCalculatorClick}
                className="w-full flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-lg border border-purple-200 dark:border-purple-700 transition-all group"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-100 dark:bg-purple-800 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Recalcular Madurez
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Actualizar puntuaciones
                    </p>
                  </div>
                </div>
                <svg className="w-4 h-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            
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
