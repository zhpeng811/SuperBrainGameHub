'use client';

import { useTranslations } from 'next-intl';
import { useLanguage } from '@/utils/LanguageContext';
import { useState, useEffect } from 'react';

export default function LanguageSelector() {
  const [isClient, setIsClient] = useState(false);
  const { locale, setLocale, availableLocales } = useLanguage();
  const t = useTranslations('languageSelector');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleSelectLanguage = (selectedLocale: string) => {
    setLocale(selectedLocale);
    setIsOpen(false);
  };

  if (!isClient) {
    return null;
  }

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
      >
        {t('label')}: {t(locale)}
        <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-800 dark:ring-gray-700">
          <div className="py-1" role="menu" aria-orientation="vertical">
            {availableLocales.map((localeOption) => (
              <button
                key={localeOption}
                onClick={() => handleSelectLanguage(localeOption)}
                className={`block w-full px-4 py-2 text-left text-sm ${
                  locale === localeOption
                    ? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white'
                    : 'text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-700'
                }`}
                role="menuitem"
              >
                {t(localeOption)}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 