// Create an empty board with all cells set to dead (false)
export const createEmptyBoard = (size: number): boolean[][] => {
  return Array(size).fill(null).map(() => Array(size).fill(false));
};

// Generate a random initial state for the Game of Life
export const generateRandomBoard = (size: number, aliveChance: number = 0.3): boolean[][] => {
  return Array(size).fill(null).map(() => 
    Array(size).fill(null).map(() => Math.random() < aliveChance)
  );
};

// Count the number of alive neighbors for a cell
export const countAliveNeighbors = (board: boolean[][], row: number, col: number): number => {
  const size = board.length;
  let count = 0;
  
  // Check all 8 neighbors
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      // Skip the current cell
      if (i === 0 && j === 0) continue;
      
      // Calculate the position of the neighbor
      const neighborRow = row + i;
      const neighborCol = col + j;
      
      // Only count if the neighbor is within bounds
      if (neighborRow >= 0 && neighborRow < size && 
          neighborCol >= 0 && neighborCol < size) {
        // Increase the count if the neighbor is alive
        if (board[neighborRow][neighborCol]) {
          count++;
        }
      }
    }
  }
  
  return count;
};

// Calculate the next state of the board according to Conway's Game of Life rules
export const calculateNextState = (board: boolean[][]): boolean[][] => {
  const size = board.length;
  const nextBoard = createEmptyBoard(size);
  
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      const aliveNeighbors = countAliveNeighbors(board, row, col);
      const isCurrentlyAlive = board[row][col];
      
      // Apply Conway's Game of Life rules (B3/S23)
      if (isCurrentlyAlive) {
        // Any live cell with 2 or 3 live neighbors survives
        nextBoard[row][col] = aliveNeighbors === 2 || aliveNeighbors === 3;
      } else {
        // Any dead cell with exactly 3 live neighbors becomes alive
        nextBoard[row][col] = aliveNeighbors === 3;
      }
    }
  }
  
  return nextBoard;
};

// Check if two boards match exactly
export const boardsMatch = (board1: boolean[][], board2: boolean[][]): boolean => {
  const size = board1.length;
  
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (board1[row][col] !== board2[row][col]) {
        return false;
      }
    }
  }
  
  return true;
};

// Count the number of matching cells between two boards
export const countMatchingCells = (board1: boolean[][], board2: boolean[][]): number => {
  const size = board1.length;
  let matches = 0;
  
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (board1[row][col] === board2[row][col]) {
        matches++;
      }
    }
  }
  
  return matches;
}; 