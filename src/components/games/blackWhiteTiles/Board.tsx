import Tile from './Tile';

interface BoardProps {
  board: boolean[][];
  isInteractive: boolean;
  onTileClick?: (row: number, col: number) => void;
}

export default function Board({ board, isInteractive, onTileClick }: BoardProps) {
  return (
    <div className="grid grid-cols-10 grid-rows-10 gap-1.5 bg-gray-100 p-3 rounded-lg shadow-md dark:bg-gray-800 max-w-[450px] w-full">
      {board.map((row, rowIndex) =>
        row.map((isBlack, colIndex) => (
          <Tile
            key={`${rowIndex}-${colIndex}`}
            isBlack={isBlack}
            isInteractive={isInteractive}
            onClick={
              isInteractive && onTileClick
                ? () => onTileClick(rowIndex, colIndex)
                : undefined
            }
          />
        ))
      )}
    </div>
  );
} 