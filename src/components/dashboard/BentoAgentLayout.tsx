
import React, { useState } from 'react';
import { useAgentConversations } from '@/hooks/useAgentConversations';
import { ConversationHistorySidebar } from './ConversationHistorySidebar';
import { AgentMiniDashboard } from './AgentMiniDashboard';
import { ModernFloatingAgentChat } from './ModernFloatingAgentChat';
import { AgentQuickActions } from './AgentQuickActions';
import { CollapsibleMoreTools } from './CollapsibleMoreTools';
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

  const conversationManager = useAgentConversations(selectedAgent);

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
        <div className="flex flex-col max-h-[85vh]">
          {/* Main content area with tab switching - sin header interno */}
          <div className="flex-1 mx-4 mb-20 bg-transparent backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden">
            {activeTab === 'chat' && (
              <ModernFloatingAgentChat
                agentId={selectedAgent}
                language={language}
                showHeader={false}
                messages={conversationManager.messages}
                currentConversationId={conversationManager.currentConversationId}
                isProcessing={conversationManager.isProcessing}
                messagesLoading={conversationManager.messagesLoading}
                setIsProcessing={conversationManager.setIsProcessing}
                createConversation={conversationManager.createConversation}
                addMessage={conversationManager.addMessage}
              />
            )}
            
            {activeTab === 'conversations' && (
              <div className="h-full p-4">
                <ConversationHistorySidebar
                  agentId={selectedAgent}
                  language={language}
                  conversations={conversationManager.conversations}
                  currentConversationId={conversationManager.currentConversationId}
                  selectConversation={conversationManager.selectConversation}
                  startNewConversation={conversationManager.startNewConversation}
                  loading={conversationManager.loading}
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
    <div className="h-full w-full grid grid-cols-1 md:grid-cols-12 gap-4 p-4">
      {/* Sidebar */}
      <div className="md:col-span-3 h-full">
        <ConversationHistorySidebar
          agentId={selectedAgent}
          language={language}
          conversations={conversationManager.conversations}
          currentConversationId={conversationManager.currentConversationId}
          selectConversation={conversationManager.selectConversation}
          startNewConversation={conversationManager.startNewConversation}
          loading={conversationManager.loading}
        />
      </div>

      {/* Main chat */}
      <div className="md:col-span-6 h-full">
        <ModernFloatingAgentChat
          agentId={selectedAgent}
          language={language}
          onBack={onBack}
          showHeader={true}
          messages={conversationManager.messages}
          currentConversationId={conversationManager.currentConversationId}
          isProcessing={conversationManager.isProcessing}
          messagesLoading={conversationManager.messagesLoading}
          setIsProcessing={conversationManager.setIsProcessing}
          createConversation={conversationManager.createConversation}
          addMessage={conversationManager.addMessage}
        />
      </div>

      {/* Right widgets */}
      <div className="md:col-span-3 h-full flex flex-col gap-4">
        <div className="flex-1">
          <AgentMiniDashboard agentId={selectedAgent} language={language} />
        </div>
        <div className="flex-1">
          <AgentQuickActions agentId={selectedAgent} language={language} />
        </div>
        <div className="flex-1">
          <CollapsibleMoreTools language={language} agentId={selectedAgent} />
        </div>
      </div>
    </div>
  );
};
