
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface AgentConversation {
  id: string;
  agent_id: string;
  title: string | null;
  created_at: string;
  updated_at: string;
  is_archived: boolean;
}

export interface AgentMessage {
  id: string;
  conversation_id: string;
  message_type: 'user' | 'agent';
  content: string;
  metadata: any;
  created_at: string;
}

export function useAgentConversations(agentId: string) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [conversations, setConversations] = useState<AgentConversation[]>([]);
  const [messages, setMessages] = useState<AgentMessage[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  // Fetch conversations for agent
  const fetchConversations = async () => {
    if (!user || !agentId) return;

    try {
      const { data, error } = await supabase
        .from('agent_conversations')
        .select('*')
        .eq('user_id', user.id)
        .eq('agent_id', agentId)
        .eq('is_archived', false)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      console.log('Fetched conversations:', data);
      setConversations(data || []);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar las conversaciones',
        variant: 'destructive',
      });
    }
  };

  // Fetch messages for current conversation
  const fetchMessages = async (conversationId: string) => {
    if (!conversationId) {
      console.log('No conversation ID provided, clearing messages');
      setMessages([]);
      return;
    }
    
    console.log('Fetching messages for conversation:', conversationId);
    try {
      const { data, error } = await supabase
        .from('agent_messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      
      console.log('Fetched messages:', data);
      
      // Type cast the data to ensure it matches our interface
      const typedMessages: AgentMessage[] = (data || []).map(msg => ({
        ...msg,
        message_type: msg.message_type as 'user' | 'agent'
      }));
      
      setMessages(typedMessages);
      console.log('Messages state updated with:', typedMessages.length, 'messages');
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los mensajes',
        variant: 'destructive',
      });
    }
  };

  // Create new conversation
  const createConversation = async (firstMessage: string) => {
    if (!user) return null;

    try {
      const { data: conversation, error: convError } = await supabase
        .from('agent_conversations')
        .insert({
          user_id: user.id,
          agent_id: agentId,
          title: firstMessage.substring(0, 50) + (firstMessage.length > 50 ? '...' : '')
        })
        .select()
        .single();

      if (convError) throw convError;

      console.log('Created new conversation:', conversation);
      setCurrentConversationId(conversation.id);
      setMessages([]); // Clear messages for new conversation
      await fetchConversations();
      
      return conversation.id;
    } catch (error) {
      console.error('Error creating conversation:', error);
      toast({
        title: 'Error',
        description: 'No se pudo crear la conversación',
        variant: 'destructive',
      });
      return null;
    }
  };

  // Add message to conversation
  const addMessage = async (conversationId: string, content: string, messageType: 'user' | 'agent') => {
    try {
      const { data, error } = await supabase
        .from('agent_messages')
        .insert({
          conversation_id: conversationId,
          message_type: messageType,
          content: content
        })
        .select()
        .single();

      if (error) throw error;
      
      console.log('Added message:', data);
      
      // Type cast the returned data
      const typedMessage: AgentMessage = {
        ...data,
        message_type: data.message_type as 'user' | 'agent'
      };
      
      setMessages(prev => {
        const newMessages = [...prev, typedMessage];
        console.log('Updated messages state with new message, total:', newMessages.length);
        return newMessages;
      });
      
      // Update conversation timestamp
      await supabase
        .from('agent_conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', conversationId);

      // Refresh conversations to update order
      await fetchConversations();

      return typedMessage;
    } catch (error) {
      console.error('Error adding message:', error);
      throw error;
    }
  };

  // Select conversation and load its messages
  const selectConversation = async (conversationId: string) => {
    console.log('Selecting conversation:', conversationId);
    setCurrentConversationId(conversationId);
    await fetchMessages(conversationId);
    console.log('Conversation selection completed');
  };

  // Start new conversation - clear everything
  const startNewConversation = () => {
    console.log('Starting new conversation');
    setCurrentConversationId(null);
    setMessages([]);
    console.log('New conversation started - cleared state');
  };

  useEffect(() => {
    if (user && agentId) {
      console.log('Initializing conversations for agent:', agentId);
      fetchConversations().finally(() => {
        setLoading(false);
        console.log('Initial conversations fetch completed');
      });
    }
  }, [user, agentId]);

  // Debug effect to log state changes
  useEffect(() => {
    console.log('useAgentConversations state update:', {
      conversationsCount: conversations.length,
      messagesCount: messages.length,
      currentConversationId,
      loading,
      isProcessing
    });
  }, [conversations, messages, currentConversationId, loading, isProcessing]);

  return {
    conversations,
    messages,
    currentConversationId,
    loading,
    isProcessing,
    setIsProcessing,
    createConversation,
    addMessage,
    selectConversation,
    startNewConversation,
    fetchConversations
  };
}
