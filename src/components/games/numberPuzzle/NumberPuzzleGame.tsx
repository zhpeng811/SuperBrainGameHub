'use client';

import { useState, useEffect, useCallback } from 'react';

interface Tile {
  value: number;
  position: number;
}

type GridSize = 3 | 4 | 5;

export default function NumberPuzzleGame() {
  const [gridSize, setGridSize] = useState<GridSize>(4);
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [emptyPosition, setEmptyPosition] = useState<number>(15);
  const [moves, setMoves] = useState<number>(0);
  const [isWon, setIsWon] = useState<boolean>(false);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  // Calculate total positions based on grid size
  const totalPositions = gridSize * gridSize;
  // Last position (empty space) is always totalPositions - 1
  const lastPosition = totalPositions - 1;
  // Total number of tiles is one less than total positions
  const totalTiles = totalPositions - 1;

  const initializeGame = useCallback(() => {
    // Start with a solved puzzle (tiles in order)
    const orderedTiles: Tile[] = Array.from({ length: totalTiles }, (_, i) => ({
      value: i + 1,
      position: i,
    }));
    
    let currentEmptyPos = lastPosition;
    
    // Perform a series of random legal moves to shuffle the puzzle
    // This guarantees the puzzle is solvable
    const numShuffles = gridSize * 20; // Scale shuffles based on grid size
    
    for (let i = 0; i < numShuffles; i++) {
      // Get all possible moves from current position
      const adjacentPositions = getAdjacentPositions(currentEmptyPos);
      
      // Select a random adjacent position
      const randomIndex = Math.floor(Math.random() * adjacentPositions.length);
      const tilePos = adjacentPositions[randomIndex];
      
      // Find the tile at this position
      const tileIndex = orderedTiles.findIndex(tile => tile.position === tilePos);
      
      // Move the tile (update its position to where the empty space is)
      orderedTiles[tileIndex].position = currentEmptyPos;
      
      // Update the empty position
      currentEmptyPos = tilePos;
    }
    
    setTiles(orderedTiles);
    setEmptyPosition(currentEmptyPos);
    setMoves(0);
    setIsWon(false);
    setIsInitialized(true);
  }, [gridSize, lastPosition, totalPositions, totalTiles]);

  // Handle grid size change
  const handleGridSizeChange = (newSize: GridSize) => {
    setGridSize(newSize);
    setIsInitialized(false); // Reset initialization flag so the game will be reinitialized
  };

  // Initialize game on component mount or when grid size changes
  useEffect(() => {
    initializeGame();
  }, [initializeGame, gridSize]);

  // Check for win condition
  useEffect(() => {
    if (!isInitialized) return;
    
    const isGameWon = tiles.every(tile => tile.value === tile.position + 1);
    if (isGameWon && emptyPosition === lastPosition) {
      setIsWon(true);
    }
  }, [tiles, emptyPosition, isInitialized, lastPosition]);

  const canMoveTile = (position: number): boolean => {
    // A tile can move if it's adjacent to the empty space
    const row = Math.floor(position / gridSize);
    const col = position % gridSize;
    const emptyRow = Math.floor(emptyPosition / gridSize);
    const emptyCol = emptyPosition % gridSize;

    // Check if the tile is adjacent to the empty space
    return (
      (row === emptyRow && Math.abs(col - emptyCol) === 1) ||
      (col === emptyCol && Math.abs(row - emptyRow) === 1)
    );
  };

  const getAdjacentPositions = (position: number): number[] => {
    const row = Math.floor(position / gridSize);
    const col = position % gridSize;
    const adjacent = [];
    
    // Check up, right, down, left
    if (row > 0) adjacent.push(position - gridSize); // up
    if (col < gridSize - 1) adjacent.push(position + 1); // right
    if (row < gridSize - 1) adjacent.push(position + gridSize); // down
    if (col > 0) adjacent.push(position - 1); // left
    
    return adjacent;
  };

  const handleTileClick = (position: number) => {
    if (isWon) return;
    
    if (canMoveTile(position)) {
      // Move the tile
      const newTiles = [...tiles];
      const tileIndex = newTiles.findIndex((tile) => tile.position === position);
      
      // Skip if tile not found (shouldn't happen, but prevents runtime errors)
      if (tileIndex === -1) return;
      
      // Update the tile's position
      newTiles[tileIndex].position = emptyPosition;
      
      // Update state
      setTiles(newTiles);
      setEmptyPosition(position);
      setMoves(moves + 1);
    }
  };

  // Calculate tile size based on grid size
  const getTileSize = () => {
    switch (gridSize) {
      case 3: return 'h-[100px] w-[100px]';
      case 4: return 'h-[72px] w-[72px]';
      case 5: return 'h-[58px] w-[58px]';
      default: return 'h-[72px] w-[72px]';
    }
  };

  // Calculate grid container size based on grid size
  const getGridSize = () => {
    switch (gridSize) {
      case 3: return 'h-[320px] w-[320px]';
      case 4: return 'h-[320px] w-[320px]';
      case 5: return 'h-[320px] w-[320px]';
      default: return 'h-[320px] w-[320px]';
    }
  };

  // Calculate grid columns class based on grid size
  const getGridColumnsClass = () => {
    switch (gridSize) {
      case 3: return 'grid-cols-3';
      case 4: return 'grid-cols-4';
      case 5: return 'grid-cols-5';
      default: return 'grid-cols-4';
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="mb-6 flex flex-col items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="text-lg font-medium">
            Moves: <span className="font-bold">{moves}</span>
          </div>
          <button
            onClick={initializeGame}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            New Game
          </button>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Grid Size:</span>
          <div className="flex rounded-md shadow-sm">
            {[3, 4, 5].map((size) => (
              <button
                key={`size-${size}`}
                onClick={() => handleGridSizeChange(size as GridSize)}
                className={`px-3 py-1 text-sm font-medium ${
                  gridSize === size
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                } ${size === 3 ? 'rounded-l-md' : ''} ${size === 5 ? 'rounded-r-md' : ''}`}
              >
                {size}x{size}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {isWon && (
        <div className="mb-4 rounded-md bg-green-100 p-3 text-center text-green-800">
          <p className="font-bold">Congratulations! You solved the puzzle in {moves} moves!</p>
        </div>
      )}
      
      <div className={`grid ${getGridColumnsClass()} gap-2 rounded-md bg-gray-100 p-2 dark:bg-gray-700 ${getGridSize()}`}>
        {Array.from({ length: totalPositions }).map((_, position) => {
          const tile = tiles.find((t) => t.position === position);
          const tileSize = getTileSize();
          
          return position === emptyPosition ? (
            <div key={`empty-${position}`} className={`rounded-md bg-gray-200 dark:bg-gray-600 ${tileSize}`}></div>
          ) : (
            <button
              key={`tile-${position}-${tile?.value}`}
              onClick={() => handleTileClick(position)}
              disabled={!canMoveTile(position) || isWon}
              className={`flex items-center justify-center rounded-md bg-blue-500 text-xl font-bold text-white transition-transform hover:bg-blue-600 ${tileSize} ${
                canMoveTile(position) && !isWon ? 'hover:scale-105' : ''
              } ${isWon ? 'bg-green-500' : ''}`}
            >
              {tile?.value}
            </button>
          );
        })}
      </div>
      
      <div className="mt-6 text-center text-gray-600 dark:text-gray-400">
        <p>Slide the tiles into the correct order from 1 to {totalTiles}.</p>
        <p>The empty space should be in the bottom right corner.</p>
      </div>
    </div>
  );
} 