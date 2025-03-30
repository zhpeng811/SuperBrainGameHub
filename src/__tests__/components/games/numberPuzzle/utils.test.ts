import { describe, it, expect } from '@jest/globals';

// Extract these utility functions directly from the component 
// as they're defined within the NumberPuzzleGame.tsx file
const getAdjacentPositions = (position: number, gridSize: number): number[] => {
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

const canMoveTile = (position: number, emptyPosition: number, gridSize: number): boolean => {
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

describe('NumberPuzzle - Utils', () => {
  describe('getAdjacentPositions', () => {
    it('should return the correct adjacent positions for a center tile in a 3x3 grid', () => {
      // Position 4 is the center in a 3x3 grid (0-indexed)
      const position = 4;
      const gridSize = 3;
      const adjacent = getAdjacentPositions(position, gridSize);
      
      // Expected adjacent positions: up (1), right (5), down (7), left (3)
      expect(adjacent).toContain(1); // up
      expect(adjacent).toContain(5); // right
      expect(adjacent).toContain(7); // down
      expect(adjacent).toContain(3); // left
      expect(adjacent.length).toBe(4);
    });

    it('should return the correct adjacent positions for a corner tile in a 3x3 grid', () => {
      // Position 0 is the top-left corner in a 3x3 grid
      const position = 0;
      const gridSize = 3;
      const adjacent = getAdjacentPositions(position, gridSize);
      
      // Expected adjacent positions: right (1), down (3)
      expect(adjacent).toContain(1); // right
      expect(adjacent).toContain(3); // down
      expect(adjacent.length).toBe(2);
    });

    it('should return the correct adjacent positions for an edge tile in a 3x3 grid', () => {
      // Position 1 is the top-middle in a 3x3 grid
      const position = 1;
      const gridSize = 3;
      const adjacent = getAdjacentPositions(position, gridSize);
      
      // Expected adjacent positions: right (2), down (4), left (0)
      expect(adjacent).toContain(2); // right
      expect(adjacent).toContain(4); // down
      expect(adjacent).toContain(0); // left
      expect(adjacent.length).toBe(3);
    });

    it('should return the correct adjacent positions for different grid sizes', () => {
      // Position 5 in a 4x4 grid (second row, second column)
      const position = 5;
      const gridSize = 4;
      const adjacent = getAdjacentPositions(position, gridSize);
      
      // Expected adjacent positions: up (1), right (6), down (9), left (4)
      expect(adjacent).toContain(1); // up
      expect(adjacent).toContain(6); // right
      expect(adjacent).toContain(9); // down
      expect(adjacent).toContain(4); // left
      expect(adjacent.length).toBe(4);
    });
  });

  describe('canMoveTile', () => {
    it('should return true for a tile adjacent to the empty space (horizontally)', () => {
      // In a 3x3 grid, with empty at position 4 (center)
      const tilePosition = 3; // left of center
      const emptyPosition = 4; // center
      const gridSize = 3;
      
      expect(canMoveTile(tilePosition, emptyPosition, gridSize)).toBe(true);
    });

    it('should return true for a tile adjacent to the empty space (vertically)', () => {
      // In a 3x3 grid, with empty at position 4 (center)
      const tilePosition = 1; // above center
      const emptyPosition = 4; // center
      const gridSize = 3;
      
      expect(canMoveTile(tilePosition, emptyPosition, gridSize)).toBe(true);
    });

    it('should return false for a tile not adjacent to the empty space', () => {
      // In a 3x3 grid, with empty at position 4 (center)
      const tilePosition = 0; // top-left corner, not adjacent to center
      const emptyPosition = 4; // center
      const gridSize = 3;
      
      expect(canMoveTile(tilePosition, emptyPosition, gridSize)).toBe(false);
    });

    it('should return false for a tile diagonally adjacent to the empty space', () => {
      // In a 3x3 grid, with empty at position 4 (center)
      const tilePosition = 0; // top-left, diagonally adjacent to center
      const emptyPosition = 4; // center
      const gridSize = 3;
      
      expect(canMoveTile(tilePosition, emptyPosition, gridSize)).toBe(false);
    });

    it('should handle different grid sizes correctly', () => {
      // In a 4x4 grid, with empty at position 5
      const tilePosition = 1; // position in first row, second column
      const emptyPosition = 5; // position in second row, second column
      const gridSize = 4;
      
      expect(canMoveTile(tilePosition, emptyPosition, gridSize)).toBe(true);
    });
  });
}); 