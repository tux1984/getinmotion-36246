
import React, { useState, useRef, useEffect } from 'react';
import { ModernChatSidebar } from './ModernChatSidebar';
import { ModernChatInput } from './ModernChatInput';
import { ModernMessageBubble } from './ModernMessageBubble';
import { useIsMobile } from '@/hooks/use-mobile';
import { useLanguage } from '@/context/LanguageContext';
import { Message } from '@/types/chat';
import { useAIAgent } from '@/hooks/use-ai-agent';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ModernChatInterfaceProps {
  agentId?: string;
  agentName?: string;
  agentColor?: string;
  agentIcon?: React.ReactNode;
  onClose?: () => void;
}

export const ModernChatInterface = ({ 
  agentId = 'admin',
  agentName = 'AI Assistant',
  agentColor = 'bg-violet-100 text-violet-700',
  agentIcon,
  onClose 
}: ModernChatInterfaceProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const { language } = useLanguage();
  const { messages, isProcessing, sendMessage, clearMessages } = useAIAgent(agentId);

  const t = {
    en: {
      placeholder: "Type your message...",
      send: "Send",
      menu: "Menu",
      close: "Close",
      emptyState: "Start a conversation",
      emptySubtext: "Ask me anything to get started"
    },
    es: {
      placeholder: "Escribe tu mensaje...",
      send: "Enviar",
      menu: "Menú",
      close: "Cerrar",
      emptyState: "Iniciar conversación",
      emptySubtext: "Pregúntame lo que quieras para empezar"
    }
  };

  const translations = t[language];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || isProcessing) return;
    
    await sendMessage(content);
    setInputMessage('');
    
    // Close sidebar on mobile after sending
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen w-full bg-slate-50 relative">
      {/* Sidebar */}
      <ModernChatSidebar 
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        agentId={agentId}
        agentName={agentName}
        agentColor={agentColor}
        agentIcon={agentIcon}
        messages={messages}
        onClearMessages={clearMessages}
        isMobile={isMobile}
      />

      {/* Mobile overlay */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main chat area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSidebar}
              className="text-slate-600 hover:text-slate-900"
            >
              <Menu className="w-5 h-5" />
              <span className="sr-only">{translations.menu}</span>
            </Button>
            
            <div className="flex items-center gap-2">
              {agentIcon && (
                <div className={`w-8 h-8 rounded-full ${agentColor} flex items-center justify-center`}>
                  {agentIcon}
                </div>
              )}
              <h1 className="font-semibold text-slate-900">{agentName}</h1>
            </div>
          </div>

          {onClose && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-slate-600 hover:text-slate-900"
            >
              <X className="w-5 h-5" />
              <span className="sr-only">{translations.close}</span>
            </Button>
          )}
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center max-w-sm mx-auto px-4">
                {agentIcon && (
                  <div className={`w-16 h-16 rounded-full ${agentColor} flex items-center justify-center mx-auto mb-4 opacity-50`}>
                    {agentIcon}
                  </div>
                )}
                <h2 className="text-xl font-semibold text-slate-700 mb-2">
                  {translations.emptyState}
                </h2>
                <p className="text-slate-500">
                  {translations.emptySubtext}
                </p>
              </div>
            </div>
          ) : (
            <div className="p-4 space-y-4">
              {messages.map((message, index) => (
                <ModernMessageBubble
                  key={index}
                  message={message}
                  agentColor={agentColor}
                  agentIcon={agentIcon}
                />
              ))}
              
              {isProcessing && (
                <ModernMessageBubble
                  message={{ type: 'agent', content: '' }}
                  agentColor={agentColor}
                  agentIcon={agentIcon}
                  isLoading={true}
                />
              )}
              
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input area */}
        <div className="bg-white border-t border-slate-200 p-4">
          <ModernChatInput
            value={inputMessage}
            onChange={setInputMessage}
            onSend={handleSendMessage}
            placeholder={translations.placeholder}
            sendText={translations.send}
            disabled={isProcessing}
          />
        </div>
      </div>
    </div>
  );
};
