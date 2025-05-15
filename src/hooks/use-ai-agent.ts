
import { useState } from 'react';
import { Message } from '@/types/chat';
import { useToast } from '@/hooks/use-toast';

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
      // In a production app, you would call an API here
      // For this demo, we'll simulate a response
      setTimeout(() => {
        const aiResponse = generateSimpleResponse(content);
        const aiMessage: Message = { type: 'ai', content: aiResponse };
        setMessages(prev => [...prev, aiMessage]);
        setIsProcessing(false);
      }, 1000);
      
    } catch (error) {
      console.error('Error generating AI response:', error);
      toast({
        title: 'Error',
        description: 'No se pudo generar una respuesta. Por favor intenta de nuevo.',
        variant: 'destructive',
      });
      setIsProcessing(false);
    }
  };

  const clearMessages = () => {
    setMessages([]);
  };

  // Simple response generator - replace with actual AI API call
  const generateSimpleResponse = (userMessage: string): string => {
    const lowerCaseMessage = userMessage.toLowerCase();
    
    if (lowerCaseMessage.includes('hola') || lowerCaseMessage.includes('hi') || lowerCaseMessage.includes('hello')) {
      return '¡Hola! Soy tu asistente de IA. ¿En qué puedo ayudarte hoy?';
    }
    
    if (lowerCaseMessage.includes('ayuda') || lowerCaseMessage.includes('help')) {
      return 'Estoy aquí para ayudarte. Puedes preguntarme sobre tus proyectos, tareas o cualquier otra cosa que necesites.';
    }
    
    if (lowerCaseMessage.includes('gracias') || lowerCaseMessage.includes('thanks')) {
      return '¡De nada! Estoy aquí para lo que necesites.';
    }

    if (lowerCaseMessage.includes('proyecto') || lowerCaseMessage.includes('project')) {
      return 'Para gestionar tus proyectos de manera eficiente, te recomendaría establecer metas claras, dividir el trabajo en tareas pequeñas y usar herramientas de seguimiento. ¿Te gustaría que profundice en algún aspecto específico?';
    }
    
    return '¡Interesante! ¿Puedes decirme más sobre eso para poder ayudarte mejor?';
  };

  return {
    messages,
    isProcessing,
    sendMessage,
    clearMessages
  };
}
