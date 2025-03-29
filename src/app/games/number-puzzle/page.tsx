'use client';

import NumberPuzzleGame from '@/components/games/numberPuzzle/NumberPuzzleGame';
import { useTranslations } from 'next-intl';

export default function NumberPuzzlePage() {
  const t = useTranslations('numberPuzzle');
  
  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">{t('title')}</h1>
        <p className="text-gray-600 dark:text-gray-400">
          {t('subtitle')}
        </p>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-md dark:border-gray-700 dark:bg-gray-800">
        <NumberPuzzleGame />
      </div>
    </div>
  );
} 