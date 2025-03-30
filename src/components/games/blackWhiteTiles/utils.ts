// Create an empty board (all white)
export function createEmptyBoard(size: number): boolean[][] {
  return Array(size).fill(null).map(() => Array(size).fill(false));
}

// Apply a move to the board (toggle clicked tile and adjacent tiles)
export function applyMove(board: boolean[][], row: number, col: number): boolean[][] {
  const size = board.length;
  const newBoard = board.map(r => [...r]);
  
  // Toggle the clicked tile
  newBoard[row][col] = !newBoard[row][col];
  
  // Toggle adjacent tiles (up, down, left, right)
  const adjacentPositions = [
    [row - 1, col], // up
    [row + 1, col], // down
    [row, col - 1], // left
    [row, col + 1]  // right
  ];
  
  for (const [r, c] of adjacentPositions) {
    // Check if the position is within bounds
    if (r >= 0 && r < size && c >= 0 && c < size) {
      newBoard[r][c] = !newBoard[r][c];
    }
  }
  
  return newBoard;
}

// Generate a solvable target board by applying random moves to an empty board
export function generateSolvableBoard(size: number, numMoves = 20): boolean[][] {
  let board = createEmptyBoard(size);
  
  // Apply random moves to create a solvable target pattern
  for (let i = 0; i < numMoves; i++) {
    const randomRow = Math.floor(Math.random() * size);
    const randomCol = Math.floor(Math.random() * size);
    board = applyMove(board, randomRow, randomCol);
  }
  
  return board;
}

// Generate a completely random board (may not be solvable)
export function generateRandomBoard(size: number, blackTileProbability = 0.4): boolean[][] {
  return Array(size).fill(null).map(() => 
    Array(size).fill(null).map(() => Math.random() < blackTileProbability)
  );
}

// Check if two boards match exactly
export function boardsMatch(boardA: boolean[][], boardB: boolean[][]): boolean {
  // Handle empty boards comparison
  if (boardA.length === 0 && boardB.length === 0) {
    return true;
  }
  
  // Handle the case when one board is empty but the other is not
  if (boardA.length === 0 || boardB.length === 0) {
    return false;
  }
  
  // Check if the boards have different dimensions
  if (boardA.length !== boardB.length || boardA[0].length !== boardB[0].length) {
    return false;
  }
  
  const size = boardA.length;
  
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (boardA[i][j] !== boardB[i][j]) {
        return false;
      }
    }
  }
  
  return true;
}

// Count the number of matching tiles between two boards
export function countMatchingTiles(boardA: boolean[][], boardB: boolean[][]): number {
  const size = boardA.length;
  let matches = 0;
  
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (boardA[i][j] === boardB[i][j]) {
        matches++;
      }
    }
  }
  
  return matches;
} 