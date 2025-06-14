import React, { useState, useCallback, useEffect } from 'react';
import { AgentMessage } from '@/hooks/useAgentConversations';
import { useAIAgent } from '@/hooks/use-ai-agent';
import { useToast } from '@/hooks/use-toast';
import { ChatHeader } from './chat/ChatHeader';
import { ChatWelcomeScreen } from './chat/ChatWelcomeScreen';
import { ChatMessagesArea } from './chat/ChatMessagesArea';
import { ChatInputBar } from './chat/ChatInputBar';

interface ModernFloatingAgentChatProps {
  agentId: string;
  language: 'en' | 'es';
  onBack?: () => void;
  showHeader?: boolean;
  messages: AgentMessage[];
  currentConversationId: string | null;
  isProcessing: boolean;
  messagesLoading: boolean;
  setIsProcessing: (isProcessing: boolean) => void;
  createConversation: (firstMessage: string) => Promise<string | null>;
  addMessage: (conversationId: string, content: string, messageType: 'user' | 'agent') => Promise<any>;
}

export const ModernFloatingAgentChat: React.FC<ModernFloatingAgentChatProps> = ({
  agentId,
  language,
  onBack,
  showHeader = false,
  messages,
  currentConversationId,
  isProcessing,
  messagesLoading,
  setIsProcessing,
  createConversation,
  addMessage,
}) => {
  const [inputMessage, setInputMessage] = useState('');
  const { toast } = useToast();
  
  const { sendMessage: sendAIMessage } = useAIAgent(agentId);

  // Fixed logic: we're in new chat state when there's no conversation AND no messages
  // OR when we explicitly have no conversation selected
  const isNewChat = !currentConversationId && messages.length === 0;

  // Log state for debugging
  useEffect(() => {
    console.log('ModernFloatingAgentChat state:', {
      agentId,
      currentConversationId,
      messagesCount: messages.length,
      isNewChat,
      isProcessing,
      messagesLoading,
      showHeader
    });
  }, [agentId, currentConversationId, messages.length, isNewChat, isProcessing, messagesLoading, showHeader]);

  const handleSendMessage = useCallback(async (message: string) => {
    if (!message.trim() || isProcessing) return;

    const messageContent = message.trim();
    setIsProcessing(true);

    try {
      let conversationId = currentConversationId;
      
      if (!conversationId) {
        console.log('Creating new conversation...');
        conversationId = await createConversation(messageContent);
        if (!conversationId) {
          throw new Error('Failed to create conversation');
        }
        console.log('New conversation created:', conversationId);
      }

      console.log('Adding user message...');
      await addMessage(conversationId, messageContent, 'user');
      
      console.log('Sending message to AI...');
      const aiResponse = await sendAIMessage(messageContent);
      
      if (aiResponse) {
        console.log('Adding AI response...');
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
  }, [isProcessing, currentConversationId, createConversation, addMessage, sendAIMessage, setIsProcessing, toast]);

  const handleFormSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isProcessing) return;
    
    await handleSendMessage(inputMessage);
    setInputMessage('');
  }, [inputMessage, isProcessing, handleSendMessage]);

  // Show loading state for messages
  if (messagesLoading) {
    return (
      <div className="flex flex-col h-full bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
        {showHeader && (
          <ChatHeader 
            agentId={agentId}
            language={language}
            onBack={onBack}
            showHeader={showHeader}
          />
        )}
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
      {showHeader && (
        <ChatHeader 
          agentId={agentId}
          language={language}
          onBack={onBack}
          showHeader={showHeader}
        />
      )}

      {isNewChat ? (
        <ChatWelcomeScreen
          agentId={agentId}
          agentName="Asistente IA"
          language={language}
          onSendMessage={handleSendMessage}
        />
      ) : (
        <>
          <ChatMessagesArea
            messages={messages}
            isProcessing={isProcessing}
            language={language}
          />

          <ChatInputBar
            inputMessage={inputMessage}
            isProcessing={isProcessing}
            language={language}
            onInputChange={setInputMessage}
            onSubmit={handleFormSubmit}
          />
        </>
      )}
    </div>
  );
};
