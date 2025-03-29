'use client';

import { games } from '@/data/games';
import GameGrid from '@/components/gameHub/GameGrid';
import Header from '@/components/gameHub/Header';
import { useTranslations } from 'next-intl';

export default function Home() {
  const t = useTranslations('home');
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">{t('featuredGames')}</h2>
          <GameGrid games={games} />
        </section>
        
        <section>
          <div className="rounded-lg bg-blue-50 p-6 dark:bg-blue-900/20">
            <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
              {t('aboutTitle')}
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              {t('aboutDescription')}
            </p>
            <div className="mt-4">
              <button className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-700 dark:hover:bg-blue-600">
                {t('learnMore')}
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
