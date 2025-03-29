'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { locales, defaultLocale } from '@/i18n/index';

type LanguageContextType = {
  locale: string;
  setLocale: (locale: string) => void;
  availableLocales: string[];
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<string>(defaultLocale);

  // Move localStorage operations inside useEffect to ensure it only runs client-side
  useEffect(() => {
    const savedLocale = localStorage.getItem('locale');
    if (savedLocale && locales.includes(savedLocale)) {
      setLocaleState(savedLocale);
    }
  }, []);

  const setLocale = (newLocale: string) => {
    if (locales.includes(newLocale)) {
      setLocaleState(newLocale);
      // Only attempt to use localStorage on the client
      if (typeof window !== 'undefined') {
        localStorage.setItem('locale', newLocale);
        // No longer forcing a reload, to preserve game state
      }
    }
  };

  const contextValue = {
    locale,
    setLocale,
    availableLocales: locales
  };

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
} 