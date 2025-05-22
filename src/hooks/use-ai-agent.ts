
import { useState } from 'react';
import { Message } from '@/types/chat';
import { useToast } from '@/hooks/use-toast';
import { supabaseClient } from '@/lib/supabase-client';

// Define agent types and their system prompts
export const agentSystemPrompts: Record<string, string> = {
  admin: "You are an Administrative Assistant AI. You help users organize their files, manage appointments, and handle correspondence. Be professional, efficient, and helpful. Focus on organizational tasks, scheduling, and administrative support. Provide clear and concise responses.",
  
  accounting: "You are an Accounting Agent AI. You help users track expenses, prepare for tax filings, and manage financial records. Be precise, detail-oriented, and knowledgeable about financial regulations. Focus on financial management, tax preparation, and budget planning. Provide accurate calculations and clear financial advice.",
  
  legal: "You are a Legal Advisor AI. You help users understand legal requirements, review contracts, and manage compliance issues. Be professional, precise, and cautious in your advice. Always clarify that you provide general guidance, not legal representation. Focus on contract reviews, regulatory compliance, and legal document preparation.",
  
  operations: "You are an Operations Manager AI. You help users streamline business processes, manage workflows, and optimize productivity. Be practical, efficient, and solutions-oriented. Focus on process improvement, team coordination, and operational efficiency. Provide actionable recommendations for business operations.",
  
  cultural: "You are a Cultural Creator Agent AI. You help artists, performers, and cultural organizations with contracts, cost calculations, portfolio creation, and export strategies. Be creative, supportive, and knowledgeable about the cultural sector. Focus on the specific needs of cultural creators, including project management, grant applications, and audience development.",
  
  // Add a specific system prompt for the contract-generator agent
  "contract-generator": "You are a Contract Generator AI specialized in cultural projects. You help artists, performers, and cultural organizations draft professional contracts. Be detailed, precise, and knowledgeable about intellectual property rights, payment terms, and cultural industry standards. Focus on creating clear agreements that protect the creator's interests while being fair to all parties. Provide explanations for important contract clauses and suggest additions based on the specific project context. Respond in the same language the user is using."
};

// Agent ID mapping to associate dashboard agent IDs with system prompt types
export const agentIdMapping: Record<string, string> = {
  "contract-generator": "contract-generator",
  "cost-calculator": "accounting",
  "maturity-evaluator": "operations"
};

export function useAIAgent(agentType: string = 'admin') {
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
      // Map dashboard agent IDs to system prompt types if needed
      const mappedAgentType = agentIdMapping[agentType] || agentType;
      
      // Get the system prompt for the selected agent
      const systemPrompt = agentSystemPrompts[mappedAgentType] || agentSystemPrompts.admin;
      
      // Call Supabase Edge Function for OpenAI integration
      const { data, error } = await supabaseClient.functions.invoke('openai-chat', {
        body: {
          systemPrompt,
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
        throw new Error(error.message || 'Error communicating with AI service');
      }
      
      if (!data || !data.choices || !data.choices[0]?.message) {
        throw new Error('Invalid response from AI service');
      }
      
      // Add AI response
      const aiResponse = data.choices[0].message.content || 'Lo siento, no pude generar una respuesta.';
      const aiMessage: Message = { type: 'agent', content: aiResponse };
      setMessages(prev => [...prev, aiMessage]);
      
    } catch (error) {
      console.error('Error generating AI response:', error);
      
      // More descriptive error messages
      let errorMessage = 'No se pudo generar una respuesta. Por favor intenta de nuevo.';
      
      if (error.message?.includes('API key')) {
        errorMessage = 'API key error. Please check your OpenAI API key configuration.';
      } else if (error.message?.includes('429')) {
        errorMessage = 'Rate limit exceeded. Please try again later.';
      } else if (error.message?.includes('network')) {
        errorMessage = 'Network error. Please check your internet connection.';
      }
      
      toast({
        title: 'Error',
        description: errorMessage,
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
