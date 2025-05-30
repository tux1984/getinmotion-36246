
import React, { useState, useEffect } from 'react';
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
  const [chatStarted, setChatStarted] = useState(false);
  const { toast } = useToast();
  
  const {
    messages,
    currentConversationId,
    isProcessing,
    setIsProcessing,
    createConversation,
    addMessage
  } = useAgentConversations(agentId);
  
  const { sendMessage: sendAIMessage } = useAIAgent(agentId);

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

  return (
    <div className="flex flex-col h-full">
      <ChatHeader 
        agentId={agentId}
        language={language}
        onBack={onBack}
      />

      {!chatStarted && messages.length === 0 ? (
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
