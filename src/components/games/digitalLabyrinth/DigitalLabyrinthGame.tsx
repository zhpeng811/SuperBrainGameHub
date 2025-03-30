'use client';

import React, { useState, useEffect, useCallback, KeyboardEvent, useRef } from 'react';
import { useTranslations } from 'next-intl';

interface Tile {
  value: number;
  revealed: boolean;
  userValue: number | null;
  x: number;
  y: number;
  isCorrect?: boolean;
}

// Path cell in the random walk
interface Cell {
  x: number;
  y: number;
  index: number;
}

export default function DigitalLabyrinthGame() {
  const t = useTranslations('digitalLabyrinth');
  const GRID_SIZE = 9;
  const TOTAL_CELLS = GRID_SIZE * GRID_SIZE;
  const INITIAL_REVEALED = 30;
  
  const [grid, setGrid] = useState<Tile[]>([]);
  const [selectedTile, setSelectedTile] = useState<number | null>(null);
  const [inputValue, setInputValue] = useState<string>('');
  const [isComplete, setIsComplete] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [immediateValidation, setImmediateValidation] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showLines, setShowLines] = useState(false);

  // Add refs to track tile elements
  const tileRefs = useRef<Array<HTMLDivElement | null>>(Array(TOTAL_CELLS).fill(null));
  // Add a ref for the input element
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Create a callback function for the ref
  const setTileRef = useCallback((el: HTMLDivElement | null, index: number) => {
    tileRefs.current[index] = el;
  }, []);

  // Initialize the game
  const initializeGame = useCallback(() => {
    // Create a valid puzzle
    const generatedGrid = generateValidPuzzle();
    setGrid(generatedGrid);
    setIsComplete(false);
    setIsCorrect(false);
    setSelectedTile(null);
    setInputValue('');
    setErrorMessage(null);
  }, []);

  // Generate a valid puzzle with a solution
  const generateValidPuzzle = (): Tile[] => {
    // Step 1: Generate a random path through all cells without considering numbers
    const path = generateRandomWalk();
    
    // Step 2: Assign numbers 1-81 to the path in order
    const numberedGrid = assignNumbersToPath(path);
    
    // Step 3: Create the game grid from the numbered grid
    const newGrid: Tile[] = [];
    
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        const index = y * GRID_SIZE + x;
        newGrid.push({
          value: numberedGrid[index],
          revealed: false,
          userValue: null,
          x,
          y
        });
      }
    }
    
    // Step 4: Reveal INITIAL_REVEALED tiles, always including 1 and 81
    const revealedIndices = new Set<number>();
    
    // Find the indices of values 1 and 81
    const firstTileIndex = newGrid.findIndex(tile => tile.value === 1);
    const lastTileIndex = newGrid.findIndex(tile => tile.value === TOTAL_CELLS);
    revealedIndices.add(firstTileIndex);
    revealedIndices.add(lastTileIndex);
    
    // Reveal remaining random tiles
    while (revealedIndices.size < INITIAL_REVEALED) {
      const randomIndex = Math.floor(Math.random() * TOTAL_CELLS);
      revealedIndices.add(randomIndex);
    }
    
    // Update the grid with revealed tiles
    return newGrid.map((tile, index) => ({
      ...tile,
      revealed: revealedIndices.has(index)
    }));
  };

  // Step 1: Generate a random path through all cells without considering numbers
  const generateRandomWalk = (): Cell[] => {
    // Define possible moves (horizontally, vertically, and diagonally)
    const directions = [
      { dx: -1, dy: -1 }, // top-left
      { dx: 0, dy: -1 },  // top
      { dx: 1, dy: -1 },  // top-right
      { dx: -1, dy: 0 },  // left
      { dx: 1, dy: 0 },   // right
      { dx: -1, dy: 1 },  // bottom-left
      { dx: 0, dy: 1 },   // bottom
      { dx: 1, dy: 1 }    // bottom-right
    ];
    
    // Try multiple times in case we get stuck
    const MAX_ATTEMPTS = 100;
    
    for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
      // Start with an empty grid tracking visited cells
      const visited = Array(TOTAL_CELLS).fill(false);
      const path: Cell[] = [];
      
      // Pick a random starting point
      const startX = Math.floor(Math.random() * GRID_SIZE);
      const startY = Math.floor(Math.random() * GRID_SIZE);
      const startIndex = startY * GRID_SIZE + startX;
      
      visited[startIndex] = true;
      path.push({ x: startX, y: startY, index: startIndex });
      
      // Current position
      let currentX = startX;
      let currentY = startY;
      
      // Use Warnsdorff's algorithm to help complete the path
      // This helps by choosing cells with the fewest unvisited neighbors
      while (path.length < TOTAL_CELLS) {
        // Check all 8 directions
        const validMoves: { dx: number, dy: number, neighbors: number }[] = [];
        
        for (const dir of directions) {
          const newX = currentX + dir.dx;
          const newY = currentY + dir.dy;
          
          // Skip invalid moves
          if (newX < 0 || newX >= GRID_SIZE || newY < 0 || newY >= GRID_SIZE) continue;
          
          const newIndex = newY * GRID_SIZE + newX;
          
          // Skip already visited cells
          if (visited[newIndex]) continue;
          
          // Count unvisited neighbors of this cell (Warnsdorff's heuristic)
          let neighborCount = 0;
          for (const nDir of directions) {
            const nnX = newX + nDir.dx;
            const nnY = newY + nDir.dy;
            
            if (nnX < 0 || nnX >= GRID_SIZE || nnY < 0 || nnY >= GRID_SIZE) continue;
            
            const nnIndex = nnY * GRID_SIZE + nnX;
            
            if (!visited[nnIndex]) neighborCount++;
          }
          
          validMoves.push({ dx: dir.dx, dy: dir.dy, neighbors: neighborCount });
        }
        
        // If no valid moves, backtracking needed
        if (validMoves.length === 0) {
          // Try to backtrack by looking at previously visited cells
          // that still have unvisited neighbors
          let backtrackFound = false;
          
          // Check path in reverse order to minimize jumping distance
          for (let i = path.length - 1; i >= 0; i--) {
            const cell = path[i];
            
            // See if this cell has any unvisited neighbors
            for (const dir of directions) {
              const nx = cell.x + dir.dx;
              const ny = cell.y + dir.dy;
              
              if (nx < 0 || nx >= GRID_SIZE || ny < 0 || ny >= GRID_SIZE) continue;
              
              const nIndex = ny * GRID_SIZE + nx;
              
              if (!visited[nIndex]) {
                // Move to this cell for our next iteration
                currentX = cell.x;
                currentY = cell.y;
                backtrackFound = true;
                break;
              }
            }
            
            if (backtrackFound) break;
          }
          
          // If backtracking doesn't help, this attempt is a failure
          if (!backtrackFound) break;
          
          // Try again from the backtracked position
          continue;
        }
        
        // Sort by the number of unvisited neighbors (Warnsdorff's rule)
        // Add some randomness when neighbors are equal
        validMoves.sort((a, b) => {
          if (a.neighbors === b.neighbors) {
            return Math.random() - 0.5;
          }
          return a.neighbors - b.neighbors;
        });
        
        // Pick the move with the fewest unvisited neighbors
        const bestMove = validMoves[0];
        const newX = currentX + bestMove.dx;
        const newY = currentY + bestMove.dy;
        const newIndex = newY * GRID_SIZE + newX;
        
        // Add to path
        visited[newIndex] = true;
        path.push({ x: newX, y: newY, index: newIndex });
        
        // Update current position
        currentX = newX;
        currentY = newY;
      }
      
      // If we've visited all cells, we've found a valid path
      if (path.length === TOTAL_CELLS) {
        return path;
      }
    }
    
    // If all attempts failed, fall back to a simple snake pattern
    return createFallbackPath();
  };
  
  // Step 2: Assign numbers 1-81 to the path in sequence
  const assignNumbersToPath = (path: Cell[]): number[] => {
    const grid = Array(TOTAL_CELLS).fill(0);
    
    // Assign numbers 1 through 81 sequentially along the path
    for (let i = 0; i < path.length; i++) {
      const cell = path[i];
      grid[cell.index] = i + 1;
    }
    
    return grid;
  };
  
  // Create a simple fallback path as a last resort
  const createFallbackPath = (): Cell[] => {
    const path: Cell[] = [];
    
    // Create a snake pattern path (up and down rows)
    for (let y = 0; y < GRID_SIZE; y++) {
      if (y % 2 === 0) {
        // Left to right
        for (let x = 0; x < GRID_SIZE; x++) {
          const index = y * GRID_SIZE + x;
          path.push({ x, y, index });
        }
      } else {
        // Right to left
        for (let x = GRID_SIZE - 1; x >= 0; x--) {
          const index = y * GRID_SIZE + x;
          path.push({ x, y, index });
        }
      }
    }
    
    return path;
  };

  // Handle number input for a tile
  const handleTileInput = (index: number) => {
    if (grid[index].revealed) return;
    
    // If a tile is already selected, just switch the selection
    setSelectedTile(index);
    setInputValue('');
    setErrorMessage(null);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Handle double click to clear a tile value
  const handleTileClear = (index: number) => {
    // Ignore revealed tiles and already empty tiles
    if (grid[index].revealed || grid[index].userValue === null) return;
    
    // Clear the tile's value
    const newGrid = [...grid];
    newGrid[index] = {
      ...newGrid[index],
      userValue: null,
      isCorrect: undefined
    };
    
    setGrid(newGrid);
    
    // Clear any error messages
    setErrorMessage(null);
    
    // If immediate validation is on, check again
    if (immediateValidation) {
      setTimeout(() => {
        const allFilled = allTilesFilled();
        if (allFilled) {
          submitAnswer();
        }
      }, 10);
    }
  };

  // Handle typed input for a tile
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Only allow numbers
    if (/^\d*$/.test(value) && value.length <= 2) {
      setInputValue(value);
    }
  };

  // Handle key press in the input field
  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      submitNumber();
    }
  };

  // Submit the typed number
  const submitNumber = () => {
    if (selectedTile === null) return;
    
    // Check if the input is a valid number
    const numValue = parseInt(inputValue);
    if (isNaN(numValue) || numValue < 1 || numValue > TOTAL_CELLS) {
      setErrorMessage(t('invalidInput'));
      return;
    }
    
    // Check if this number is already used elsewhere
    const numberExists = grid.some(tile => 
      (tile.revealed && tile.value === numValue) || 
      (!tile.revealed && tile.userValue === numValue)
    );
    
    if (numberExists) {
      setErrorMessage(t('tileOccupied'));
      return;
    }
    
    // If immediate validation is on, also check if the number connects sequentially
    if (immediateValidation) {
      const updatedGrid = [...grid];
      updatedGrid[selectedTile] = {
        ...updatedGrid[selectedTile],
        userValue: numValue
      };
      
      const connections = findTileConnections(updatedGrid, selectedTile);
      if (!connections.isValid) {
        setErrorMessage(t('notSequential'));
        return;
      }
    }
    
    // Apply the number
    setGrid(prev => {
      const updatedGrid = [...prev];
      updatedGrid[selectedTile] = {
        ...updatedGrid[selectedTile],
        userValue: numValue
      };
      return updatedGrid;
    });
    
    setInputValue('');
    setSelectedTile(null);
      setErrorMessage(null);
    
    // If immediate validation is on, check if the puzzle is complete
    if (immediateValidation) {
      setTimeout(() => {
        const allFilled = allTilesFilled();
        if (allFilled) {
          submitAnswer();
        }
      }, 10);
    }
  };

  // Submit and verify final answer
  const submitAnswer = () => {
    // First check if all tiles have been filled
    const allFilled = grid.every(tile => tile.revealed || tile.userValue !== null);
    
    if (!allFilled) {
      setErrorMessage(t('fillAllTiles'));
      return;
    }
    
    // Clear error message
    setErrorMessage(null);
    
    // Check if the solution is correct
    const isCorrect = checkSolution(grid);
    setIsCorrect(isCorrect);
    setIsComplete(true);
  };

  // Check if all tiles have been filled
  const allTilesFilled = () => {
    return grid.every(tile => tile.revealed || tile.userValue !== null);
  };

  // Toggle immediate validation
  const toggleValidation = () => {
    setImmediateValidation(prev => !prev);
    
    // Update existing tiles if necessary
    if (!immediateValidation) {
      // When turning validation ON, check all existing user values
      const newGrid = grid.map(tile => {
        if (tile.userValue !== null) {
          return {
            ...tile,
            isCorrect: tile.userValue === tile.value
          };
        }
        return tile;
      });
      setGrid(newGrid);
    } else {
      // When turning validation OFF, clear validations
      const newGrid = grid.map(tile => {
        if (tile.userValue !== null) {
          return {
            ...tile,
            isCorrect: undefined
          };
        }
        return tile;
      });
      setGrid(newGrid);
    }
  };

  // Check if the user's solution is correct
  const checkSolution = (grid: Tile[]): boolean => {
    // Create a combined grid where we use the actual value for revealed tiles
    // and the user's value for hidden tiles
    const combinedGrid = grid.map(tile => ({
      value: tile.revealed ? tile.value : (tile.userValue || 0),
      x: tile.x,
      y: tile.y
    }));
    
    // For each number from 1 to 80, check if the next number is adjacent
    for (let num = 1; num < TOTAL_CELLS; num++) {
      const currentTile = combinedGrid.find(t => t.value === num);
      const nextTile = combinedGrid.find(t => t.value === num + 1);
      
      if (!currentTile || !nextTile) return false;
      
      // Check if the tiles are adjacent (horizontally, vertically, or diagonally)
      const dx = Math.abs(currentTile.x - nextTile.x);
      const dy = Math.abs(currentTile.y - nextTile.y);
      
      // Tiles are adjacent if the difference in x and y is at most 1
      if (dx > 1 || dy > 1) return false;
    }
    
    return true;
  };

  // Start a new game
  const handleNewGame = () => {
    initializeGame();
  };

  // Initialize the game on component mount
  useEffect(() => {   
    initializeGame();
  }, [initializeGame]);

  // Handle keyboard navigation with arrow keys
  useEffect(() => {
    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      // Only handle arrow keys if we have a selection and game is not complete
      if (selectedTile === null || isComplete) return;
      
      const currentX = selectedTile % GRID_SIZE;
      const currentY = Math.floor(selectedTile / GRID_SIZE);
      
      // Direction vector based on key pressed
      let dx = 0;
      let dy = 0;
      
      // Set direction based on arrow key
      switch (e.key) {
        case 'ArrowUp':
          dy = -1;
          break;
        case 'ArrowDown':
          dy = 1;
          break;
        case 'ArrowLeft':
          dx = -1;
          break;
        case 'ArrowRight':
          dx = 1;
          break;
        default:
          return; // Not an arrow key, do nothing
      }
      
      // Find the next non-revealed tile in the chosen direction
      let newX = currentX;
      let newY = currentY;
      let foundTile = false;
      
      // Continue moving in the direction until reaching edge or finding a modifiable tile
      while (true) {
        newX += dx;
        newY += dy;
        
        // Stop if we've reached the edge of the grid
        if (newX < 0 || newX >= GRID_SIZE || newY < 0 || newY >= GRID_SIZE) {
          // Revert to last valid position
          newX -= dx;
          newY -= dy;
          break;
        }
        
        // Calculate the index of the potential new position
        const newIndex = newY * GRID_SIZE + newX;
        
        // If the tile is not revealed, we can select it
        if (!grid[newIndex].revealed) {
          foundTile = true;
          break;
        }
      }
      
      // Only update selection if we found a valid tile to move to
      if (foundTile) {
        const newIndex = newY * GRID_SIZE + newX;
        setSelectedTile(newIndex);
      }
      
      // Prevent default scrolling behavior
      e.preventDefault();
    };
    
    // Add event listener
    window.addEventListener('keydown', handleKeyDown);
    
    // Clean up
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedTile, grid, GRID_SIZE, isComplete]);

  // Focus the input element when a tile is selected
  useEffect(() => {
    if (selectedTile !== null && inputRef.current) {
      inputRef.current.focus();
    }
  }, [selectedTile]);

  // Additional helper functions related to connections and validation
  
  const findTileConnections = (grid: Tile[], index: number) => {
    const tile = grid[index];
    
    // Get the tile value (either revealed value or user input)
    const tileValue = tile.revealed ? tile.value : tile.userValue;
    
    if (tileValue === null) return { isValid: false, connections: [] };
    
    // Look for neighboring tiles with values +1 or -1 from current value
    const prevValue = tileValue - 1;
    const nextValue = tileValue + 1;
    
    const connections: number[] = [];
    let isValid = false;
    
    // Check all 8 directions around the tile
    const directions = [
      { dx: -1, dy: -1 }, // top-left
      { dx: 0, dy: -1 },  // top
      { dx: 1, dy: -1 },  // top-right
      { dx: -1, dy: 0 },  // left
      { dx: 1, dy: 0 },   // right
      { dx: -1, dy: 1 },  // bottom-left
      { dx: 0, dy: 1 },   // bottom
      { dx: 1, dy: 1 }    // bottom-right
    ];
    
    // Calculate the current tile's x and y position
    const x = index % GRID_SIZE;
    const y = Math.floor(index / GRID_SIZE);
    
    for (const dir of directions) {
      const newX = x + dir.dx;
      const newY = y + dir.dy;
      
      // Skip if out of bounds
      if (newX < 0 || newX >= GRID_SIZE || newY < 0 || newY >= GRID_SIZE) continue;
      
      const neighborIndex = newY * GRID_SIZE + newX;
      const neighbor = grid[neighborIndex];
      
      // Skip empty tiles
      if (!neighbor.revealed && neighbor.userValue === null) continue;
      
      const neighborValue = neighbor.revealed ? neighbor.value : neighbor.userValue;
      
      if (neighborValue === prevValue || neighborValue === nextValue) {
        connections.push(neighborIndex);
        isValid = true;
      }
    }
    
    return { isValid, connections };
  };

  const renderGameBoard = () => {
    if (!grid || grid.length === 0) return null;

  return (
      <div 
        className="grid grid-cols-9 gap-1 mb-6"
      >
        {grid.map((tile, index) => {
          // Find connections for this tile if needed
          const connections = showLines ? findTileConnections(grid, index) : { isValid: false, connections: [] };
          
          return (
            <div 
              key={index}
              ref={el => setTileRef(el, index)}
              className={`relative flex items-center justify-center rounded border text-lg font-bold h-10 w-10 ${
                selectedTile === index
                  ? 'border-blue-500 bg-blue-50'
                  : tile.revealed
                  ? 'border-gray-300 bg-gray-200 text-gray-900'
                  : tile.isCorrect === true
                  ? 'border-green-200 bg-green-50 text-green-900'
                  : tile.isCorrect === false
                  ? 'border-red-200 bg-red-50 text-red-900'
                  : 'cursor-pointer border-gray-200 bg-white hover:bg-gray-50'
              }`}
              onClick={() => {
                if (!tile.revealed && !isComplete) {
                  handleTileInput(index);
                }
              }}
            >
              {tile.revealed ? tile.value : tile.userValue}
              
              {/* Show connection lines if enabled */}
              {showLines && connections.connections.map(connectedIndex => {
                // Don't draw lines for empty tiles
                if (tile.revealed === false && tile.userValue === null) return null;
                
                // Get the positions of both tiles
                const thisEl = tileRefs.current[index];
                const connectedEl = tileRefs.current[connectedIndex];
                
                if (!thisEl || !connectedEl) return null;
                
                // Get the center points
                const thisRect = thisEl.getBoundingClientRect();
                const connectedRect = connectedEl.getBoundingClientRect();
                
                // Calculate relative position
                const thisX = thisRect.left + thisRect.width/2;
                const thisY = thisRect.top + thisRect.height/2;
                const connectedX = connectedRect.left + connectedRect.width/2;
                const connectedY = connectedRect.top + connectedRect.height/2;
                
                // Calculate line properties relative to this tile's position
                const dx = connectedX - thisX;
                const dy = connectedY - thisY;
                const length = Math.sqrt(dx*dx + dy*dy);
                const angle = Math.atan2(dy, dx) * 180 / Math.PI;
                
                // Get the values to determine if they're sequential
                const thisValue = tile.revealed ? tile.value : tile.userValue;
                const connectedValue = grid[connectedIndex].revealed 
                  ? grid[connectedIndex].value 
                  : grid[connectedIndex].userValue;
                
                // Only draw lines between sequential numbers
                if (thisValue !== null && connectedValue !== null && 
                    (thisValue === connectedValue + 1 || thisValue === connectedValue - 1)) {
                return (
                    <div 
                      key={`line-${index}-${connectedIndex}`}
                      className="absolute pointer-events-none"
                      style={{
                        width: `${length}px`,
                        height: '2px',
                        backgroundColor: 'rgba(59, 130, 246, 0.5)',
                        transformOrigin: '0 50%',
                        transform: `rotate(${angle}deg)`,
                        zIndex: 10,
                        left: '50%',
                        top: '50%'
                      }}
                    />
                  );
                }
                
                return null;
              })}
          </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center">
      <div className="mb-4 flex gap-2">
        <button
          onClick={handleNewGame}
          className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          {t('newGame')}
        </button>
        
        <button
          onClick={() => setShowLines(!showLines)}
          className="rounded px-4 py-2 text-sm font-medium bg-gray-100 hover:bg-gray-200 text-gray-700"
        >
          {showLines ? t('hideLines') : t('showLines')}
        </button>
        
        <button
          onClick={toggleValidation}
          className="rounded px-4 py-2 text-sm font-medium bg-gray-100 hover:bg-gray-200 text-gray-700"
        >
          {immediateValidation ? t('disableValidation') : t('immediateValidation')}
        </button>
      </div>
      
      {renderGameBoard()}
      
      {selectedTile !== null && !isComplete && (
        <div className="mb-4 flex space-x-2">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            className="w-16 rounded border border-gray-300 px-3 py-2 text-center text-lg font-medium text-gray-900"
            autoFocus
          />
          <button
            onClick={submitNumber}
            className="rounded bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
          >
            {t('submit')}
          </button>
          <button
            onClick={() => {
              if (selectedTile !== null) {
                handleTileClear(selectedTile);
                setSelectedTile(null);
              }
            }}
            className="rounded bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300"
          >
            {t('clear')}
          </button>
        </div>
      )}
      
      {!isComplete && allTilesFilled() && (
        <div className="mb-4">
          <button
            onClick={submitAnswer}
            className="rounded bg-indigo-600 px-6 py-3 text-base font-medium text-white hover:bg-indigo-700"
          >
            {t('checkAnswer')}
          </button>
        </div>
      )}
      
      {errorMessage && (
        <div className="mb-4 rounded bg-red-50 p-3 text-red-800">
          {errorMessage}
        </div>
      )}
      
      {isComplete && (
        <div className={`mb-4 rounded p-4 text-center ${
          isCorrect 
            ? 'bg-green-50 text-green-800' 
            : 'bg-red-50 text-red-800'
        }`}>
          <p className="text-lg font-bold">
            {isCorrect ? t('correct') : t('incorrect')}
          </p>
        </div>
      )}
      
      <div className="mt-8 rounded bg-blue-50 p-4">
        <h3 className="mb-2 text-lg font-semibold text-gray-900">
          {t('instructionsTitle')}
        </h3>
        <ul className="list-inside list-disc space-y-1 text-gray-700">
          <li>{t('instructions.fillBlanks')}</li>
          <li>{t('instructions.sequential')}</li>
          <li>{t('instructions.noRepeat')}</li>
          <li>{t('instructions.complete')}</li>
        </ul>
      </div>
    </div>
  );
} 