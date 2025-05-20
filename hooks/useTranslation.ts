import { useCallback, useEffect, useState } from 'react';

type Locale = 'uk' | 'en' | 'ru';
type Translations = Record<string, any>;

export const useTranslation = () => {
  const [locale, setLocale] = useState<Locale>('uk');
  const [translations, setTranslations] = useState<Translations>({});

  useEffect(() => {
    const loadTranslations = async () => {
      try {
        const translations = await import(`@/locales/${locale}.json`);
        setTranslations(translations.default);
      } catch (error) {
        console.error('Error loading translations:', error);
      }
    };

    loadTranslations();
  }, [locale]);

  const t = useCallback((key: string): string => {
    const keys = key.split('.');
    let value: any = translations;
    
    for (const k of keys) {
      if (value?.[k] === undefined) {
        return key;
      }
      value = value[k];
    }
    
    return typeof value === 'string' ? value : key;
  }, [translations]);

  const changeLocale = useCallback((newLocale: Locale) => {
    setLocale(newLocale);
    localStorage.setItem('locale', newLocale);
  }, []);

  useEffect(() => {
    const savedLocale = localStorage.getItem('locale') as Locale;
    if (savedLocale) {
      setLocale(savedLocale);
    }
  }, []);

  return { t, locale, changeLocale, translations };
}; 