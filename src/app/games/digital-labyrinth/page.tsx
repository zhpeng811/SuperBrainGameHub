'use client';

import DigitalLabyrinthGame from '@/components/games/digitalLabyrinth/DigitalLabyrinthGame';

export default function DigitalLabyrinthPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">Digital Labyrinth</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Connect the numbers from 1 to 81 by filling in the missing tiles
        </p>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-md dark:border-gray-700 dark:bg-gray-800">
        <DigitalLabyrinthGame />
      </div>
    </div>
  );
} 