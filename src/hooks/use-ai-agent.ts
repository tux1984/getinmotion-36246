
import { useState } from 'react';
import { Message } from '@/types/chat';
import { useToast } from '@/hooks/use-toast';
import { supabaseClient } from '@/lib/supabase-client';

export function useAIAgent() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;
    
    // Add user message
    const userMessage: Message = { type: 'user', content };
    setMessages(prev => [...prev, userMessage]);
    
    setIsProcessing(true);
    
    try {
      // Call Supabase Edge Function for OpenAI integration
      const { data, error } = await supabaseClient.functions.invoke('openai-chat', {
        body: {
          messages: [
            ...messages.map(msg => ({
              role: msg.type === 'user' ? 'user' : 'assistant',
              content: msg.content
            })),
            { role: 'user', content }
          ]
        }
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      // Add AI response
      const aiResponse = data.choices?.[0]?.message?.content || 'Lo siento, no pude generar una respuesta.';
      const aiMessage: Message = { type: 'ai', content: aiResponse };
      setMessages(prev => [...prev, aiMessage]);
      
    } catch (error) {
      console.error('Error generating AI response:', error);
      toast({
        title: 'Error',
        description: 'No se pudo generar una respuesta. Por favor intenta de nuevo.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const clearMessages = () => {
    setMessages([]);
  };

  return {
    messages,
    isProcessing,
    sendMessage,
    clearMessages
  };
}
