
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
  
  "contract-generator": "You are a Contract Generator AI specialized in cultural projects. You help artists, performers, and cultural organizations draft professional contracts. Be detailed, precise, and knowledgeable about intellectual property rights, payment terms, and cultural industry standards. Focus on creating clear agreements that protect the creator's interests while being fair to all parties. Provide explanations for important contract clauses and suggest additions based on the specific project context. Respond in the same language the user is using.",

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
    
    console.log('=== AI Agent Send Message ===');
    console.log('Message content:', content);
    console.log('Agent type:', agentType);
    
    // Add user message
    const userMessage: Message = { type: 'user', content };
    setMessages(prev => [...prev, userMessage]);
    
    setIsProcessing(true);
    
    try {
      // Map agent type to system prompt
      const mappedAgentType = agentIdMapping[agentType] || agentType;
      const systemPrompt = agentSystemPrompts[mappedAgentType] || agentSystemPrompts.admin;
      
      console.log('Using system prompt for agent:', mappedAgentType);
      
      // Prepare messages for API
      const apiMessages = [
        ...messages.map(msg => ({
          role: msg.type === 'user' ? 'user' : 'assistant',
          content: msg.content
        })),
        { role: 'user', content }
      ];
      
      const requestPayload = {
        systemPrompt,
        messages: apiMessages
      };
      
      console.log('Calling edge function with payload:', requestPayload);
      
      // Call Supabase Edge Function with improved error handling
      const { data, error } = await supabaseClient.functions.invoke('openai-chat', {
        body: requestPayload,
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log('Edge function response - data:', data);
      console.log('Edge function response - error:', error);
      
      // Handle different types of errors
      if (error) {
        console.error('Supabase function invoke error:', error);
        
        // Check if it's a network error
        if (error.message?.includes('Failed to fetch') || error.message?.includes('NetworkError')) {
          throw new Error('Network connection failed. Please check your internet connection.');
        }
        
        // Check if it's an edge function deployment error
        if (error.message?.includes('Function not found') || error.message?.includes('404')) {
          throw new Error('AI service is temporarily unavailable. Please try again later.');
        }
        
        throw new Error(`AI service error: ${error.message}`);
      }
      
      // Handle case where no data is returned
      if (!data) {
        console.error('No data returned from edge function');
        throw new Error('No response received from AI service');
      }
      
      // Handle edge function returned an error
      if (data.error) {
        console.error('Edge function returned error:', data.error);
        
        // Provide specific error messages based on the error type
        if (data.error.includes('API key')) {
          throw new Error('AI service configuration issue. Please contact support.');
        } else if (data.error.includes('rate limit') || data.status === 429) {
          throw new Error('AI service is busy. Please try again in a moment.');
        } else if (data.error.includes('timeout')) {
          throw new Error('AI service took too long to respond. Please try again.');
        } else {
          throw new Error(data.error);
        }
      }
      
      // Validate OpenAI response structure
      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        console.error('Invalid OpenAI response structure:', data);
        throw new Error('Invalid response format from AI service');
      }
      
      // Extract AI response
      const aiResponse = data.choices[0].message.content || 'Sorry, I could not generate a response.';
      console.log('AI response received successfully');
      
      // Add AI message
      const aiMessage: Message = { type: 'agent', content: aiResponse };
      setMessages(prev => [...prev, aiMessage]);
      
    } catch (error) {
      console.error('=== AI Agent Error ===');
      console.error('Error details:', error);
      
      // Show user-friendly error messages
      let errorMessage = 'Failed to get AI response. Please try again.';
      
      if (error?.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      
      // Add error message to chat
      const errorChatMessage: Message = { 
        type: 'agent', 
        content: `I apologize, but I'm having trouble responding right now. Error: ${errorMessage}` 
      };
      setMessages(prev => [...prev, errorChatMessage]);
      
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
