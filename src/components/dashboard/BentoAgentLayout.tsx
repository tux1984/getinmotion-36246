
import React from 'react';
import { ConversationHistorySidebar } from './ConversationHistorySidebar';
import { AgentMiniDashboard } from './AgentMiniDashboard';
import { FloatingChatArea } from './FloatingChatArea';
import { AgentQuickActions } from './AgentQuickActions';
import { FloatingAgentInfoModule } from './FloatingAgentInfoModule';
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
        <div className="flex flex-col h-screen">
          {/* Módulo flotante con información del agente */}
          <FloatingAgentInfoModule 
            agentId={selectedAgent}
            language={language}
            onBack={onBack}
          />
          
          {/* Mobile: Main chat area takes most space */}
          <div className="flex-1 overflow-hidden">
            <FloatingChatArea 
              agentId={selectedAgent} 
              language={language} 
            />
          </div>
          
          {/* Mobile bottom tabs - simplified */}
          <div className="bg-black/20 backdrop-blur-xl border-t border-white/10 p-2">
            <div className="flex justify-between items-center gap-2">
              <div className="flex-1">
                <AgentMiniDashboard 
                  agentId={selectedAgent} 
                  language={language} 
                  compact 
                />
              </div>
              <div className="flex-1">
                <ConversationHistorySidebar 
                  agentId={selectedAgent} 
                  language={language} 
                  compact 
                />
              </div>
              <div className="flex-1">
                <AgentQuickActions 
                  agentId={selectedAgent} 
                  language={language} 
                  compact 
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
      <div className="h-screen p-4 lg:p-6">
        {/* Módulo flotante con información del agente - reemplaza el header del dashboard */}
        <FloatingAgentInfoModule 
          agentId={selectedAgent}
          language={language}
          onBack={onBack}
        />
        
        {/* Desktop Bento Grid - ajustado para el nuevo módulo */}
        <div className="grid grid-cols-12 grid-rows-6 gap-3 lg:gap-4 h-[calc(100%-100px)] max-w-7xl mx-auto">
          {/* Main Chat Area - Center stage */}
          <div className="col-span-12 lg:col-span-7 row-span-6 lg:row-span-6">
            <FloatingChatArea 
              agentId={selectedAgent} 
              language={language} 
            />
          </div>
          
          {/* Conversation History - Left sidebar on desktop */}
          <div className="hidden lg:block lg:col-span-3 lg:row-span-6">
            <ConversationHistorySidebar 
              agentId={selectedAgent} 
              language={language} 
            />
          </div>
          
          {/* Mini Dashboard - Top right on desktop */}
          <div className="hidden lg:block lg:col-span-2 lg:row-span-2">
            <AgentMiniDashboard 
              agentId={selectedAgent} 
              language={language} 
            />
          </div>
          
          {/* Quick Actions - Middle right on desktop */}
          <div className="hidden lg:block lg:col-span-2 lg:row-span-2">
            <AgentQuickActions 
              agentId={selectedAgent} 
              language={language} 
            />
          </div>
          
          {/* Additional Tools - Bottom right on desktop */}
          <div className="hidden lg:block lg:col-span-2 lg:row-span-2">
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
