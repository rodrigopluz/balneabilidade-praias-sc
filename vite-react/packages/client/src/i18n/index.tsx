import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { translations, Locale, TranslationKey } from './translations';

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  translationKey: (key: TranslationKey) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

function detectLocale(): Locale {
  const stored = localStorage.getItem('locale') as Locale;
  if (stored && translations[stored]) {
    return stored;
  }
  
  const browserLang = navigator.language || 'pt-BR';
  if (translations[browserLang as Locale]) {
    return browserLang as Locale;
  }
  
  const langPrefix = browserLang.split('-')[0];
  const matchedLocale = Object.keys(translations).find((lang) =>
    lang.startsWith(langPrefix)
  );
  
  return (matchedLocale as Locale) || 'pt-BR';
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(detectLocale);

  useEffect(() => {
    document.documentElement.lang = locale;
    localStorage.setItem('locale', locale);
  }, [locale]);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
  };

  const translationKey = (key: TranslationKey): string => {
    return translations[locale][key] || translations['pt-BR'][key] || key;
  };

  return (
    <I18nContext.Provider value={{ locale, setLocale, translationKey }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}

export { detectLocale };
