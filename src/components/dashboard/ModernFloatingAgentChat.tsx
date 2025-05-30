
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Bot, User, ArrowLeft } from 'lucide-react';
import { useAgentConversations } from '@/hooks/useAgentConversations';
import { useAIAgent } from '@/hooks/use-ai-agent';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { getAgentById } from '@/data/agentsDatabase';
import { MotionLogo } from '@/components/MotionLogo';

interface ModernFloatingAgentChatProps {
  agentId: string;
  language: 'en' | 'es';
  onBack?: () => void;
}

export const ModernFloatingAgentChat: React.FC<ModernFloatingAgentChatProps> = ({
  agentId,
  language,
  onBack
}) => {
  const [inputMessage, setInputMessage] = useState('');
  const [chatStarted, setChatStarted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  const {
    conversations,
    messages,
    currentConversationId,
    loading,
    isProcessing,
    setIsProcessing,
    createConversation,
    addMessage,
    selectConversation,
    startNewConversation
  } = useAgentConversations(agentId);
  
  const { sendMessage: sendAIMessage } = useAIAgent(agentId);

  // Get agent data
  const agent = getAgentById(agentId);
  const agentName = agent?.name || 'AI Assistant';

  const t = {
    en: {
      typeMessage: "Ask me anything...",
      send: "Send",
      thinking: "Thinking...",
      startConversation: "Start a conversation",
      backToDashboard: "Back to Dashboard"
    },
    es: {
      typeMessage: "Pregúntame lo que quieras...",
      send: "Enviar",
      thinking: "Pensando...",
      startConversation: "Iniciar conversación",
      backToDashboard: "Volver al Dashboard"
    }
  };

  useEffect(() => {
    if (messages.length > 0) {
      setChatStarted(true);
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isProcessing) return;

    const messageContent = inputMessage.trim();
    setInputMessage('');
    setIsProcessing(true);
    setChatStarted(true);

    try {
      let conversationId = currentConversationId;
      
      if (!conversationId) {
        conversationId = await createConversation(messageContent);
        if (!conversationId) {
          throw new Error('Failed to create conversation');
        }
      }

      await addMessage(conversationId, messageContent, 'user');
      const aiResponse = await sendAIMessage(messageContent);
      
      if (aiResponse) {
        await addMessage(conversationId, aiResponse, 'agent');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Error',
        description: 'No se pudo enviar el mensaje',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex flex-col h-full bg-white/5 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl overflow-hidden">
      {/* Internal Header */}
      <div className="bg-white/10 backdrop-blur-xl border-b border-white/20 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MotionLogo variant="light" size="sm" />
            <div>
              <h2 className="text-lg font-semibold text-white">{agentName}</h2>
              <p className="text-sm text-purple-200">{agent?.description}</p>
            </div>
          </div>
          
          {onBack && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onBack}
              className="text-white hover:bg-white/10 rounded-xl"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t[language].backToDashboard}
            </Button>
          )}
        </div>
      </div>

      {!chatStarted && messages.length === 0 ? (
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-2xl mx-auto">
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center mx-auto mb-4">
                <Bot className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {language === 'en' ? 'AI Assistant Ready' : 'Asistente IA Listo'}
              </h3>
              <p className="text-purple-200">
                {language === 'en' 
                  ? 'What would you like to discuss today?' 
                  : '¿De qué te gustaría hablar hoy?'
                }
              </p>
            </div>
            
            <form onSubmit={handleSendMessage} className="space-y-4">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={t[language].typeMessage}
                className="bg-white/10 backdrop-blur border-white/20 text-white placeholder:text-purple-300 focus:border-purple-400"
                disabled={isProcessing}
              />
              <Button 
                type="submit" 
                disabled={!inputMessage.trim() || isProcessing}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium"
              >
                <Send className="w-4 h-4 mr-2" />
                {t[language].startConversation}
              </Button>
            </form>
          </div>
        </div>
      ) : (
        <>
          {/* Messages Area */}
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full p-6">
              <div className="space-y-6 max-w-4xl mx-auto">
                {messages.map((message) => (
                  <div 
                    key={message.id}
                    className={`flex ${message.message_type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className="flex items-start gap-4 max-w-[80%]">
                      {message.message_type !== 'user' && (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 text-white flex items-center justify-center mt-1 shadow-lg">
                          <Bot className="w-5 h-5" />
                        </div>
                      )}
                      
                      <div 
                        className={`p-4 rounded-2xl shadow-lg backdrop-blur-sm ${
                          message.message_type === 'user' 
                            ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white' 
                            : 'bg-white/10 text-white border border-white/20'
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{message.content}</p>
                        <div className="text-xs opacity-70 mt-2">
                          {formatDistanceToNow(new Date(message.created_at), { 
                            addSuffix: true,
                            locale: language === 'es' ? es : undefined
                          })}
                        </div>
                      </div>
                      
                      {message.message_type === 'user' && (
                        <div className="w-10 h-10 rounded-full bg-white/20 text-white flex items-center justify-center mt-1 backdrop-blur shadow-lg">
                          <User className="w-5 h-5" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                {isProcessing && (
                  <div className="flex justify-start">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 text-white flex items-center justify-center mt-1 shadow-lg">
                        <Bot className="w-5 h-5" />
                      </div>
                      <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 shadow-lg">
                        <div className="flex space-x-2 items-center">
                          <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></div>
                          <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse delay-150"></div>
                          <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse delay-300"></div>
                          <span className="text-xs text-purple-300 ml-2">
                            {t[language].thinking}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
          </div>

          {/* Fixed Input Bar at Bottom */}
          <div className="p-4">
            <div className="max-w-4xl mx-auto">
              <form onSubmit={handleSendMessage}>
                <div className="flex gap-3 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl p-3">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder={t[language].typeMessage}
                    className="flex-grow bg-transparent border-none text-white placeholder:text-purple-300 focus:ring-0 focus:border-none"
                    disabled={isProcessing}
                  />
                  <Button 
                    type="submit" 
                    disabled={!inputMessage.trim() || isProcessing}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl px-6"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
