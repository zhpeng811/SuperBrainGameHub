'use client';

import { useTranslations } from 'next-intl';
import BasePathLink from '@/components/ui/BasePathLink';
import BasePathImage from '@/components/ui/BasePathImage';

export interface GameCardProps {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  link: string;
}

export default function GameCard({ id, title, description, imageUrl, link }: GameCardProps) {
  const t = useTranslations('gameCards');
  
  // Get translated title and description based on game id
  const translatedTitle = t.has(`games.${id}.title`) ? t(`games.${id}.title`) : title;
  const translatedDescription = t.has(`games.${id}.description`) ? t(`games.${id}.description`) : description;

  return (
    <BasePathLink href={link} className="group">
      <div className="relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md transition-all hover:shadow-lg dark:border-gray-800 dark:bg-gray-950">
        <div className="relative aspect-square w-full overflow-hidden bg-blue-100 dark:bg-blue-900/30">
          {imageUrl && imageUrl !== '/placeholder-game.jpg' ? (
            <BasePathImage
              src={imageUrl}
              alt={translatedTitle}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority={imageUrl === '/black-white-tiles.png' || imageUrl === '/number-puzzle.jpg'}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{translatedTitle.charAt(0)}</span>
            </div>
          )}
        </div>
        <div className="flex flex-1 flex-col justify-between p-6">
          <div>
            <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">{translatedTitle}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{translatedDescription}</p>
          </div>
        </div>
      </div>
    </BasePathLink>
  );
} 