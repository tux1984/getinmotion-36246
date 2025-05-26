
import { useState } from 'react';
import { Message } from '@/types/chat';
import { useToast } from '@/hooks/use-toast';
import { supabaseClient } from '@/lib/supabase-client';

// Define agent types and their system prompts
export const agentSystemPrompts: Record<string, string> = {
  admin: "You are an Administrative Assistant AI. You help users organize their files, manage appointments, and handle correspondence. Be professional, efficient, and helpful. Focus on organizational tasks, scheduling, and administrative support. Provide clear and concise responses.",
  
  accounting: "You are an Accounting Agent AI specialized in cultural and creative industries. You help artists, craftspeople, and cultural entrepreneurs track expenses, prepare for tax filings, and manage financial records. Be precise, detail-oriented, and knowledgeable about financial regulations that apply to the cultural sector. Focus on financial management, tax preparation for creative professionals, and budget planning for cultural projects. Provide accurate calculations and clear financial advice tailored to creative businesses.",
  
  legal: "You are a Legal Advisor AI specialized in cultural industries. You help cultural creators understand legal requirements for their projects, review contracts for exhibitions/performances, and manage intellectual property issues. Be professional, precise, and tailored to the cultural sector. Always clarify that you provide general guidance, not legal representation. Focus on contract reviews for cultural projects, copyright and IP rights, and legal compliance specific to cultural organizations.",
  
  operations: "You are an Operations Manager AI focused on cultural projects. You help creative professionals streamline processes, manage creative workflows, and optimize productivity for cultural initiatives. Be practical, efficient, and solutions-oriented with a focus on the unique challenges of cultural production. Focus on process improvement for creative teams, coordination of cultural projects, and operational efficiency for cultural organizations.",
  
  cultural: "You are a Cultural Creator Agent AI. You help artists, performers, craftspeople, and cultural organizations with contracts, cost calculations, portfolio creation, and export strategies. Be creative, supportive, and knowledgeable about the cultural sector. Focus on the specific needs of cultural creators, including project management, grant applications, audience development, and creative industry best practices.",
  
  // Add a specific system prompt for the contract-generator agent
  "contract-generator": "You are a Contract Generator AI specialized in cultural projects. You help artists, performers, and cultural organizations draft professional contracts. Be detailed, precise, and knowledgeable about intellectual property rights, payment terms, and cultural industry standards. Focus on creating clear agreements that protect the creator's interests while being fair to all parties. Provide explanations for important contract clauses and suggest additions based on the specific project context. Respond in the same language the user is using.",

  // Add a specific system prompt for the cost-calculator agent
  "cost-calculator": "You are a Cost Calculator AI specialized in cultural projects. You help cultural creators calculate project costs, set appropriate prices for their work, and develop financial plans. Be precise, practical, and knowledgeable about cultural sector economics. Focus on helping users properly value their creative work, account for all direct and indirect costs, and establish sustainable pricing strategies. Provide specific calculations and formulas tailored to different types of cultural work. Respond in the same language the user is using."
};

// Agent ID mapping to associate dashboard agent IDs with system prompt types
export const agentIdMapping: Record<string, string> = {
  "contract-generator": "contract-generator",
  "cost-calculator": "cost-calculator",
  "maturity-evaluator": "operations"
};

export function useAIAgent(agentType: string = 'admin') {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;
    
    console.log('=== AI Agent Debug Info ===');
    console.log('Sending message:', content);
    console.log('Agent type:', agentType);
    
    // Add user message
    const userMessage: Message = { type: 'user', content };
    setMessages(prev => [...prev, userMessage]);
    
    setIsProcessing(true);
    
    try {
      // Map dashboard agent IDs to system prompt types if needed
      const mappedAgentType = agentIdMapping[agentType] || agentType;
      
      // Get the system prompt for the selected agent
      const systemPrompt = agentSystemPrompts[mappedAgentType] || agentSystemPrompts.admin;
      
      console.log('Using system prompt for agent:', mappedAgentType);
      console.log('System prompt length:', systemPrompt.length);
      
      // Prepare messages for API - convert our message format to OpenAI format
      const apiMessages = [
        ...messages.map(msg => ({
          role: msg.type === 'user' ? 'user' : 'assistant',
          content: msg.content
        })),
        { role: 'user', content }
      ];
      
      console.log('API Messages being sent:', apiMessages);
      console.log('Total messages count:', apiMessages.length);
      
      // Call Supabase Edge Function for OpenAI integration
      console.log('Calling Supabase edge function...');
      const { data, error } = await supabaseClient.functions.invoke('openai-chat', {
        body: {
          systemPrompt,
          messages: apiMessages
        }
      });
      
      console.log('Supabase response received');
      console.log('Data:', data);
      console.log('Error:', error);
      
      if (error) {
        console.error('Supabase error details:', error);
        throw new Error(error.message || 'Error communicating with AI service');
      }
      
      if (!data) {
        console.error('No data received from API');
        throw new Error('No response received from AI service');
      }
      
      // Check if we got an error response from the edge function
      if (data.error) {
        console.error('Edge function returned error:', data.error);
        throw new Error(data.error);
      }
      
      if (!data.choices || !data.choices[0]?.message) {
        console.error('Invalid response structure from OpenAI:', data);
        throw new Error('Invalid response from AI service');
      }
      
      // Add AI response
      const aiResponse = data.choices[0].message.content || 'I apologize, but I couldn\'t generate a response.';
      const aiMessage: Message = { type: 'agent', content: aiResponse };
      setMessages(prev => [...prev, aiMessage]);
      
      console.log('AI Response received:', aiResponse.substring(0, 100) + '...');
      console.log('=== End Debug Info ===');
      
    } catch (error) {
      console.error('=== ERROR in AI Agent ===');
      console.error('Error details:', error);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      
      // More descriptive error messages
      let errorMessage = 'No se pudo generar una respuesta. Por favor intenta de nuevo.';
      
      if (error.message?.includes('API key') || error.message?.includes('Invalid OpenAI API key')) {
        errorMessage = 'Error de configuración de API Key de OpenAI. Por favor verifica la configuración.';
      } else if (error.message?.includes('429') || error.message?.includes('Rate limit')) {
        errorMessage = 'Límite de uso de OpenAI excedido. Por favor intenta más tarde.';
      } else if (error.message?.includes('network') || error.message?.includes('fetch')) {
        errorMessage = 'Error de conexión. Por favor verifica tu conexión a internet.';
      } else if (error.message?.includes('Invalid request')) {
        errorMessage = 'Error en la solicitud a OpenAI. Por favor intenta de nuevo.';
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
