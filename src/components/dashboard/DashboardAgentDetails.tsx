
import React from 'react';
import { FloatingAgentHeader } from './FloatingAgentHeader';
import { ModernFloatingAgentChat } from './ModernFloatingAgentChat';
import { CollapsibleAgentModules } from './CollapsibleAgentModules';
import { useIsMobile } from '@/hooks/use-mobile';

interface DashboardAgentDetailsProps {
  selectedAgent: string;
  language: 'en' | 'es';
  onBack: () => void;
}

export const DashboardAgentDetails: React.FC<DashboardAgentDetailsProps> = ({
  selectedAgent,
  language,
  onBack
}) => {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 relative">
      {/* Floating Header */}
      <FloatingAgentHeader onBack={onBack} language={language} />
      
      {/* Main Content */}
      <div className="pt-24 pb-6 px-6">
        <div className="max-w-7xl mx-auto">
          <div className={`grid gap-6 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-3'}`}>
            {/* Chat Section - Takes full width on mobile, 2/3 on desktop */}
            <div className={`${isMobile ? 'col-span-1' : 'lg:col-span-2'} order-1`}>
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl h-[calc(100vh-140px)]">
                <ModernFloatingAgentChat 
                  agentId={selectedAgent}
                  language={language}
                />
              </div>
            </div>
            
            {/* Modules Section - Hidden on mobile by default, 1/3 on desktop */}
            <div className={`${isMobile ? 'col-span-1 order-3' : 'lg:col-span-1 order-2'}`}>
              <CollapsibleAgentModules 
                agentId={selectedAgent}
                language={language}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
