
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X, MessageSquare, Trash2, Settings, Moon, Sun } from 'lucide-react';
import { Message } from '@/types/chat';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/hooks/useTheme';

interface ModernChatSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  agentId: string;
  agentName: string;
  agentColor: string;
  agentIcon?: React.ReactNode;
  messages: Message[];
  onClearMessages: () => void;
  isMobile: boolean;
}

export const ModernChatSidebar = ({
  isOpen,
  onClose,
  agentId,
  agentName,
  agentColor,
  agentIcon,
  messages,
  onClearMessages,
  isMobile
}: ModernChatSidebarProps) => {
  const { language, setLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  const t = {
    en: {
      conversations: "Conversations",
      currentChat: "Current Chat",
      settings: "Settings",
      clearChat: "Clear Chat",
      language: "Language",
      theme: "Theme",
      light: "Light",
      dark: "Dark",
      messageCount: "messages",
      noMessages: "No messages yet",
      close: "Close"
    },
    es: {
      conversations: "Conversaciones",
      currentChat: "Chat Actual",
      settings: "Configuración",
      clearChat: "Limpiar Chat",
      language: "Idioma",
      theme: "Tema",
      light: "Claro",
      dark: "Oscuro",
      messageCount: "mensajes",
      noMessages: "Aún no hay mensajes",
      close: "Cerrar"
    }
  };

  const translations = t[language];

  if (!isOpen) return null;

  const sidebarClasses = isMobile
    ? "fixed inset-y-0 left-0 z-50 w-80 bg-white border-r border-slate-200 transform transition-transform duration-300"
    : "w-80 bg-white border-r border-slate-200 flex-shrink-0";

  return (
    <div className={sidebarClasses}>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-slate-900">
              {translations.conversations}
            </h2>
            {isMobile && (
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="w-4 h-4" />
                <span className="sr-only">{translations.close}</span>
              </Button>
            )}
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-4 space-y-4">
            {/* Current Agent */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  {agentIcon && (
                    <div className={`w-6 h-6 rounded-full ${agentColor} flex items-center justify-center`}>
                      {agentIcon}
                    </div>
                  )}
                  {agentName}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-sm text-slate-500 mb-2">
                  {translations.currentChat}
                </div>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">
                    {messages.length} {translations.messageCount}
                  </Badge>
                  {messages.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={onClearMessages}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-3 h-3 mr-1" />
                      {translations.clearChat}
                    </Button>
                  )}
                </div>
                {messages.length === 0 && (
                  <p className="text-sm text-slate-400 mt-2">
                    {translations.noMessages}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Recent Messages Preview */}
            {messages.length > 0 && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Mensajes Recientes
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    {messages.slice(-3).map((message, index) => (
                      <div key={index} className="text-xs p-2 rounded bg-slate-50">
                        <div className="font-medium text-slate-600 mb-1">
                          {message.type === 'user' ? 'Tú' : agentName}
                        </div>
                        <div className="text-slate-500 line-clamp-2">
                          {message.content.substring(0, 80)}
                          {message.content.length > 80 ? '...' : ''}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </ScrollArea>

        {/* Settings */}
        <div className="border-t border-slate-200 p-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <Settings className="w-4 h-4" />
              {translations.settings}
            </div>
            
            <Separator />
            
            {/* Language Toggle */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">
                {translations.language}
              </span>
              <div className="flex gap-1">
                <Button
                  variant={language === 'en' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setLanguage('en')}
                  className="text-xs px-2 py-1 h-auto"
                >
                  EN
                </Button>
                <Button
                  variant={language === 'es' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setLanguage('es')}
                  className="text-xs px-2 py-1 h-auto"
                >
                  ES
                </Button>
              </div>
            </div>

            {/* Theme Toggle */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">
                {translations.theme}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className="text-xs px-2 py-1 h-auto"
              >
                {theme === 'dark' ? (
                  <>
                    <Sun className="w-3 h-3 mr-1" />
                    {translations.light}
                  </>
                ) : (
                  <>
                    <Moon className="w-3 h-3 mr-1" />
                    {translations.dark}
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
