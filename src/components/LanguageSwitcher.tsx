import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SUPPORTED_LANGUAGES, getLanguageConfig } from '@/types/language';
import { useLanguage } from '@/context/LanguageContext';

export const LanguageSwitcher = () => {
  const { language, setLanguage, isLoading } = useLanguage();
  const currentConfig = getLanguageConfig(language);

  return (
    <Select
      value={language}
      onValueChange={setLanguage}
      disabled={isLoading}
    >
      <SelectTrigger className="w-auto min-w-[120px] bg-background/80 border-border/40">
        <SelectValue>
          <div className="flex items-center gap-2">
            <span className="text-sm">{currentConfig.flag}</span>
            <span className="hidden sm:inline text-sm">{currentConfig.nativeName}</span>
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {SUPPORTED_LANGUAGES.map((lang) => (
          <SelectItem key={lang.code} value={lang.code}>
            <div className="flex items-center gap-2">
              <span>{lang.flag}</span>
              <span>{lang.nativeName}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};