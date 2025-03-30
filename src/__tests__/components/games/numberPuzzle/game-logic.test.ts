import { describe, it, expect } from '@jest/globals';

// Create a simplified version of the initialization function 
// to test the shuffling logic independently
interface Tile {
  value: number;
  position: number;
}

function initializeGame(gridSize: number): { tiles: Tile[], emptyPosition: number } {
  // Calculate total positions based on grid size
  const totalPositions = gridSize * gridSize;
  // Last position (empty space) is always totalPositions - 1
  const lastPosition = totalPositions - 1;
  // Total number of tiles is one less than total positions
  const totalTiles = totalPositions - 1;
  
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
    const adjacentPositions = getAdjacentPositions(currentEmptyPos, gridSize);
    
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
  
  return { tiles: orderedTiles, emptyPosition: currentEmptyPos };
}

function getAdjacentPositions(position: number, gridSize: number): number[] {
  const row = Math.floor(position / gridSize);
  const col = position % gridSize;
  const adjacent = [];
  
  // Check up, right, down, left
  if (row > 0) adjacent.push(position - gridSize); // up
  if (col < gridSize - 1) adjacent.push(position + 1); // right
  if (row < gridSize - 1) adjacent.push(position + gridSize); // down
  if (col > 0) adjacent.push(position - 1); // left
  
  return adjacent;
}

function isSolved(tiles: Tile[], emptyPosition: number, gridSize: number): boolean {
  const lastPosition = gridSize * gridSize - 1;
  return emptyPosition === lastPosition && tiles.every(tile => tile.value === tile.position + 1);
}

describe('NumberPuzzle - Game Logic', () => {
  describe('initializeGame', () => {
    it('should create the correct number of tiles for a given grid size', () => {
      const gridSize = 3;
      const { tiles } = initializeGame(gridSize);
      
      // For a 3x3 grid, there should be 8 tiles
      expect(tiles.length).toBe(gridSize * gridSize - 1);
      
      // Check that all tiles have values 1 through 8
      const values = tiles.map(tile => tile.value).sort();
      expect(values).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
    });
    
    it('should place all tiles in valid positions', () => {
      const gridSize = 4;
      const { tiles, emptyPosition } = initializeGame(gridSize);
      const totalPositions = gridSize * gridSize;
      
      // Check that all positions are used exactly once
      const positions = [...tiles.map(tile => tile.position), emptyPosition];
      positions.sort((a, b) => a - b);
      
      // Positions should be 0 through 15 for a 4x4 grid
      const expectedPositions = Array.from({ length: totalPositions }, (_, i) => i);
      expect(positions).toEqual(expectedPositions);
    });
    
    it('should generate different configurations when called multiple times', () => {
      const gridSize = 4;
      const result1 = initializeGame(gridSize);
      const result2 = initializeGame(gridSize);
      
      // It's extremely unlikely that two random shuffles would result in the same configuration
      // Compare positions of tiles
      const positionSet1 = new Set(result1.tiles.map(tile => `${tile.value}:${tile.position}`));
      const positionSet2 = new Set(result2.tiles.map(tile => `${tile.value}:${tile.position}`));
      
      // Compare the stringified sets - they should be different
      expect(JSON.stringify([...positionSet1].sort())).not.toBe(JSON.stringify([...positionSet2].sort()));
    });
  });
  
  describe('isSolved', () => {
    it('should correctly identify a solved puzzle', () => {
      const gridSize = 3;
      const totalTiles = gridSize * gridSize - 1;
      const lastPosition = gridSize * gridSize - 1;
      
      // Create a solved puzzle configuration
      const tiles: Tile[] = Array.from({ length: totalTiles }, (_, i) => ({
        value: i + 1,
        position: i,
      }));
      
      expect(isSolved(tiles, lastPosition, gridSize)).toBe(true);
    });
    
    it('should return false when the empty space is not in the last position', () => {
      const gridSize = 3;
      const totalTiles = gridSize * gridSize - 1;
      
      // Create a solved puzzle configuration but with the empty space in the wrong place
      const tiles: Tile[] = Array.from({ length: totalTiles }, (_, i) => ({
        value: i + 1,
        position: i,
      }));
      
      // Empty position is not the last position
      const emptyPosition = 4; // center position
      
      expect(isSolved(tiles, emptyPosition, gridSize)).toBe(false);
    });
    
    it('should return false when tiles are not in correct positions', () => {
      const gridSize = 3;
      const totalTiles = gridSize * gridSize - 1;
      const lastPosition = gridSize * gridSize - 1;
      
      // Create an unsolved puzzle configuration
      const tiles: Tile[] = Array.from({ length: totalTiles }, (_, i) => ({
        value: i + 1,
        position: (i + 1) % totalTiles, // shift all positions by 1
      }));
      
      expect(isSolved(tiles, lastPosition, gridSize)).toBe(false);
    });
  });
}); 