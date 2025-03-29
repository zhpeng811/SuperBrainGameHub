import Tile from './Tile';

interface BoardProps {
  board: boolean[][];
  isInteractive: boolean;
  onTileClick?: (row: number, col: number) => void;
  onTileHover?: (row: number, col: number) => void;
  onTileHoverEnd?: () => void;
  title?: string;
  highlightedCell?: { row: number, col: number } | null;
  verificationEnabled?: boolean;
  correctBoard?: boolean[][];
  showPostSubmission?: boolean; // For post-submission display
}

export default function Board({ 
  board, 
  isInteractive, 
  onTileClick, 
  onTileHover,
  onTileHoverEnd,
  title,
  highlightedCell,
  verificationEnabled = false,
  correctBoard,
  showPostSubmission = false
}: BoardProps) {
  const size = board.length;
  
  return (
    <div className="flex flex-col items-center">
      {title && (
        <h3 className="mb-4 text-center text-lg font-semibold text-gray-900 dark:text-white">
          {title}
        </h3>
      )}
      <div 
        className="grid gap-0.5 bg-gray-100 p-3 rounded-lg shadow-md dark:bg-gray-800"
        style={{ 
          display: 'grid',
          gridTemplateColumns: `repeat(${size || 15}, 1fr)`,
          gridTemplateRows: `repeat(${size || 15}, 1fr)`,
          width: '300px',
          height: '300px',
          maxWidth: '100%'
        }}
      >
        {board.map((row, rowIndex) =>
          row.map((isAlive, colIndex) => {
            // Determine if this cell's prediction is correct
            let isCorrect = null;
            let isMissed = false;
            
            if (correctBoard) {
              const shouldBeAlive = correctBoard[rowIndex][colIndex];
              
              if (isAlive) {
                // For alive cells, check if they should be alive
                isCorrect = shouldBeAlive === isAlive;
              } else if (shouldBeAlive) {
                // For cells that should be alive but aren't (missed cells)
                isMissed = true;
              }
            }
            
            return (
              <Tile
                key={`${rowIndex}-${colIndex}`}
                isAlive={isAlive}
                isInteractive={isInteractive}
                isHighlighted={
                  highlightedCell !== null && 
                  highlightedCell !== undefined && 
                  highlightedCell.row === rowIndex && 
                  highlightedCell.col === colIndex
                }
                isCorrect={isCorrect}
                isMissed={isMissed}
                verificationEnabled={verificationEnabled}
                showPostSubmission={showPostSubmission}
                onClick={
                  isInteractive && onTileClick
                    ? () => onTileClick(rowIndex, colIndex)
                    : undefined
                }
                onHover={
                  onTileHover ? () => onTileHover(rowIndex, colIndex) : undefined
                }
                onHoverEnd={onTileHoverEnd}
              />
            );
          })
        )}
      </div>
    </div>
  );
} 