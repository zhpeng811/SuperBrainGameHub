'use client';

import GameOfLifeGame from '@/components/games/gameOfLife/GameOfLifeGame';
import { useTranslations } from 'next-intl';

export default function GameOfLifePage() {
  const t = useTranslations('gameOfLife');
  
  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">{t('title')}</h1>
        <p className="text-gray-600 dark:text-gray-400">
          {t('subtitle')}
        </p>
      </div>

      <GameOfLifeGame />
    </div>
  );
} 