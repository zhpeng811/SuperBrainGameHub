export default function MemoryMatchGame() {
  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">Memory Match</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Test your memory by finding matching pairs of cards
        </p>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-md dark:border-gray-700 dark:bg-gray-800">
        <div className="mb-6 text-center">
          <p className="mb-2 text-lg font-medium text-gray-900 dark:text-white">Game will be available soon!</p>
          <p className="text-gray-600 dark:text-gray-400">
            We&apos;re working hard to bring you this exciting memory challenge game.
          </p>
        </div>
        
        <div className="flex justify-center">
          <button
            disabled
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white opacity-70"
          >
            Coming Soon
          </button>
        </div>
      </div>
    </div>
  );
} 