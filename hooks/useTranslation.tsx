import React, {
  useCallback,
  useEffect,
  useState,
  createContext,
  useContext,
  ReactNode,
} from "react";

type Locale = "uk" | "en" | "ru";
type Translations = Record<string, any>;

type TranslationContextType = {
  t: (key: string) => string;
  locale: Locale;
  changeLocale: (newLocale: Locale) => void;
  translations: Translations;
  isLoading: boolean;
};

const TranslationContext = createContext<TranslationContextType | undefined>(
  undefined,
);

// Кеш для локалізацій
// Очищуємо кеш для перезавантаження оновлених файлів
const localeCache: Record<Locale, Translations | null> = {
  uk: null,
  en: null,
  ru: null,
};

// Функція для завантаження локалізації
const loadLocale = async (locale: Locale): Promise<Translations> => {
  // Тимчасово вимикаємо кеш для перезавантаження
  // if (localeCache[locale]) {
  //   return localeCache[locale]!;
  // }

  try {
    // Додаємо timestamp для обходу кешу
    const timestamp = Date.now();
    const response = await fetch(`/locales/${locale}.json?v=${timestamp}`);
    if (!response.ok) {
      throw new Error(`Failed to load locale ${locale}`);
    }
    const translations = await response.json();
    localeCache[locale] = translations;
    return translations;
  } catch (error) {
    console.error(`Error loading locale ${locale}:`, error);
    // Fallback до української мови
    if (locale !== 'uk') {
      return loadLocale('uk');
    }
    return {};
  }
};

export const TranslationProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [locale, setLocale] = useState<Locale>("uk");
  const [translations, setTranslations] = useState<Translations>({});
  const [isLoading, setIsLoading] = useState(true);

  // Завантаження початкової локалізації
  useEffect(() => {
    const initializeTranslations = async () => {
      console.log("🚀 Initializing translations...");
      setIsLoading(true);
      
      // Перевіряємо збережену мову
      const savedLocale = (typeof window !== "undefined" 
        ? localStorage.getItem("locale") 
        : null) as Locale;
      
      const targetLocale = savedLocale && ["uk", "en", "ru"].includes(savedLocale) 
        ? savedLocale 
        : "uk";
      
      console.log("🌍 Target locale:", targetLocale);
      
      try {
        const loadedTranslations = await loadLocale(targetLocale);
        console.log("📦 Loaded translations:", !!loadedTranslations, "keys:", Object.keys(loadedTranslations).length);
        setLocale(targetLocale);
        setTranslations(loadedTranslations);
      } catch (error) {
        console.error("❌ Failed to load initial translations:", error);
        // Fallback на українську
        setLocale("uk");
        setTranslations({});
      } finally {
        setIsLoading(false);
        console.log("✅ Translation initialization complete");
      }
    };

    initializeTranslations();
  }, []);

  // Завантаження нової локалізації при зміні мови  
  useEffect(() => {
    if (!isLoading && locale) {
      const loadNewTranslations = async () => {
        try {
          const loadedTranslations = await loadLocale(locale);
          setTranslations(loadedTranslations);
          console.log(`✅ Switched to locale: ${locale}`);
          console.log("✅ Translations loaded:", Object.keys(loadedTranslations).length, "sections");
          console.log("✅ Has nav?", !!loadedTranslations?.nav);
          console.log("✅ Has buy?", !!loadedTranslations?.buy);
          console.log("✅ Has footer?", !!loadedTranslations?.footer);
        } catch (error) {
          console.error(`❌ Failed to load translations for ${locale}:`, error);
        }
      };

      loadNewTranslations();
    }
  }, [locale, isLoading]);

  const t = useCallback(
    (key: string): string => {
      // Якщо переклади ще не завантажились, повертаємо ключ
      if (!translations || Object.keys(translations).length === 0) {
        return key;
      }

      const keys = key.split(".");
      let value: any = translations;

      for (const k of keys) {
        if (value?.[k] === undefined) {
          // Логування тільки для важливих ключів, щоб не засмічувати консоль
          if (!key.includes('submenu.') && !key.includes('crm.')) {
            console.log(`❌ Translation key not found: ${key}`);
          }
          return key;
        }
        value = value[k];
      }

      return typeof value === "string" ? value : key;
    },
    [translations],
  );

  const changeLocale = useCallback(async (newLocale: Locale) => {
    setLocale(newLocale);
    if (typeof window !== "undefined") {
      localStorage.setItem("locale", newLocale);
    }
  }, []);

  return (
    <TranslationContext.Provider
      value={{ t, locale, changeLocale, translations, isLoading }}
    >
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(TranslationContext);

  if (context === undefined) {
    throw new Error("useTranslation must be used within a TranslationProvider");
  }

  return context;
};
