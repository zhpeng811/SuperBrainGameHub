'use client';

import React, { useState, useEffect, useCallback, KeyboardEvent, useRef } from 'react';

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
    if (selectedTile === null || !inputValue) return;
    
    const number = parseInt(inputValue, 10);
    
    // Validate the number is in the valid range
    if (number >= 1 && number <= TOTAL_CELLS) {
      const newGrid = [...grid];
      const correctValue = newGrid[selectedTile].value;
      
      newGrid[selectedTile] = {
        ...newGrid[selectedTile],
        userValue: number,
        isCorrect: immediateValidation ? number === correctValue : undefined
      };
      
      setGrid(newGrid);
      // Keep the current tile selected instead of setting to null
      setInputValue('');
      
      // Clear any error messages when the user makes progress
      setErrorMessage(null);
    } else {
      // Alert the user if the number is invalid
      alert(`Please enter a number between 1 and ${TOTAL_CELLS}`);
    }
  };

  // Submit and verify final answer
  const submitAnswer = () => {
    // First check if all tiles have been filled
    const allFilled = grid.every(tile => tile.revealed || tile.userValue !== null);
    
    if (!allFilled) {
      setErrorMessage("Please fill in all empty tiles before submitting your answer.");
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
    setImmediateValidation(!immediateValidation);
    
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

  // Add a function to check if two numbers are sequential
  const areSequential = (a: number, b: number) => {
    return Math.abs(a - b) === 1;
  };

  // Update the findConnections function to work with the feedback feature
  const findConnections = () => {
    const connections: [number, number][] = [];
    
    // Check horizontal and vertical adjacencies
    for (let i = 0; i < grid.length; i++) {
      const x = i % GRID_SIZE;
      const y = Math.floor(i / GRID_SIZE);
      
      // Get the current tile's actual value (whether revealed or user input)
      const currentValue = grid[i].revealed ? grid[i].value : grid[i].userValue;
      
      // Skip if the tile is empty (no revealed value and no user input)
      if (currentValue === null) continue;
      
      // For user-filled tiles with immediate validation on, only consider correct tiles
      if (!grid[i].revealed && grid[i].userValue !== null && immediateValidation && grid[i].userValue !== grid[i].value) {
        continue;
      }
      
      // Check right neighbor
      if (x < GRID_SIZE - 1) {
        const rightIdx = i + 1;
        const rightValue = grid[rightIdx].revealed ? grid[rightIdx].value : grid[rightIdx].userValue;
        
        // Skip if the right tile is empty
        if (rightValue !== null) {
          // For user-filled tiles with immediate validation on, only consider correct tiles
          if (!(
            !grid[rightIdx].revealed && 
            grid[rightIdx].userValue !== null && 
            immediateValidation && 
            grid[rightIdx].userValue !== grid[rightIdx].value
          )) {
            // Connect if the values are sequential
            if (areSequential(currentValue, rightValue)) {
              connections.push([i, rightIdx]);
            }
          }
        }
      }
      
      // Check bottom neighbor
      if (y < GRID_SIZE - 1) {
        const bottomIdx = i + GRID_SIZE;
        const bottomValue = grid[bottomIdx].revealed ? grid[bottomIdx].value : grid[bottomIdx].userValue;
        
        // Skip if the bottom tile is empty
        if (bottomValue !== null) {
          // For user-filled tiles with immediate validation on, only consider correct tiles
          if (!(
            !grid[bottomIdx].revealed && 
            grid[bottomIdx].userValue !== null && 
            immediateValidation && 
            grid[bottomIdx].userValue !== grid[bottomIdx].value
          )) {
            // Connect if the values are sequential
            if (areSequential(currentValue, bottomValue)) {
              connections.push([i, bottomIdx]);
            }
          }
        }
      }
      
      // Check diagonal bottom-right neighbor
      if (x < GRID_SIZE - 1 && y < GRID_SIZE - 1) {
        const diagIdx = i + GRID_SIZE + 1;
        const diagValue = grid[diagIdx].revealed ? grid[diagIdx].value : grid[diagIdx].userValue;
        
        // Skip if the diagonal tile is empty
        if (diagValue !== null) {
          // For user-filled tiles with immediate validation on, only consider correct tiles
          if (!(
            !grid[diagIdx].revealed && 
            grid[diagIdx].userValue !== null && 
            immediateValidation && 
            grid[diagIdx].userValue !== grid[diagIdx].value
          )) {
            // Connect if the values are sequential
            if (areSequential(currentValue, diagValue)) {
              connections.push([i, diagIdx]);
            }
          }
        }
      }
      
      // Check diagonal bottom-left neighbor
      if (x > 0 && y < GRID_SIZE - 1) {
        const diagIdx = i + GRID_SIZE - 1;
        const diagValue = grid[diagIdx].revealed ? grid[diagIdx].value : grid[diagIdx].userValue;
        
        // Skip if the diagonal tile is empty
        if (diagValue !== null) {
          // For user-filled tiles with immediate validation on, only consider correct tiles
          if (!(
            !grid[diagIdx].revealed && 
            grid[diagIdx].userValue !== null && 
            immediateValidation && 
            grid[diagIdx].userValue !== grid[diagIdx].value
          )) {
            // Connect if the values are sequential
            if (areSequential(currentValue, diagValue)) {
              connections.push([i, diagIdx]);
            }
          }
        }
      }
      
      // Check diagonal top-right neighbor
      if (x < GRID_SIZE - 1 && y > 0) {
        const diagIdx = i - GRID_SIZE + 1;
        const diagValue = grid[diagIdx].revealed ? grid[diagIdx].value : grid[diagIdx].userValue;
        
        // Skip if the diagonal tile is empty
        if (diagValue !== null) {
          // For user-filled tiles with immediate validation on, only consider correct tiles
          if (!(
            !grid[diagIdx].revealed && 
            grid[diagIdx].userValue !== null && 
            immediateValidation && 
            grid[diagIdx].userValue !== grid[diagIdx].value
          )) {
            // Connect if the values are sequential
            if (areSequential(currentValue, diagValue)) {
              connections.push([i, diagIdx]);
            }
          }
        }
      }
      
      // Check diagonal top-left neighbor
      if (x > 0 && y > 0) {
        const diagIdx = i - GRID_SIZE - 1;
        const diagValue = grid[diagIdx].revealed ? grid[diagIdx].value : grid[diagIdx].userValue;
        
        // Skip if the diagonal tile is empty
        if (diagValue !== null) {
          // For user-filled tiles with immediate validation on, only consider correct tiles
          if (!(
            !grid[diagIdx].revealed && 
            grid[diagIdx].userValue !== null && 
            immediateValidation && 
            grid[diagIdx].userValue !== grid[diagIdx].value
          )) {
            // Connect if the values are sequential
            if (areSequential(currentValue, diagValue)) {
              connections.push([i, diagIdx]);
            }
          }
        }
      }
    }
    
    return connections;
  };

  return (
    <div className="flex flex-col items-center">
      <div className="mb-6 flex flex-col items-center gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={handleNewGame}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            New Game
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleValidation}
              className={`relative inline-flex h-6 w-11 items-center rounded-full ${immediateValidation ? 'bg-blue-600' : 'bg-gray-200'}`}
            >
              <span className="sr-only">Show correctness</span>
              <span
                className={`${immediateValidation ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition`}
              />
            </button>
            <label className="text-sm text-gray-700 dark:text-gray-300">
              Show correctness
            </label>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowLines(!showLines)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full ${showLines ? 'bg-blue-600' : 'bg-gray-200'}`}
            >
              <span className="sr-only">Show connections</span>
              <span
                className={`${showLines ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition`}
              />
            </button>
            <label className="text-sm text-gray-700 dark:text-gray-300">
              Show connections
            </label>
          </div>
        </div>
      </div>
      
      {isComplete && (
        <div className={`mb-4 rounded-md p-3 text-center ${isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          <p className="font-bold">
            {isCorrect 
              ? 'Congratulations! You completed the Digital Labyrinth!'
              : 'Your solution is not correct. Try again!'}
          </p>
        </div>
      )}
      
      {errorMessage && (
        <div className="mb-4 rounded-md bg-yellow-100 p-3 text-center text-yellow-800">
          <p>{errorMessage}</p>
        </div>
      )}
      
      <div className="relative">
        <div className="grid grid-cols-9 gap-1">
          {grid.map((tile, index) => (
            <div 
              key={index}
              ref={el => setTileRef(el, index)}
              className={`flex h-10 w-10 items-center justify-center rounded-md text-sm font-bold
                ${selectedTile === index ? 'ring-2 ring-yellow-400 ring-offset-2 ring-offset-gray-100 dark:ring-offset-gray-700' : ''}
                ${tile.revealed 
                  ? 'bg-blue-500 text-white' 
                  : tile.userValue 
                    ? tile.isCorrect === undefined
                      ? 'bg-orange-500 text-white' // Uncertainty (validation off)
                      : tile.isCorrect
                        ? 'bg-green-500 text-white' // Correct answer
                        : 'bg-red-500 text-white'   // Wrong answer
                    : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                }
                ${isComplete && !isCorrect && !tile.revealed ? 'bg-red-500 text-white' : ''}
                ${(tile.revealed || isComplete) ? 'cursor-not-allowed' : 'cursor-pointer'}
              `}
              onClick={() => {
                if (!tile.revealed && !isComplete) {
                  handleTileInput(index);
                }
              }}
              onDoubleClick={() => {
                if (!tile.revealed && !isComplete) {
                  handleTileClear(index);
                }
              }}
            >
              {tile.revealed ? tile.value : tile.userValue || ''}
            </div>
          ))}
        </div>
        
        {/* Separate overlay for the lines */}
        {showLines && (
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{ zIndex: 10 }}
          >
            <svg className="w-full h-full">
              {findConnections().map(([start, end], idx) => {
                const startEl = tileRefs.current[start];
                const endEl = tileRefs.current[end];
                
                if (!startEl || !endEl) return null;
                
                const startRect = startEl.getBoundingClientRect();
                const endRect = endEl.getBoundingClientRect();
                const containerRect = startEl.parentElement?.parentElement?.getBoundingClientRect();
                
                if (!containerRect) return null;
                
                // Calculate center points relative to the container
                const startX = startRect.left + startRect.width / 2 - containerRect.left;
                const startY = startRect.top + startRect.height / 2 - containerRect.top;
                const endX = endRect.left + endRect.width / 2 - containerRect.left;
                const endY = endRect.top + endRect.height / 2 - containerRect.top;
                
                return (
                  <line 
                    key={`line-${idx}`}
                    x1={startX} 
                    y1={startY} 
                    x2={endX} 
                    y2={endY}
                    stroke="black" 
                    strokeWidth="3" 
                  />
                );
              })}
            </svg>
          </div>
        )}
      </div>
      
      {selectedTile !== null && (
        <div className="mt-4 flex items-center gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
            placeholder="Enter number (1-81)"
            autoFocus
            className="rounded-md border border-gray-300 px-3 py-2 text-center text-lg font-medium"
          />
          <button
            onClick={submitNumber}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Submit
          </button>
        </div>
      )}
      
      {allTilesFilled() && !isComplete && (
        <div className="mt-6">
          <button
            onClick={submitAnswer}
            className="rounded-md bg-green-600 px-6 py-3 text-base font-medium text-white hover:bg-green-700"
          >
            Submit Answer
          </button>
        </div>
      )}
      
      <div className="mt-6 text-center text-gray-600 dark:text-gray-400">
        <p>Connect numbers 1 to 81 by filling in missing numbers.</p>
        <p>Each number must be adjacent to the next number in sequence.</p>
        <p>Connections can be horizontal, vertical, or diagonal.</p>
      </div>
    </div>
  );
} 