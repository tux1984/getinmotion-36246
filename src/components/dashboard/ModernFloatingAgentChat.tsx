
import React, { useState, useCallback, useEffect } from 'react';
import { useAgentConversations } from '@/hooks/useAgentConversations';
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
}

export const ModernFloatingAgentChat: React.FC<ModernFloatingAgentChatProps> = ({
  agentId,
  language,
  onBack
}) => {
  const [inputMessage, setInputMessage] = useState('');
  const { toast } = useToast();
  
  const {
    messages,
    currentConversationId,
    isProcessing,
    messagesLoading,
    setIsProcessing,
    createConversation,
    addMessage
  } = useAgentConversations(agentId);
  
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
      messagesLoading
    });
  }, [agentId, currentConversationId, messages.length, isNewChat, isProcessing, messagesLoading]);

  const handleSendMessage = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isProcessing) return;

    const messageContent = inputMessage.trim();
    setInputMessage('');
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
  }, [inputMessage, isProcessing, currentConversationId, createConversation, addMessage, sendAIMessage, setIsProcessing, toast]);

  // Show loading state for messages
  if (messagesLoading) {
    return (
      <div className="flex flex-col h-full bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
        <ChatHeader 
          agentId={agentId}
          language={language}
          onBack={onBack}
        />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
      <ChatHeader 
        agentId={agentId}
        language={language}
        onBack={onBack}
      />

      {isNewChat ? (
        <ChatWelcomeScreen
          language={language}
          inputMessage={inputMessage}
          isProcessing={isProcessing}
          onInputChange={setInputMessage}
          onSubmit={handleSendMessage}
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
            onSubmit={handleSendMessage}
          />
        </>
      )}
    </div>
  );
};
