'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useTranslations } from 'next-intl';

// Define types
type Cell = number | null;
type Board = Cell[][];
type SubGrid = Cell[][];
type GridCoordinate = [number, number];

const RotatingSudokuGame = () => {
  const t = useTranslations('rotatingSudoku');
  const [board, setBoard] = useState<Board>([]);
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);
  const [isValidSolution, setIsValidSolution] = useState<boolean | null>(null);
  const [originalCells, setOriginalCells] = useState<boolean[][]>([]);
  const [solvedBoard, setSolvedBoard] = useState<Board>([]);
  const [showHints, setShowHints] = useState<boolean>(false);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  
  // Generate a solved Sudoku puzzle
  const generateSolvedSudoku = useCallback((): Board => {
    // Start with an empty board
    const newBoard: Board = Array(9).fill(null).map(() => Array(9).fill(null));
    
    // Helper function to check if a number can be placed in a cell
    const isValid = (board: Board, row: number, col: number, num: number): boolean => {
      // Check row and column
      for (let i = 0; i < 9; i++) {
        if (board[row][i] === num || board[i][col] === num) {
          return false;
        }
      }
      
      // Check 3x3 box
      const boxRow = Math.floor(row / 3) * 3;
      const boxCol = Math.floor(col / 3) * 3;
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (board[boxRow + i][boxCol + j] === num) {
            return false;
          }
        }
      }
      
      return true;
    };
    
    // Recursive function to solve the Sudoku
    const solve = (board: Board): boolean => {
      for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
          if (board[row][col] === null) {
            // Try placing numbers 1-9
            const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => Math.random() - 0.5);
            for (const num of nums) {
              if (isValid(board, row, col, num)) {
                board[row][col] = num;
                
                if (solve(board)) {
                  return true;
                }
                
                board[row][col] = null;
              }
            }
            return false;
          }
        }
      }
      return true;
    };
    
    solve(newBoard);
    return newBoard;
  }, []);
  
  // Create a playable puzzle by removing some numbers
  const createPuzzle = useCallback((solvedBoard: Board): Board => {
    const puzzle = solvedBoard.map(row => [...row]);
    
    // Number of cells to remove based on difficulty
    const cellsToRemoveByDifficulty = {
      easy: 30,
      medium: 40,
      hard: 50
    };
    
    const cellsToRemove = cellsToRemoveByDifficulty[difficulty];
    
    let count = 0;
    while (count < cellsToRemove) {
      const row = Math.floor(Math.random() * 9);
      const col = Math.floor(Math.random() * 9);
      
      if (puzzle[row][col] !== null) {
        puzzle[row][col] = null;
        count++;
      }
    }
    
    // Initialize originalCells matrix based on the puzzle
    const newOriginalCells = Array(9).fill(null).map(() => Array(9).fill(false));
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (puzzle[i][j] !== null) {
          newOriginalCells[i][j] = true;
        }
      }
    }
    setOriginalCells(newOriginalCells);
    
    return puzzle;
  }, [difficulty]);
  
  // Get the subgrid coordinates for a specific button
  const getSubgridCoordinates = (buttonIndex: number): GridCoordinate[] => {
    const buttonCoordinates: GridCoordinate[][] = [
      [[0, 0], [0, 1], [1, 0], [1, 1]], // Button 1
      [[0, 1], [0, 2], [1, 1], [1, 2]], // Button 2
      [[1, 0], [1, 1], [2, 0], [2, 1]], // Button 3
      [[1, 1], [1, 2], [2, 1], [2, 2]]  // Button 4
    ];
    
    return buttonCoordinates[buttonIndex];
  };
  
  // Extract a subgrid from the board
  const getSubgrid = (board: Board, gridRow: number, gridCol: number): SubGrid => {
    const subgrid: SubGrid = Array(3).fill(null).map(() => Array(3).fill(null));
    
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        subgrid[i][j] = board[gridRow * 3 + i][gridCol * 3 + j];
      }
    }
    
    return subgrid;
  };
  
  // Replace a subgrid in the board
  const setSubgrid = (board: Board, gridRow: number, gridCol: number, subgrid: SubGrid): void => {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        board[gridRow * 3 + i][gridCol * 3 + j] = subgrid[i][j];
      }
    }
  };
  
  // Rotate subgrids clockwise when a button is clicked
  const rotateSubgrids = (board: Board, buttonIndex: number): void => {
    const coordinates = getSubgridCoordinates(buttonIndex);
    const subgrids: SubGrid[] = coordinates.map(([row, col]) => getSubgrid(board, row, col));
    
    // Rotate clockwise
    const tempSubgrid = subgrids[0];
    subgrids[0] = subgrids[2];
    subgrids[2] = subgrids[3];
    subgrids[3] = subgrids[1];
    subgrids[1] = tempSubgrid;
    
    // Update the board
    coordinates.forEach(([row, col], index) => {
      setSubgrid(board, row, col, subgrids[index]);
    });
  };
  
  // Apply random rotations to create the initial state
  const applyRandomRotations = useCallback((board: Board): Board => {
    const newBoard = board.map(row => [...row]);
    const rotationButtons = [0, 1, 2, 3]; // Button indices
    
    // Apply 5-10 random rotations
    const numRotations = 5 + Math.floor(Math.random() * 6);
    
    for (let i = 0; i < numRotations; i++) {
      const buttonIndex = rotationButtons[Math.floor(Math.random() * rotationButtons.length)];
      rotateSubgrids(newBoard, buttonIndex);
    }
    
    return newBoard;
  }, []);
  
  // Handle rotation button click
  const handleRotation = (buttonIndex: number) => {
    const coordinates = getSubgridCoordinates(buttonIndex);
    
    setBoard(prevBoard => {
      const newBoard = prevBoard.map(row => [...row]);
      rotateSubgrids(newBoard, buttonIndex);
      return newBoard;
    });
    
    setOriginalCells(prevOriginalCells => {
      const newOriginalCells = prevOriginalCells.map(row => [...row]);
      
      // Extract the values from each subgrid
      const subgridValues: boolean[][] = [];
      
      coordinates.forEach(([gridRow, gridCol]) => {
        const values: boolean[] = [];
        for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 3; j++) {
            values.push(newOriginalCells[gridRow * 3 + i][gridCol * 3 + j]);
          }
        }
        subgridValues.push(values);
      });
      
      // Rotate the values (same rotation pattern as the board)
      const tempValues = subgridValues[0];
      subgridValues[0] = subgridValues[2];
      subgridValues[2] = subgridValues[3];
      subgridValues[3] = subgridValues[1];
      subgridValues[1] = tempValues;
      
      // Put the values back into the grid
      coordinates.forEach(([gridRow, gridCol], gridIndex) => {
        let valueIndex = 0;
        for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 3; j++) {
            newOriginalCells[gridRow * 3 + i][gridCol * 3 + j] = subgridValues[gridIndex][valueIndex];
            valueIndex++;
          }
        }
      });
      
      return newOriginalCells;
    });
    
    setIsValidSolution(null);
  };
  
  // Handle cell click
  const handleCellClick = (row: number, col: number) => {
    if (board[row][col] === null || typeof board[row][col] === 'number') {
      setSelectedCell([row, col]);
    }
  };
  
  // Handle cell double click to clear
  const handleCellDoubleClick = (row: number, col: number) => {
    // Don't allow modifying original cells
    if (originalCells[row][col]) {
      return;
    }
    
    if (typeof board[row][col] === 'number') {
      setBoard(prevBoard => {
        const newBoard = prevBoard.map(r => [...r]);
        newBoard[row][col] = null;
        return newBoard;
      });
      
      setIsValidSolution(null);
    }
  };
  
  // Handle number input
  const handleNumberInput = (num: number | null) => {
    if (selectedCell) {
      const [row, col] = selectedCell;
      
      // Don't allow modifying original cells
      if (originalCells[row][col]) {
        return;
      }
      
      setBoard(prevBoard => {
        const newBoard = prevBoard.map(r => [...r]);
        newBoard[row][col] = num;
        return newBoard;
      });
      
      setIsValidSolution(null);
    }
  };
  
  // Validate the current solution
  const validateSolution = () => {
    // Check if the board is completely filled
    const isComplete = board.every(row => row.every(cell => cell !== null));
    if (!isComplete) {
      setIsValidSolution(false);
      return;
    }
    
    // Check rows
    for (let row = 0; row < 9; row++) {
      const seen = new Set<number>();
      for (let col = 0; col < 9; col++) {
        const num = board[row][col];
        if (num !== null && seen.has(num)) {
          setIsValidSolution(false);
          return;
        }
        if (num !== null) seen.add(num);
      }
    }
    
    // Check columns
    for (let col = 0; col < 9; col++) {
      const seen = new Set<number>();
      for (let row = 0; row < 9; row++) {
        const num = board[row][col];
        if (num !== null && seen.has(num)) {
          setIsValidSolution(false);
          return;
        }
        if (num !== null) seen.add(num);
      }
    }
    
    // Check 3x3 boxes
    for (let boxRow = 0; boxRow < 3; boxRow++) {
      for (let boxCol = 0; boxCol < 3; boxCol++) {
        const seen = new Set<number>();
        for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 3; j++) {
            const num = board[boxRow * 3 + i][boxCol * 3 + j];
            if (num !== null && seen.has(num)) {
              setIsValidSolution(false);
              return;
            }
            if (num !== null) seen.add(num);
          }
        }
      }
    }
    
    setIsValidSolution(true);
  };
  
  // Start a new game
  const newGame = useCallback(() => {
    const solved = generateSolvedSudoku();
    const puzzle = createPuzzle(solved);
    const initialState = applyRandomRotations(puzzle);
    setBoard(initialState);
    setSolvedBoard(solved);
    
    // Initialize originalCells matrix based on the initial state
    const newOriginalCells = Array(9).fill(null).map(() => Array(9).fill(false));
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (initialState[i][j] !== null) {
          newOriginalCells[i][j] = true;
        }
      }
    }
    setOriginalCells(newOriginalCells);
    
    setSelectedCell(null);
    setIsValidSolution(null);
    setShowHints(false);
  }, [generateSolvedSudoku, createPuzzle, applyRandomRotations]);
  
  // Toggle hint mode
  const toggleHints = () => {
    setShowHints(prev => !prev);
  };
  
  // Check if a cell's value is correct
  const isCellCorrect = (row: number, col: number): boolean | null => {
    // Don't show any hint for empty cells or original cells
    if (!showHints || board[row][col] === null || originalCells[row][col]) return null;
    
    // Only check user-inputted numbers
    return board[row][col] === solvedBoard[row][col];
  };
  
  // Check if a 3x3 subgrid is in the correct position
  const isSubgridCorrect = (gridRow: number, gridCol: number): boolean => {
    if (!showHints) return true; // Don't show incorrect subgrid positions when hints are off
    
    // To check if a subgrid is correctly positioned, we should only look at original numbers
    // not user inputs, since user inputs might be wrong but the subgrid could be in the right position
    let hasOriginalNumbers = false;
    let correctPositioning = true;
    
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const rowIdx = gridRow * 3 + i;
        const colIdx = gridCol * 3 + j;
        
        // Only check original cells, ignore user inputs
        if (originalCells[rowIdx][colIdx]) {
          hasOriginalNumbers = true;
          if (board[rowIdx][colIdx] !== solvedBoard[rowIdx][colIdx]) {
            correctPositioning = false;
            break;
          }
        }
      }
      if (!correctPositioning) break;
    }
    
    // If there are no original numbers in this subgrid, consider it correct by default
    // as we have no way to determine if it's in the wrong position
    return !hasOriginalNumbers || correctPositioning;
  };
  
  // Clear the board
  const clearBoard = useCallback(() => {
    setBoard(prevBoard => {
      const newBoard = prevBoard.map(row => [...row]);
      for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
          // Only clear non-original cells
          if (!originalCells[i][j] && newBoard[i][j] !== null) {
            newBoard[i][j] = null;
          }
        }
      }
      return newBoard;
    });
    setSelectedCell(null);
    setIsValidSolution(null);
  }, [originalCells]);
  
  // Handle difficulty change
  const handleDifficultyChange = (newDifficulty: 'easy' | 'medium' | 'hard') => {
    setDifficulty(newDifficulty);
    // Start a new game with the new difficulty
    newGame();
  };
  
  // Initialize the game
  useEffect(() => {
    newGame();
  }, [newGame]);
  
  // Calculate button positions
  const buttonPositions = useMemo(() => [
    { row: 3, col: 3 }, // Button 1 between boards 1, 2, 4, 5
    { row: 3, col: 6 }, // Button 2 between boards 2, 3, 5, 6
    { row: 6, col: 3 }, // Button 3 between boards 4, 5, 7, 8
    { row: 6, col: 6 }, // Button 4 between boards 5, 6, 8, 9
  ], []);
  
  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Handle number keys (1-9)
      if (/^[1-9]$/.test(e.key)) {
        if (selectedCell) {
          handleNumberInput(parseInt(e.key, 10));
        }
      }
      
      // Handle delete/backspace to clear cell
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedCell) {
          handleNumberInput(null);
        }
      }
      
      // Handle arrow key navigation
      if (selectedCell) {
        const [currentRow, currentCol] = selectedCell;
        let newRow = currentRow;
        let newCol = currentCol;
        
        switch (e.key) {
          case 'ArrowUp':
            newRow = Math.max(0, currentRow - 1);
            break;
          case 'ArrowDown':
            newRow = Math.min(8, currentRow + 1);
            break;
          case 'ArrowLeft':
            newCol = Math.max(0, currentCol - 1);
            break;
          case 'ArrowRight':
            newCol = Math.min(8, currentCol + 1);
            break;
          default:
            return;
        }
        
        if (newRow !== currentRow || newCol !== currentCol) {
          setSelectedCell([newRow, newCol]);
          e.preventDefault(); // Prevent scrolling
        }
      } else if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        // If no cell is selected, select the center cell when an arrow key is pressed
        setSelectedCell([4, 4]);
        e.preventDefault();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedCell]);
  
  return (
    <div className="flex flex-col items-center gap-4 sm:gap-6 mx-auto max-w-full px-2 sm:px-4">
      {/* Game controls */}
      <div className="flex flex-wrap gap-2 sm:gap-4 mb-2 sm:mb-4 justify-center w-full">
        <button 
          onClick={newGame}
          className="px-2 sm:px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm sm:text-base"
        >
          {t('newGame')}
        </button>
        <button 
          onClick={validateSolution}
          className="px-2 sm:px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-sm sm:text-base"
        >
          {t('validate')}
        </button>
        <button 
          onClick={toggleHints}
          className={`px-2 sm:px-4 py-2 ${showHints ? 'bg-purple-600' : 'bg-purple-500'} text-white rounded hover:bg-purple-600 text-sm sm:text-base`}
        >
          {showHints ? t('hideHints') || 'Hide Hints' : t('showHints') || 'Show Hints'}
        </button>
        <button 
          onClick={clearBoard}
          className="px-2 sm:px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 text-sm sm:text-base"
        >
          {t('clear')}
        </button>
      </div>
      
      {/* Difficulty selection */}
      <div className="flex flex-wrap gap-2 mb-2 sm:mb-4 justify-center">
        <span className="text-sm sm:text-base self-center mr-2">{t('difficulty') || 'Difficulty'}:</span>
        <button
          onClick={() => handleDifficultyChange('easy')}
          className={`px-2 sm:px-3 py-1 rounded text-white text-xs sm:text-sm ${difficulty === 'easy' ? 'bg-teal-600' : 'bg-teal-500 hover:bg-teal-600'}`}
        >
          {t('easy') || 'Easy'}
        </button>
        <button
          onClick={() => handleDifficultyChange('medium')}
          className={`px-2 sm:px-3 py-1 rounded text-white text-xs sm:text-sm ${difficulty === 'medium' ? 'bg-teal-600' : 'bg-teal-500 hover:bg-teal-600'}`}
        >
          {t('medium') || 'Medium'}
        </button>
        <button
          onClick={() => handleDifficultyChange('hard')}
          className={`px-2 sm:px-3 py-1 rounded text-white text-xs sm:text-sm ${difficulty === 'hard' ? 'bg-teal-600' : 'bg-teal-500 hover:bg-teal-600'}`}
        >
          {t('hard') || 'Hard'}
        </button>
      </div>
      
      {/* Validation message */}
      {isValidSolution !== null && (
        <div className={`p-2 rounded mb-2 sm:mb-4 text-sm sm:text-base w-full text-center ${isValidSolution ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {isValidSolution ? t('valid') : t('invalid')}
        </div>
      )}
      
      {/* Hint mode message */}
      {showHints && (
        <div className="p-2 rounded mb-2 sm:mb-4 text-sm sm:text-base w-full text-center bg-purple-100 text-purple-800">
          {t('hintsActive') || 'Hint mode active: Correct numbers are shown in green, incorrect in red. Subgrids with orange borders need to be rotated.'}
        </div>
      )}
      
      {/* Sudoku board */}
      <div className="grid grid-cols-9 gap-0 border-2 border-gray-800 bg-white relative w-full max-w-[360px] sm:max-w-[450px]">
        {board.map((row, rowIndex) => (
          row.map((cell, colIndex) => {
            // Ensure every cell has all four borders explicitly defined
            const borderTop = rowIndex % 3 === 0 ? 'border-t-2 border-t-gray-800' : 'border-t border-t-gray-300';
            const borderLeft = colIndex % 3 === 0 ? 'border-l-2 border-l-gray-800' : 'border-l border-l-gray-300';
            const borderRight = (colIndex % 3 === 2 || colIndex === 8) ? 'border-r-2 border-r-gray-800' : 'border-r border-r-gray-300';
            const borderBottom = (rowIndex % 3 === 2 || rowIndex === 8) ? 'border-b-2 border-b-gray-800' : 'border-b border-b-gray-300';
            
            // Is this cell selected?
            const isSelected = selectedCell && selectedCell[0] === rowIndex && selectedCell[1] === colIndex;
            
            // Is this an original cell or user inputted?
            const isOriginal = originalCells[rowIndex]?.[colIndex] || false;
            
            // Determine cell and text color
            const cellBgColor = isSelected ? 'bg-blue-200' : '';
            let cellTextColor = isOriginal ? 'text-gray-800' : 'text-blue-600';
            
            // Apply hint coloring if hint mode is active
            const cellCorrect = isCellCorrect(rowIndex, colIndex);
            if (cellCorrect === true) {
              cellTextColor = isOriginal ? 'text-gray-800' : 'text-green-600';
            } else if (cellCorrect === false) {
              cellTextColor = 'text-red-600';
            }
            
            // Check if this subgrid is correctly positioned
            const gridRow = Math.floor(rowIndex / 3);
            const gridCol = Math.floor(colIndex / 3);
            const subgridCorrect = isSubgridCorrect(gridRow, gridCol);
            
            // Add subgrid highlight if it's incorrectly positioned
            const subgridHighlight = showHints && !subgridCorrect ? 'outline outline-2 outline-orange-500' : '';
            
            // If this is the top-left cell of a 3x3 subgrid, add a label to indicate if it's correct
            const isSubgridCorner = rowIndex % 3 === 0 && colIndex % 3 === 0;
            
            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`
                  flex items-center justify-center
                  w-full aspect-square
                  ${borderTop} ${borderLeft} ${borderRight} ${borderBottom}
                  ${cellBgColor}
                  ${isOriginal ? 'cursor-not-allowed' : 'cursor-pointer'}
                  ${subgridHighlight}
                  transition-colors
                  relative
                `}
                onClick={() => handleCellClick(rowIndex, colIndex)}
                onDoubleClick={() => handleCellDoubleClick(rowIndex, colIndex)}
              >
                {cell !== null && (
                  <span className={`text-base sm:text-xl font-bold ${cellTextColor}`}>{cell}</span>
                )}
                
                {/* Subgrid indicator */}
                {showHints && isSubgridCorner && !subgridCorrect && (
                  <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                    <div className="absolute top-0 left-0 text-xs text-orange-600 bg-orange-100 px-1 rounded-br opacity-80">
                      ↻
                    </div>
                  </div>
                )}
              </div>
            );
          })
        ))}
        
        {/* Rotation buttons */}
        {buttonPositions.map((pos, index) => {
          const buttonSize = 32; // Base size in pixels
          return (
            <button
              key={`button-${index}`}
              className="absolute bg-yellow-400 rounded-full text-sm flex items-center justify-center font-bold hover:bg-yellow-500 z-10 cursor-pointer shadow-md"
              style={{
                width: `${buttonSize}px`,
                height: `${buttonSize}px`,
                top: `${pos.row * 100 / 9}%`, 
                left: `${pos.col * 100 / 9}%`,
                transform: 'translate(-50%, -50%)'
              }}
              onClick={() => handleRotation(index)}
              aria-label={`Rotate section ${index + 1}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 sm:w-5 sm:h-5">
                <path fillRule="evenodd" d="M4.755 10.059a7.5 7.5 0 0112.548-3.364l1.903 1.903h-3.183a.75.75 0 100 1.5h4.992a.75.75 0 00.75-.75V4.356a.75.75 0 00-1.5 0v3.18l-1.9-1.9A9 9 0 003.306 9.67a.75.75 0 101.45.388zm15.408 3.352a.75.75 0 00-.919.53 7.5 7.5 0 01-12.548 3.364l-1.902-1.903h3.183a.75.75 0 000-1.5H2.984a.75.75 0 00-.75.75v4.992a.75.75 0 001.5 0v-3.18l1.9 1.9a9 9 0 0015.059-4.035.75.75 0 00-.53-.918z" clipRule="evenodd" />
              </svg>
            </button>
          );
        })}
      </div>
      
      {/* Arrow navigation UI for mobile */}
      <div className="grid grid-cols-3 gap-2 mt-2 sm:hidden">
        <div className="col-start-2">
          <button 
            className="w-full h-10 bg-gray-200 rounded flex items-center justify-center text-xl font-bold"
            onClick={() => selectedCell && setSelectedCell([Math.max(0, selectedCell[0] - 1), selectedCell[1]])}
          >
            ↑
          </button>
        </div>
        <div className="col-span-3 grid grid-cols-3 gap-2">
          <button 
            className="w-full h-10 bg-gray-200 rounded flex items-center justify-center text-xl font-bold"
            onClick={() => selectedCell && setSelectedCell([selectedCell[0], Math.max(0, selectedCell[1] - 1)])}
          >
            ←
          </button>
          <button 
            className="w-full h-10 bg-gray-200 rounded flex items-center justify-center text-xl font-bold"
            onClick={() => selectedCell && setSelectedCell([Math.min(8, selectedCell[0] + 1), selectedCell[1]])}
          >
            ↓
          </button>
          <button 
            className="w-full h-10 bg-gray-200 rounded flex items-center justify-center text-xl font-bold"
            onClick={() => selectedCell && setSelectedCell([selectedCell[0], Math.min(8, selectedCell[1] + 1)])}
          >
            →
          </button>
        </div>
      </div>
      
      {/* Keyboard input instructions */}
      <div className="text-xs sm:text-sm text-gray-600 mt-2 text-center w-full max-w-[360px] sm:max-w-[450px]">
        {t('keyboardInstructions') || 'Use keyboard numbers 1-9 to input values. Double-click a cell or press Delete/Backspace to clear it.'}
      </div>
      
      {/* How to play section */}
      <div className="mt-4 sm:mt-8 border border-gray-300 rounded-lg p-3 sm:p-4 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 w-full text-sm sm:text-base">
        <h2 className="text-lg sm:text-xl font-bold mb-2">{t('howToPlay')}</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>{t('instructions.sudokuRules')}</li>
          <li>{t('instructions.rotation')}</li>
          <li>{t('instructions.complete')}</li>
          <li>{t('instructions.strategy')}</li>
        </ul>
      </div>
    </div>
  );
};

export default RotatingSudokuGame; 