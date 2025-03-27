'use client';

import NumberPuzzleGame from '@/components/games/numberPuzzle/NumberPuzzleGame';

export default function NumberPuzzlePage() {
  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">Number Puzzle</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Solve the sliding number puzzle by rearranging the tiles
        </p>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-md dark:border-gray-700 dark:bg-gray-800">
        <NumberPuzzleGame />
      </div>
    </div>
  );
} 