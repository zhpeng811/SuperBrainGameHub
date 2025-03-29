'use client';

import GameOfLifeGame from '@/components/games/gameOfLife/GameOfLifeGame';

export default function GameOfLifePage() {
  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">Conway&apos;s Game of Life</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Predict the next state of cells based on Conway&apos;s Game of Life rules
        </p>
      </div>

      <GameOfLifeGame />
    </div>
  );
} 