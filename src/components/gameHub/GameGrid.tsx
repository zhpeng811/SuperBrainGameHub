import { GameCardProps } from './GameCard';
import GameCard from './GameCard';

interface GameGridProps {
  games: GameCardProps[];
}

export default function GameGrid({ games }: GameGridProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {games.map((game) => (
        <GameCard 
          key={game.id}
          id={game.id}
          title={game.title}
          description={game.description}
          imageUrl={game.imageUrl}
          link={game.link}
        />
      ))}
    </div>
  );
} 