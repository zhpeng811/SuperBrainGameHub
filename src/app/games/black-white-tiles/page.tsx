'use client';

import BlackWhiteTilesGame from '@/components/games/blackWhiteTiles/BlackWhiteTilesGame';

export default function BlackWhiteTilesPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">Black White Tiles</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Toggle the tiles to match the target pattern
        </p>
      </div>

      <BlackWhiteTilesGame />
    </div>
  );
} 