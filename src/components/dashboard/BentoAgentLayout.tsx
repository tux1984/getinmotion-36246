
import React, { useState } from 'react';
import { ConversationHistorySidebar } from './ConversationHistorySidebar';
import { AgentMiniDashboard } from './AgentMiniDashboard';
import { ModernFloatingAgentChat } from './ModernFloatingAgentChat';
import { AgentQuickActions } from './AgentQuickActions';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { MessageSquare, BarChart3, Zap, Menu } from 'lucide-react';

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
  const [activeTab, setActiveTab] = useState<'chat' | 'conversations' | 'dashboard' | 'actions'>('chat');

  const t = {
    en: {
      chat: "Chat",
      conversations: "History", 
      dashboard: "Stats",
      actions: "Actions"
    },
    es: {
      chat: "Chat",
      conversations: "Historial",
      dashboard: "Stats", 
      actions: "Acciones"
    }
  };

  if (isMobile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900/20 via-transparent to-indigo-900/20">
        <div className="flex flex-col h-screen">
          {/* Main content area with tab switching - sin header interno */}
          <div className="flex-1 mx-4 mb-20 bg-transparent backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden">
            {activeTab === 'chat' && (
              <ModernFloatingAgentChat 
                agentId={selectedAgent} 
                language={language}
                showHeader={false}
              />
            )}
            
            {activeTab === 'conversations' && (
              <div className="h-full p-4">
                <ConversationHistorySidebar 
                  agentId={selectedAgent} 
                  language={language} 
                />
              </div>
            )}
            
            {activeTab === 'dashboard' && (
              <div className="h-full p-4">
                <AgentMiniDashboard 
                  agentId={selectedAgent} 
                  language={language} 
                />
              </div>
            )}
            
            {activeTab === 'actions' && (
              <div className="h-full p-4">
                <AgentQuickActions 
                  agentId={selectedAgent} 
                  language={language} 
                />
              </div>
            )}
          </div>
          
          {/* Mobile bottom navigation */}
          <div className="fixed bottom-0 left-0 right-0 bg-white/10 backdrop-blur-md border-t border-white/10 p-4">
            <div className="flex justify-around items-center max-w-md mx-auto">
              <Button
                variant={activeTab === 'chat' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab('chat')}
                className={`flex flex-col items-center gap-1 h-auto py-2 px-3 ${
                  activeTab === 'chat' 
                    ? 'bg-purple-600 text-white' 
                    : 'text-white hover:bg-white/10'
                }`}
              >
                <MessageSquare className="w-5 h-5" />
                <span className="text-xs">{t[language].chat}</span>
              </Button>
              
              <Button
                variant={activeTab === 'conversations' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab('conversations')}
                className={`flex flex-col items-center gap-1 h-auto py-2 px-3 ${
                  activeTab === 'conversations' 
                    ? 'bg-purple-600 text-white' 
                    : 'text-white hover:bg-white/10'
                }`}
              >
                <Menu className="w-5 h-5" />
                <span className="text-xs">{t[language].conversations}</span>
              </Button>
              
              <Button
                variant={activeTab === 'dashboard' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab('dashboard')}
                className={`flex flex-col items-center gap-1 h-auto py-2 px-3 ${
                  activeTab === 'dashboard' 
                    ? 'bg-purple-600 text-white' 
                    : 'text-white hover:bg-white/10'
                }`}
              >
                <BarChart3 className="w-5 h-5" />
                <span className="text-xs">{t[language].dashboard}</span>
              </Button>
              
              <Button
                variant={activeTab === 'actions' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab('actions')}
                className={`flex flex-col items-center gap-1 h-auto py-2 px-3 ${
                  activeTab === 'actions' 
                    ? 'bg-purple-600 text-white' 
                    : 'text-white hover:bg-white/10'
                }`}
              >
                <Zap className="w-5 h-5" />
                <span className="text-xs">{t[language].actions}</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900/20 via-transparent to-indigo-900/20">
      <div className="h-screen p-4 lg:p-6">
        {/* Contenedor transparente con efecto de cristal muy sutil */}
        <div className="bg-transparent backdrop-blur-md rounded-3xl border border-white/10 h-full max-w-7xl mx-auto overflow-hidden">
          <div className="grid grid-cols-12 grid-rows-6 gap-3 lg:gap-4 h-full p-4 lg:p-6">
            {/* Chat principal - sin header interno */}
            <div className="col-span-12 lg:col-span-7 row-span-6 lg:row-span-6">
              <ModernFloatingAgentChat 
                agentId={selectedAgent} 
                language={language}
                showHeader={false}
              />
            </div>
            
            {/* Conversation History */}
            <div className="hidden lg:block lg:col-span-3 lg:row-span-6">
              <ConversationHistorySidebar 
                agentId={selectedAgent} 
                language={language} 
              />
            </div>
            
            {/* Mini Dashboard */}
            <div className="hidden lg:block lg:col-span-2 lg:row-span-2">
              <AgentMiniDashboard 
                agentId={selectedAgent} 
                language={language} 
              />
            </div>
            
            {/* Quick Actions */}
            <div className="hidden lg:block lg:col-span-2 lg:row-span-2">
              <AgentQuickActions 
                agentId={selectedAgent} 
                language={language} 
              />
            </div>
            
            {/* Additional Tools */}
            <div className="hidden lg:block lg:col-span-2 lg:row-span-2">
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 h-full p-4">
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
    </div>
  );
};
