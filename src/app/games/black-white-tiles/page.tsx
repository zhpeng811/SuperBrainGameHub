'use client';

import BlackWhiteTilesGame from '@/components/games/blackWhiteTiles/BlackWhiteTilesGame';
import { useTranslations } from 'next-intl';

export default function BlackWhiteTilesPage() {
  const t = useTranslations('blackWhiteTiles');
  
  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">{t('title')}</h1>
        <p className="text-gray-600 dark:text-gray-400">
          {t('subtitle')}
        </p>
      </div>

      <BlackWhiteTilesGame />
    </div>
  );
} 