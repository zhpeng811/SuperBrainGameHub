import { ReactNode } from 'react';
import BasePathLink from '@/components/ui/BasePathLink';

export default function GamesLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <BasePathLink href="/" className="text-xl font-bold text-gray-900 dark:text-white">
              Super Brain Game Hub
            </BasePathLink>
            <nav>
              <BasePathLink
                href="/"
                className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
              >
                Back to Games
              </BasePathLink>
            </nav>
          </div>
        </div>
      </header>
      <main className="container mx-auto flex-1 px-4 py-8">{children}</main>
    </div>
  );
} 