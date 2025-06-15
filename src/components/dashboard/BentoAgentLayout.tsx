
import React, { useState } from 'react';
import { useAgentConversations } from '@/hooks/useAgentConversations';
import { ConversationHistorySidebar } from './ConversationHistorySidebar';
import { AgentMiniDashboard } from './AgentMiniDashboard';
import { ModernFloatingAgentChat } from './ModernFloatingAgentChat';
import { AgentQuickActions } from './AgentQuickActions';
import { CollapsibleMoreTools } from './CollapsibleMoreTools';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { MessageSquare, BarChart3, Zap, Menu, Plus, PanelLeftClose, PanelRightClose, ListTodo } from 'lucide-react';
import { AgentTasksPanel } from './AgentTasksPanel';

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
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [sidebarTab, setSidebarTab] = useState<'conversations' | 'tasks'>('conversations');

  const conversationManager = useAgentConversations(selectedAgent);

  const t = {
    en: {
      chat: "Chat",
      conversations: "History", 
      dashboard: "Stats",
      actions: "Actions",
      tasks: "Tasks"
    },
    es: {
      chat: "Chat",
      conversations: "Historial",
      dashboard: "Stats", 
      actions: "Acciones",
      tasks: "Tareas"
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
    <div className="h-full w-full flex gap-4 p-4">
      {/* Sidebar */}
      <div className={`h-full transition-all duration-300 ease-in-out flex-shrink-0 ${isSidebarCollapsed ? 'w-[68px]' : 'w-[340px]'}`}>
        {isSidebarCollapsed ? (
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 h-full p-2 flex flex-col items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => setIsSidebarCollapsed(false)} className="text-white hover:bg-white/10 w-full">
              <PanelRightClose className="w-5 h-5" />
            </Button>
            <div className="flex-1 flex flex-col gap-2 w-full mt-2">
              <Button
                variant={sidebarTab === 'conversations' ? 'secondary' : 'ghost'}
                size="icon"
                onClick={() => setSidebarTab('conversations')}
                className={`text-white w-full h-12 ${sidebarTab === 'conversations' ? 'bg-purple-500/30' : 'hover:bg-white/10'}`}
                title={t[language].conversations}
              >
                <MessageSquare className="w-5 h-5" />
              </Button>
              <Button
                variant={sidebarTab === 'tasks' ? 'secondary' : 'ghost'}
                size="icon"
                onClick={() => setSidebarTab('tasks')}
                className={`text-white w-full h-12 ${sidebarTab === 'tasks' ? 'bg-blue-500/30' : 'hover:bg-white/10'}`}
                title={t[language].tasks}
              >
                <ListTodo className="w-5 h-5" />
              </Button>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={conversationManager.startNewConversation}
              className="text-white bg-purple-600 hover:bg-purple-700 w-full h-12"
              title="New Chat"
            >
              <Plus className="w-5 h-5" />
            </Button>
          </div>
        ) : (
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 h-full flex flex-col p-3">
            <div className="flex items-center justify-between mb-3 flex-shrink-0">
              <div className="flex items-center gap-1 p-1 bg-black/20 rounded-lg">
                <Button 
                  size="sm" 
                  onClick={() => setSidebarTab('conversations')}
                  className={`text-xs px-3 py-1 h-auto transition-colors ${sidebarTab === 'conversations' ? 'bg-purple-600 text-white' : 'bg-transparent text-white/70 hover:bg-white/10'}`}
                >
                  <MessageSquare className="w-3 h-3 mr-2"/>
                  {t[language].conversations}
                </Button>
                <Button 
                  size="sm" 
                  onClick={() => setSidebarTab('tasks')}
                  className={`text-xs px-3 py-1 h-auto transition-colors ${sidebarTab === 'tasks' ? 'bg-blue-600 text-white' : 'bg-transparent text-white/70 hover:bg-white/10'}`}
                >
                  <ListTodo className="w-3 h-3 mr-2"/>
                  {t[language].tasks}
                </Button>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsSidebarCollapsed(true)} className="text-white hover:bg-white/10">
                <PanelLeftClose className="w-5 h-5" />
              </Button>
            </div>
            <div className="flex-1 min-h-0">
              {sidebarTab === 'conversations' ? (
                <ConversationHistorySidebar
                  agentId={selectedAgent}
                  language={language}
                  conversations={conversationManager.conversations}
                  currentConversationId={conversationManager.currentConversationId}
                  selectConversation={conversationManager.selectConversation}
                  startNewConversation={conversationManager.startNewConversation}
                  loading={conversationManager.loading}
                />
              ) : (
                <AgentTasksPanel 
                  agentId={selectedAgent} 
                  language={language}
                />
              )}
            </div>
          </div>
        )}
      </div>

      {/* Main chat */}
      <div className="flex-1 h-full min-w-0">
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
      <div className="w-[340px] h-full flex flex-col gap-4 flex-shrink-0">
        <div className="flex-1 min-h-0">
          <AgentMiniDashboard agentId={selectedAgent} language={language} />
        </div>
        <div className="flex-1 min-h-0">
          <AgentQuickActions agentId={selectedAgent} language={language} />
        </div>
        <div className="flex-1 min-h-0">
          <CollapsibleMoreTools language={language} agentId={selectedAgent} />
        </div>
      </div>
    </div>
  );
};
