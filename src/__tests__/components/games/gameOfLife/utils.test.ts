import { 
  createEmptyBoard, 
  generateRandomBoard, 
  countAliveNeighbors, 
  calculateNextState, 
  boardsMatch,
  countMatchingCells 
} from '../../../../components/games/gameOfLife/utils';

describe('Game of Life - Utils', () => {
  describe('createEmptyBoard', () => {
    it('should create an empty board of the specified size', () => {
      const size = 5;
      const board = createEmptyBoard(size);
      
      // Check dimensions
      expect(board.length).toBe(size);
      expect(board[0].length).toBe(size);
      
      // Check all cells are dead (false)
      for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
          expect(board[i][j]).toBe(false);
        }
      }
    });
  });

  describe('generateRandomBoard', () => {
    it('should generate a board of the specified size', () => {
      const size = 5;
      const board = generateRandomBoard(size);
      
      expect(board.length).toBe(size);
      expect(board[0].length).toBe(size);
    });

    it('should generate boards based on the provided probability', () => {
      // Test with 100% probability
      const allAliveBoard = generateRandomBoard(3, 1.0);
      
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          expect(allAliveBoard[i][j]).toBe(true);
        }
      }
      
      // Test with 0% probability
      const allDeadBoard = generateRandomBoard(3, 0);
      
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          expect(allDeadBoard[i][j]).toBe(false);
        }
      }
    });
  });

  describe('countAliveNeighbors', () => {
    it('should count all 8 neighbors correctly', () => {
      const board = [
        [true, true, false],
        [false, false, true],
        [true, false, true]
      ];
      
      // Center cell has 5 alive neighbors (diagonals count too)
      expect(countAliveNeighbors(board, 1, 1)).toBe(5);
    });

    it('should handle corner cells correctly', () => {
      const board = [
        [false, true, false],
        [true, false, false],
        [false, false, false]
      ];
      
      // Top-left corner (has 2 alive neighbors)
      expect(countAliveNeighbors(board, 0, 0)).toBe(2);
    });

    it('should handle edge cells correctly', () => {
      const board = [
        [false, true, false],
        [false, true, false],
        [false, true, false]
      ];
      
      // Middle of top edge (has 1 alive neighbor - the center)
      expect(countAliveNeighbors(board, 0, 1)).toBe(1);
    });
  });

  describe('calculateNextState', () => {
    it('should apply the rules correctly - underpopulation', () => {
      // Live cell with fewer than 2 live neighbors dies
      const board = [
        [false, false, false],
        [false, true, false],
        [false, false, false]
      ];
      
      const nextBoard = calculateNextState(board);
      
      // The center cell should die due to underpopulation
      expect(nextBoard[1][1]).toBe(false);
    });

    it('should apply the rules correctly - survival', () => {
      // Live cell with 2 or 3 live neighbors survives
      const board = [
        [true, true, false],
        [false, true, false],
        [false, false, false]
      ];
      
      const nextBoard = calculateNextState(board);
      
      // The center cell should survive (has 2 live neighbors)
      expect(nextBoard[1][1]).toBe(true);
    });

    it('should apply the rules correctly - reproduction', () => {
      // Dead cell with exactly 3 live neighbors becomes alive
      const board = [
        [true, true, true],
        [false, false, false],
        [false, false, false]
      ];
      
      const nextBoard = calculateNextState(board);
      
      // The cell below the three live cells should become alive
      expect(nextBoard[1][1]).toBe(true);
    });

    it('should apply the rules correctly - overpopulation', () => {
      // Live cell with more than 3 live neighbors dies
      const board = [
        [true, true, true],
        [true, true, false],
        [false, false, false]
      ];
      
      const nextBoard = calculateNextState(board);
      
      // The center cell should die due to overpopulation
      expect(nextBoard[1][1]).toBe(false);
    });

    it('should handle common patterns correctly - blinker', () => {
      // Test a common oscillator pattern - blinker
      const blinkerHorizontal = [
        [false, false, false, false, false],
        [false, false, false, false, false],
        [false, true, true, true, false],
        [false, false, false, false, false],
        [false, false, false, false, false]
      ];
      
      const blinkerVertical = calculateNextState(blinkerHorizontal);
      
      // Check transformation to vertical blinker
      expect(blinkerVertical[1][2]).toBe(true);
      expect(blinkerVertical[2][2]).toBe(true);
      expect(blinkerVertical[3][2]).toBe(true);
      
      // Check original position cells are now dead
      expect(blinkerVertical[2][1]).toBe(false);
      expect(blinkerVertical[2][3]).toBe(false);
      
      // Verify it oscillates back to horizontal
      const backToHorizontal = calculateNextState(blinkerVertical);
      
      // Should match the original pattern
      expect(backToHorizontal[2][1]).toBe(true);
      expect(backToHorizontal[2][2]).toBe(true);
      expect(backToHorizontal[2][3]).toBe(true);
    });
  });

  describe('boardsMatch', () => {
    it('should return true when boards match exactly', () => {
      const board1 = [
        [true, false],
        [false, true]
      ];
      
      const board2 = [
        [true, false],
        [false, true]
      ];
      
      expect(boardsMatch(board1, board2)).toBe(true);
    });
    
    it('should return false when boards do not match', () => {
      const board1 = [
        [true, false],
        [false, true]
      ];
      
      const board2 = [
        [true, true],
        [false, true]
      ];
      
      expect(boardsMatch(board1, board2)).toBe(false);
    });
  });

  describe('countMatchingCells', () => {
    it('should count matching cells correctly', () => {
      const board1 = [
        [true, false, true],
        [false, true, false],
        [true, false, true]
      ];
      
      const board2 = [
        [true, true, true],
        [false, true, true],
        [true, false, true]
      ];
      
      // Manually count matching cells
      // 7 matches, 2 mismatches out of 9 cells (not 5 matches)
      expect(countMatchingCells(board1, board2)).toBe(7);
    });
    
    it('should return the total number of cells when boards match exactly', () => {
      const board = [
        [true, false, true],
        [false, true, false],
        [true, false, true]
      ];
      
      expect(countMatchingCells(board, board)).toBe(9);
    });
  });
}); 