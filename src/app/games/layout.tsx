'use client';

import { ReactNode, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import BasePathLink from '@/components/ui/BasePathLink';
import LanguageSelector from '@/components/ui/LanguageSelector';
import { useLanguage } from '@/utils/LanguageContext';

export default function GamesLayout({ children }: { children: ReactNode }) {
  const t = useTranslations('gameLayout');
  // Track the current language to ensure we're reactive to language changes
  const { locale } = useLanguage();
  
  // Using useMemo to avoid unnecessary re-renders while still being reactive to locale changes
  const layoutContent = useMemo(() => {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <header className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <BasePathLink href="/" className="text-xl font-bold text-gray-900 dark:text-white">
                {t('title')}
              </BasePathLink>
              <div className="flex items-center space-x-4">
                <LanguageSelector />
                <nav>
                  <BasePathLink
                    href="/"
                    className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
                  >
                    {t('backToGames')}
                  </BasePathLink>
                </nav>
              </div>
            </div>
          </div>
        </header>
        <main className="container mx-auto flex-1 px-4 py-8">{children}</main>
      </div>
    );
  }, [t, locale]); // Only re-render when translations or locale change
  
  return layoutContent;
} 