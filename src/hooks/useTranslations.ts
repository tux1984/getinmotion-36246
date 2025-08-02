import { useLanguage } from '@/context/LanguageContext';
import { getTranslations, getTranslation, Translations } from '@/translations';

export function useTranslations() {
  const { language } = useLanguage();
  
  return {
    t: getTranslations(language),
    language,
    getText: (path: string, fallback?: string) => getTranslation(language, path, fallback)
  };
}

export type UseTranslationsReturn = {
  t: Translations;
  language: 'en' | 'es';
  getText: (path: string, fallback?: string) => string;
};