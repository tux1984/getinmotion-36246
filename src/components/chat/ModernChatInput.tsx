
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Paperclip, Mic } from 'lucide-react';

interface ModernChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: (message: string) => void;
  placeholder: string;
  sendText: string;
  disabled?: boolean;
}

export const ModernChatInput = ({
  value,
  onChange,
  onSend,
  placeholder,
  sendText,
  disabled = false
}: ModernChatInputProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [rows, setRows] = useState(1);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      const textarea = textareaRef.current;
      textarea.style.height = 'auto';
      
      const scrollHeight = textarea.scrollHeight;
      const lineHeight = 20; // Approximate line height
      const minRows = 1;
      const maxRows = 4;
      
      const newRows = Math.min(Math.max(Math.ceil(scrollHeight / lineHeight), minRows), maxRows);
      setRows(newRows);
      
      textarea.style.height = `${Math.min(scrollHeight, lineHeight * maxRows)}px`;
    }
  }, [value]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim() && !disabled) {
      onSend(value.trim());
      onChange('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div className="relative">
        <div className="flex items-end gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-200 focus-within:border-violet-300 focus-within:bg-white transition-all duration-200">
          {/* Attachment button */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-slate-500 hover:text-slate-700 p-1 h-8 w-8"
            disabled={disabled}
          >
            <Paperclip className="w-4 h-4" />
            <span className="sr-only">Adjuntar archivo</span>
          </Button>

          {/* Text input */}
          <Textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            className="flex-1 min-h-0 border-0 bg-transparent resize-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0 text-sm leading-5"
            style={{ height: `${rows * 20}px` }}
          />

          {/* Voice input button */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-slate-500 hover:text-slate-700 p-1 h-8 w-8"
            disabled={disabled}
          >
            <Mic className="w-4 h-4" />
            <span className="sr-only">Grabación de voz</span>
          </Button>

          {/* Send button */}
          <Button
            type="submit"
            size="sm"
            disabled={!value.trim() || disabled}
            className="bg-violet-600 hover:bg-violet-700 text-white p-2 h-8 w-8 rounded-full"
          >
            <Send className="w-4 h-4" />
            <span className="sr-only">{sendText}</span>
          </Button>
        </div>
      </div>

      {/* Tips text */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <span>Presiona Enter para enviar, Shift+Enter para nueva línea</span>
        <span>{value.length}/2000</span>
      </div>
    </form>
  );
};
