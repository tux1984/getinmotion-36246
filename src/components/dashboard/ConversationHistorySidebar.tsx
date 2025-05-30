
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAgentConversations } from '@/hooks/useAgentConversations';
import { MessageSquare, Plus, Clock, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface ConversationHistorySidebarProps {
  agentId: string;
  language: 'en' | 'es';
  compact?: boolean;
  onConversationSelect?: (conversationId: string) => void;
}

export const ConversationHistorySidebar: React.FC<ConversationHistorySidebarProps> = ({
  agentId,
  language,
  compact = false,
  onConversationSelect
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Initialize hook state properly to avoid React errors
  const [hookData, setHookData] = useState<{
    conversations: any[];
    currentConversationId: string | null;
    selectConversation: (id: string) => Promise<void>;
    startNewConversation: () => void;
    loading: boolean;
  } | null>(null);

  // Safely initialize the hook
  useEffect(() => {
    const data = useAgentConversations(agentId);
    setHookData(data);
  }, [agentId]);

  const t = {
    en: {
      conversations: "Conversations",
      newChat: "New Chat",
      search: "Search conversations...",
      noConversations: "No conversations yet",
      startFirst: "Start your first chat!"
    },
    es: {
      conversations: "Conversaciones",
      newChat: "Chat Nuevo",
      search: "Buscar conversaciones...",
      noConversations: "No hay conversaciones",
      startFirst: "¡Inicia tu primer chat!"
    }
  };

  // Return early loading state if hook data not ready
  if (!hookData) {
    return (
      <Card className="bg-white/5 backdrop-blur-xl border border-white/10 h-full">
        <CardContent className="p-4 flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-400"></div>
        </CardContent>
      </Card>
    );
  }

  const { conversations, currentConversationId, selectConversation, startNewConversation, loading } = hookData;

  const filteredConversations = conversations.filter(conv =>
    conv.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    !searchQuery
  );

  const handleNewChat = () => {
    console.log('New chat button clicked - starting new conversation');
    startNewConversation();
    // Notify parent component if callback provided
    if (onConversationSelect) {
      onConversationSelect('new');
    }
  };

  const handleSelectConversation = async (conversationId: string) => {
    console.log('Conversation selected:', conversationId);
    try {
      await selectConversation(conversationId);
      console.log('Conversation selection completed successfully');
      
      // Notify parent component about the selection
      if (onConversationSelect) {
        onConversationSelect(conversationId);
      }
    } catch (error) {
      console.error('Error selecting conversation:', error);
    }
  };

  if (compact) {
    return (
      <Button 
        onClick={handleNewChat}
        className="w-full bg-purple-600 hover:bg-purple-700 text-white"
        size="sm"
      >
        <MessageSquare className="w-4 h-4 mr-1" />
        {conversations.length}
      </Button>
    );
  }

  if (loading) {
    return (
      <Card className="bg-white/5 backdrop-blur-xl border border-white/10 h-full">
        <CardContent className="p-4 flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-400"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/5 backdrop-blur-xl border border-white/10 h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-white text-sm flex items-center gap-2">
          <MessageSquare className="w-4 h-4" />
          {t[language].conversations}
        </CardTitle>
        <Button 
          onClick={handleNewChat}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white mt-2"
          size="sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          {t[language].newChat}
        </Button>
      </CardHeader>
      
      <CardContent className="p-4 pt-0 h-[calc(100%-120px)]">
        <div className="mb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t[language].search}
              className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/40"
            />
          </div>
        </div>

        <ScrollArea className="h-full">
          {filteredConversations.length === 0 ? (
            <div className="text-center py-8 text-white/60">
              <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">{t[language].noConversations}</p>
              <p className="text-xs opacity-75">{t[language].startFirst}</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredConversations.map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => handleSelectConversation(conv.id)}
                  className={`p-3 rounded-lg cursor-pointer transition-all hover:bg-white/10 ${
                    currentConversationId === conv.id 
                      ? 'bg-purple-500/30 border border-purple-400/50' 
                      : 'bg-white/5 hover:bg-white/10 border border-white/10'
                  }`}
                >
                  <p className="text-white text-sm font-medium truncate">
                    {conv.title || 'Nueva conversación'}
                  </p>
                  <div className="flex items-center text-xs text-white/60 mt-1">
                    <Clock className="w-3 h-3 mr-1" />
                    {formatDistanceToNow(new Date(conv.updated_at), { 
                      addSuffix: true, 
                      locale: language === 'es' ? es : undefined 
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
