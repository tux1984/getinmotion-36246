
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();
  
  const handleChange = () => {
    setLanguage(language === 'en' ? 'es' : 'en');
  };
  
  return (
    <div className="flex items-center space-x-2">
      <Label htmlFor="language-toggle" className="cursor-pointer text-indigo-100 font-medium">
        {language === 'en' ? 'EN' : 'ES'}
      </Label>
      <Switch
        id="language-toggle"
        checked={language === 'es'}
        onCheckedChange={handleChange}
        className="data-[state=checked]:bg-pink-500"
      />
      <Label htmlFor="language-toggle" className="cursor-pointer text-indigo-100 font-medium">
        {language === 'en' ? 'ES' : 'EN'}
      </Label>
    </div>
  );
};
