
import React, { useState } from 'react';
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
}

export const ConversationHistorySidebar: React.FC<ConversationHistorySidebarProps> = ({
  agentId,
  language,
  compact = false
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const {
    conversations,
    currentConversationId,
    selectConversation,
    startNewConversation,
    loading
  } = useAgentConversations(agentId);

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

  const filteredConversations = conversations.filter(conv =>
    conv.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    !searchQuery
  );

  const handleNewChat = () => {
    console.log('New chat button clicked');
    startNewConversation();
  };

  const handleSelectConversation = async (conversationId: string) => {
    console.log('Conversation selected:', conversationId);
    try {
      await selectConversation(conversationId);
      console.log('Conversation selection completed');
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
      <Card className="bg-white border border-gray-200 shadow-sm h-full">
        <CardContent className="p-4 flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white border border-gray-200 shadow-sm h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-gray-800 text-sm flex items-center gap-2">
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
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t[language].search}
              className="pl-10 bg-gray-50 border-gray-200 text-gray-800 placeholder:text-gray-400"
            />
          </div>
        </div>

        <ScrollArea className="h-full">
          {filteredConversations.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
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
                  className={`p-3 rounded-lg cursor-pointer transition-all hover:bg-gray-50 ${
                    currentConversationId === conv.id 
                      ? 'bg-purple-50 border border-purple-200' 
                      : 'bg-white hover:bg-gray-50 border border-gray-100'
                  }`}
                >
                  <p className="text-gray-800 text-sm font-medium truncate">
                    {conv.title || 'Nueva conversación'}
                  </p>
                  <div className="flex items-center text-xs text-gray-500 mt-1">
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
