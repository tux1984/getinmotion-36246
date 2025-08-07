import { getTranslations, getTranslation, type Translations } from '@/translations';

export function useTranslations() {
  return {
    t: getTranslations(),
    language: 'en' as const,
    getText: (path: string, fallback?: string) => getTranslation(path, fallback)
  };
}

export type UseTranslationsReturn = {
  t: Translations;
  language: 'en';
  getText: (path: string, fallback?: string) => string;
};