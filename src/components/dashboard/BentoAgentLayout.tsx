
import React from 'react';
import { ConversationHistorySidebar } from './ConversationHistorySidebar';
import { AgentMiniDashboard } from './AgentMiniDashboard';
import { FloatingChatArea } from './FloatingChatArea';
import { AgentQuickActions } from './AgentQuickActions';
import { useIsMobile } from '@/hooks/use-mobile';

interface BentoAgentLayoutProps {
  selectedAgent: string;
  language: 'en' | 'es';
  onBack: () => void;
}

export const BentoAgentLayout: React.FC<BentoAgentLayoutProps> = ({
  selectedAgent,
  language,
  onBack
}) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
        <div className="h-screen">
          {/* Mobile: Stack layout with tabs */}
          <div className="flex flex-col h-full">
            <div className="flex-1">
              <FloatingChatArea 
                agentId={selectedAgent}
                language={language}
                onBack={onBack}
              />
            </div>
            
            {/* Mobile bottom tabs */}
            <div className="bg-white/10 backdrop-blur-xl border-t border-white/20 p-4">
              <div className="grid grid-cols-3 gap-2">
                <AgentMiniDashboard agentId={selectedAgent} language={language} compact />
                <ConversationHistorySidebar agentId={selectedAgent} language={language} compact />
                <AgentQuickActions agentId={selectedAgent} language={language} compact />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
      <div className="h-screen">
        {/* Desktop Bento Grid */}
        <div className="grid grid-cols-12 grid-rows-6 gap-4 h-full max-w-7xl mx-auto">
          {/* Main Chat Area - Takes center stage */}
          <div className="col-span-7 row-span-6">
            <FloatingChatArea 
              agentId={selectedAgent}
              language={language}
              onBack={onBack}
            />
          </div>
          
          {/* Conversation History - Left sidebar */}
          <div className="col-span-3 row-span-6">
            <ConversationHistorySidebar 
              agentId={selectedAgent}
              language={language}
            />
          </div>
          
          {/* Mini Dashboard - Top right */}
          <div className="col-span-2 row-span-2">
            <AgentMiniDashboard 
              agentId={selectedAgent}
              language={language}
            />
          </div>
          
          {/* Quick Actions - Middle right */}
          <div className="col-span-2 row-span-2">
            <AgentQuickActions 
              agentId={selectedAgent}
              language={language}
            />
          </div>
          
          {/* Additional Tools - Bottom right */}
          <div className="col-span-2 row-span-2">
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl h-full p-4">
              <h3 className="text-white font-semibold mb-3">
                {language === 'en' ? 'More Tools' : 'Más Herramientas'}
              </h3>
              <div className="space-y-2">
                <button className="w-full text-left text-sm text-purple-200 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors">
                  {language === 'en' ? 'Export Chat' : 'Exportar Chat'}
                </button>
                <button className="w-full text-left text-sm text-purple-200 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors">
                  {language === 'en' ? 'Settings' : 'Configuración'}
                </button>
                <button className="w-full text-left text-sm text-purple-200 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors">
                  {language === 'en' ? 'Help' : 'Ayuda'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
