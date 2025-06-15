import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { v4 as uuidv4 } from 'uuid';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export const useAIAssistant = (stepContext: string, questionId: string, questionTitle?: string) => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState('');

  useEffect(() => {
    if (questionId) {
      const newSessionId = `${stepContext}-${questionId}`;
      setSessionId(newSessionId);
      setMessages([]); // Reset messages for new question
    }
  }, [questionId, stepContext]);

  const saveMessage = async (message: ChatMessage) => {
    if (!sessionId) return;
    const { error } = await supabase.from('user_chat_context').insert({
      user_id: user?.id,
      session_id: sessionId,
      message: message.content,
      role: message.role,
      step_context: stepContext,
      question_id: questionId
    });
    if (error) {
      console.error('Error saving chat message:', error);
    }
  };

  const sendMessage = useCallback(async (content: string) => {
    if (!sessionId) return;

    const userMessage: ChatMessage = { role: 'user', content };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    await saveMessage(userMessage);
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('chat-assistant', {
        body: { 
          messages: newMessages, 
          language,
          questionContext: {
            id: questionId,
            title: questionTitle
          }
        },
      });

      if (error) throw error;

      const assistantMessage: ChatMessage = { role: 'assistant', content: data.response };
      setMessages(prev => [...prev, assistantMessage]);
      await saveMessage(assistantMessage);

    } catch (error) {
      console.error("Error calling chat-assistant function:", error);
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: language === 'es' ? 'Lo siento, no puedo responder en este momento.' : "I'm sorry, I can't respond right now."
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [messages, language, user, sessionId, stepContext, questionId, questionTitle]);

  return { messages, isLoading, sendMessage };
};
