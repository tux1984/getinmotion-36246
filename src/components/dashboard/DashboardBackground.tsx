
import React from 'react';
import { FloatingMasterAgent } from './FloatingMasterAgent';
import { TaskLimitManager } from './TaskLimitManager';
import { useUserData } from '@/hooks/useUserData';
import { useMaturityScores } from '@/hooks/useMaturityScores';

import { useNavigate } from 'react-router-dom';

interface DashboardBackgroundProps {
  children: React.ReactNode;
  showGlobalComponents?: boolean;
}

export const DashboardBackground: React.FC<DashboardBackgroundProps> = ({ 
  children, 
  showGlobalComponents = true 
}) => {
  const language = 'en'; // Fixed to English only
  const navigate = useNavigate();
  const { profile } = useUserData();
  const { currentScores } = useMaturityScores();
  
  // Mock data for Master Agent - in real app, fetch from tasks API
  const activeTasksCount = 8;
  const completedTasksCount = 23;
  const userActivityDays = 12;
  
  // Mock tasks data for Task Limit Manager
  const mockActiveTasks = Array.from({ length: activeTasksCount }, (_, i) => ({
    id: `task-${i + 1}`,
    title: `Task ${i + 1}`,
    priority: ['high', 'medium', 'low'][Math.floor(Math.random() * 3)] as 'high' | 'medium' | 'low',
    status: 'in_progress' as const,
    agent_name: 'Cultural Agent',
    impact: ['high', 'medium', 'low'][Math.floor(Math.random() * 3)] as 'high' | 'medium' | 'low'
  }));

  const handleStartChat = () => {
    navigate('/dashboard/home');
  };

  const handleViewProgress = () => {
    navigate('/dashboard/progress');
  };

  const handlePauseTask = (taskId: string) => {
    console.log(`Pause task: ${taskId}`);
  };

  const handleResumeTask = (taskId: string) => {
    console.log(`Resume task: ${taskId}`);
  };

  const handleDeleteTask = (taskId: string) => {
    console.log(`Delete task: ${taskId}`);
  };
  const backgroundPattern = "data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div 
        className="absolute inset-0 opacity-20"
        style={{ backgroundImage: `url("${backgroundPattern}")` }}
      />
      <div className="relative z-10">
        {children}
        
        {/* Global components that appear on all dashboard pages */}
        {showGlobalComponents && (
          <>
            {/* Task Limit Manager - positioned at top right */}
            <div className="fixed top-24 right-6 z-40">
              <TaskLimitManager
                activeTasks={mockActiveTasks}
                maxTasks={15}
                language={language}
                onPauseTask={handlePauseTask}
                onResumeTask={handleResumeTask}
                onDeleteTask={handleDeleteTask}
                onReorderTasks={(tasks) => console.log('Reorder tasks:', tasks)}
              />
            </div>
            
            {/* Floating Master Agent - bottom right */}
            <FloatingMasterAgent
              language={language}
              maturityScores={currentScores}
              activeTasksCount={activeTasksCount}
              completedTasksCount={completedTasksCount}
              userActivityDays={userActivityDays}
              onStartChat={handleStartChat}
              onViewProgress={handleViewProgress}
              onHelp={() => console.log('Help requested')}
            />
          </>
        )}
      </div>
    </div>
  );
};
