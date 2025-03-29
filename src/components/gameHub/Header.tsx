'use client';

import { useTranslations } from 'next-intl';
import LanguageSelector from '@/components/ui/LanguageSelector';

export default function Header() {
  const t = useTranslations('header');

  return (
    <header className="py-6 mb-8 border-b border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {t('title')}
            </h1>
            <p className="mt-1 text-gray-500 dark:text-gray-400">
              {t('subtitle')}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <button className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-700 dark:hover:bg-blue-600">
              {t('myProfile')}
            </button>
            <button className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700">
              {t('settings')}
            </button>
            <LanguageSelector />
          </div>
        </div>
      </div>
    </header>
  );
} 