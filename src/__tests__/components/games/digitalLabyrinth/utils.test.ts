// This file tests the utility functions within the Digital Labyrinth game component
// We need to extract the functions from the component for testing

// Mock types based on what is in the component
interface Tile {
  value: number;
  revealed: boolean;
  userValue: number | null;
  x: number;
  y: number;
  isCorrect?: boolean;
}

interface Cell {
  x: number;
  y: number;
  index: number;
}

// Extract the utility functions from the component for testing
const GRID_SIZE = 9;
const TOTAL_CELLS = GRID_SIZE * GRID_SIZE;

// Function to generate a valid puzzle
const generateValidPuzzle = (): Tile[] => {
  // Use a mock implementation for testing
  const path = generateRandomWalk();
  const numberedGrid = assignNumbersToPath(path);
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
  
  // Reveal 30 tiles
  const revealedIndices = new Set<number>();
  const firstTileIndex = newGrid.findIndex(tile => tile.value === 1);
  const lastTileIndex = newGrid.findIndex(tile => tile.value === TOTAL_CELLS);
  revealedIndices.add(firstTileIndex);
  revealedIndices.add(lastTileIndex);
  
  while (revealedIndices.size < 30) {
    const randomIndex = Math.floor(Math.random() * TOTAL_CELLS);
    revealedIndices.add(randomIndex);
  }
  
  return newGrid.map((tile, index) => ({
    ...tile,
    revealed: revealedIndices.has(index)
  }));
};

// Generate a random walk to create a path
const generateRandomWalk = (): Cell[] => {
  // For testing, return a simple path
  const path: Cell[] = [];
  for (let i = 0; i < TOTAL_CELLS; i++) {
    const x = i % GRID_SIZE;
    const y = Math.floor(i / GRID_SIZE);
    path.push({ x, y, index: i });
  }
  return path;
};

// Assign numbers to the path
const assignNumbersToPath = (path: Cell[]): number[] => {
  const grid = Array(TOTAL_CELLS).fill(0);
  for (let i = 0; i < path.length; i++) {
    const { index } = path[i];
    grid[index] = i + 1;
  }
  return grid;
};

// Check if the solution is correct
const checkSolution = (grid: Tile[]): boolean => {
  // Find the tile with value 1
  const startTile = grid.find(tile => tile.value === 1);
  if (!startTile) return false;
  
  let current = startTile;
  const visited = new Set<number>();
  visited.add(1);
  
  while (visited.size < TOTAL_CELLS) {
    // Find the next tile
    const currentValue = current.value;
    const nextValue = currentValue + 1;
    
    // If we've reached the end, check if we've visited all cells
    if (nextValue > TOTAL_CELLS) {
      break;
    }
    
    // Find the tile with the next value
    const nextTile = grid.find(tile => tile.value === nextValue);
    if (!nextTile) return false;
    
    // Check if the next tile is adjacent to the current tile
    const dx = Math.abs(nextTile.x - current.x);
    const dy = Math.abs(nextTile.y - current.y);
    
    // Adjacent tiles can be horizontal, vertical, or diagonal (dx and dy <= 1)
    if (dx > 1 || dy > 1) return false;
    
    // Mark as visited and move to next tile
    visited.add(nextValue);
    current = nextTile;
  }
  
  return visited.size === TOTAL_CELLS;
};

// Function to find connections between tiles
const findTileConnections = (grid: Tile[], index: number): number[] => {
  const tile = grid[index];
  if (!tile) return [];
  
  const value = tile.value;
  const prevValue = value - 1;
  const nextValue = value + 1;
  
  const connections: number[] = [];
  
  if (prevValue >= 1) {
    const prevTile = grid.findIndex(t => t.value === prevValue);
    if (prevTile !== -1) {
      connections.push(prevTile);
    }
  }
  
  if (nextValue <= TOTAL_CELLS) {
    const nextTile = grid.findIndex(t => t.value === nextValue);
    if (nextTile !== -1) {
      connections.push(nextTile);
    }
  }
  
  return connections;
};

describe('Digital Labyrinth - Utils', () => {
  describe('generateValidPuzzle', () => {
    it('should generate a grid with the correct size', () => {
      const grid = generateValidPuzzle();
      expect(grid.length).toBe(TOTAL_CELLS);
    });
    
    it('should reveal at least 2 tiles (value 1 and value 81)', () => {
      const grid = generateValidPuzzle();
      const revealedTiles = grid.filter(tile => tile.revealed);
      
      // At minimum, tiles with values 1 and 81 should be revealed
      expect(revealedTiles.length).toBeGreaterThanOrEqual(2);
      
      // Specifically check for revealed tile with value 1
      const tile1 = grid.find(tile => tile.value === 1);
      expect(tile1?.revealed).toBe(true);
      
      // Specifically check for revealed tile with value 81
      const tile81 = grid.find(tile => tile.value === TOTAL_CELLS);
      expect(tile81?.revealed).toBe(true);
    });
  });
  
  describe('checkSolution', () => {
    it('should return true for a valid solution', () => {
      // Create a valid solution grid with adjacent cells
      // We'll create a snake-like pattern for simplicity
      const grid: Tile[] = [];
      let currentValue = 1;
      
      for (let y = 0; y < GRID_SIZE; y++) {
        for (let x = 0; x < GRID_SIZE; x++) {
          // For even rows, go left to right, for odd rows go right to left
          const actualX = y % 2 === 0 ? x : GRID_SIZE - 1 - x;
          const index = y * GRID_SIZE + actualX;
          
          grid[index] = {
            value: currentValue,
            revealed: true,
            userValue: currentValue,
            x: actualX,
            y
          };
          
          currentValue++;
        }
      }
      
      const result = checkSolution(grid);
      expect(result).toBe(true);
    });
    
    it('should return false if there are gaps in the sequence', () => {
      // Create a grid with a gap in the sequence
      const grid: Tile[] = [];
      for (let i = 0; i < TOTAL_CELLS; i++) {
        const x = i % GRID_SIZE;
        const y = Math.floor(i / GRID_SIZE);
        // Create a gap by setting value to 0 for one tile
        const value = i === 40 ? 0 : i + 1;
        grid.push({
          value,
          revealed: true,
          userValue: value,
          x,
          y
        });
      }
      
      const result = checkSolution(grid);
      expect(result).toBe(false);
    });
    
    it('should return false if tiles are not adjacent', () => {
      // Create a grid where two adjacent numbers in the sequence are not physically adjacent
      const grid: Tile[] = [];
      for (let i = 0; i < TOTAL_CELLS; i++) {
        let x = i % GRID_SIZE;
        let y = Math.floor(i / GRID_SIZE);
        
        // Move tile with value 41 far away from tile with value 40
        if (i === 40) {
          x = 0;
          y = 0;
        } else if (i === 39) {
          x = 8;
          y = 8;
        }
        
        grid.push({
          value: i + 1,
          revealed: true,
          userValue: i + 1,
          x,
          y
        });
      }
      
      const result = checkSolution(grid);
      expect(result).toBe(false);
    });
  });
  
  describe('findTileConnections', () => {
    it('should find previous and next connections for middle tiles', () => {
      // Create a grid with sequential tiles
      const grid: Tile[] = [];
      for (let i = 0; i < TOTAL_CELLS; i++) {
        const x = i % GRID_SIZE;
        const y = Math.floor(i / GRID_SIZE);
        grid.push({
          value: i + 1,
          revealed: true,
          userValue: i + 1,
          x,
          y
        });
      }
      
      // Test connections for a middle tile (e.g., tile with value 40)
      const index = 39; // 0-indexed, so tile with value 40
      const connections = findTileConnections(grid, index);
      
      // Should find connections to tiles with values 39 and 41
      expect(connections.length).toBe(2);
      expect(connections).toContain(38); // Index of tile with value 39
      expect(connections).toContain(40); // Index of tile with value 41
    });
    
    it('should only find next connection for first tile', () => {
      // Create a grid with sequential tiles
      const grid: Tile[] = [];
      for (let i = 0; i < TOTAL_CELLS; i++) {
        const x = i % GRID_SIZE;
        const y = Math.floor(i / GRID_SIZE);
        grid.push({
          value: i + 1,
          revealed: true,
          userValue: i + 1,
          x,
          y
        });
      }
      
      // Test connections for the first tile (value 1)
      const index = 0;
      const connections = findTileConnections(grid, index);
      
      // Should only find connection to tile with value 2
      expect(connections.length).toBe(1);
      expect(connections).toContain(1); // Index of tile with value 2
    });
    
    it('should only find previous connection for last tile', () => {
      // Create a grid with sequential tiles
      const grid: Tile[] = [];
      for (let i = 0; i < TOTAL_CELLS; i++) {
        const x = i % GRID_SIZE;
        const y = Math.floor(i / GRID_SIZE);
        grid.push({
          value: i + 1,
          revealed: true,
          userValue: i + 1,
          x,
          y
        });
      }
      
      // Test connections for the last tile (value 81)
      const index = TOTAL_CELLS - 1;
      const connections = findTileConnections(grid, index);
      
      // Should only find connection to tile with value 80
      expect(connections.length).toBe(1);
      expect(connections).toContain(TOTAL_CELLS - 2); // Index of tile with value 80
    });
  });
}); 