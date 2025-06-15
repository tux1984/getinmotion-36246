
import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useAIAssistant } from '@/hooks/useAIAssistant';
import { AIAssistantButton } from './AIAssistantButton';
import { AIAssistantChatPanel } from './AIAssistantChatPanel';

interface AIAssistantProps {
  stepContext: string;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({ stepContext }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { language } = useLanguage();
  const { messages, isLoading, sendMessage } = useAIAssistant(stepContext);

  const toggleChat = () => setIsOpen(!isOpen);

  return (
    <>
      <AIAssistantButton isOpen={isOpen} onClick={toggleChat} />
      <AIAssistantChatPanel
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        messages={messages}
        sendMessage={sendMessage}
        isLoading={isLoading}
        language={language}
      />
    </>
  );
};
