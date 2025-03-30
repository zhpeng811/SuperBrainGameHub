'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import Board from './Board';
import { createEmptyBoard, generateSolvableBoard, boardsMatch, countMatchingTiles, applyMove } from './utils';

const BOARD_SIZE = 10;
const TOTAL_TILES = BOARD_SIZE * BOARD_SIZE;
const RANDOM_MOVES = 15; // Number of random moves to generate the target pattern

export default function BlackWhiteTilesGame() {
  const t = useTranslations('blackWhiteTiles');
  const [gameBoard, setGameBoard] = useState<boolean[][]>([]);
  const [targetBoard, setTargetBoard] = useState<boolean[][]>([]);
  const [matchingTiles, setMatchingTiles] = useState(0);
  const [isWin, setIsWin] = useState(false);
  const [moves, setMoves] = useState(0);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [boardHistory, setBoardHistory] = useState<boolean[][][]>([]);

  // Initialize the game
  useEffect(() => {
    startNewGame();
  }, []);

  // Check for win condition
  useEffect(() => {
    if (gameBoard.length === 0 || targetBoard.length === 0) return;

    const matches = countMatchingTiles(gameBoard, targetBoard);
    setMatchingTiles(matches);
    
    // Check if boards match and update isWin state
    const matched = boardsMatch(gameBoard, targetBoard);
    if (matched) {
      setIsWin(true);
    }
  }, [gameBoard, targetBoard]);

  // Start a new game
  const startNewGame = () => {
    const emptyBoard = createEmptyBoard(BOARD_SIZE);
    
    // Generate a solvable target pattern by applying random moves
    let numMoves;
    switch (difficulty) {
      case 'easy':
        numMoves = 8;
        break;
      case 'hard':
        numMoves = 25;
        break;
      case 'medium':
      default:
        numMoves = RANDOM_MOVES;
    }
    
    const newTargetBoard = generateSolvableBoard(BOARD_SIZE, numMoves);
    
    setGameBoard(emptyBoard);
    setTargetBoard(newTargetBoard);
    setIsWin(false);
    setMoves(0);
    setBoardHistory([]);
  };

  // Handle tile click
  const handleTileClick = (row: number, col: number) => {
    if (isWin) return;

    setGameBoard(prev => {
      // Save current board to history before making the move
      setBoardHistory(history => [...history, prev]);
      
      // Apply the move
      return applyMove(prev, row, col);
    });
    
    setMoves(prev => prev + 1);
  };

  // Handle undo
  const handleUndo = () => {
    if (boardHistory.length === 0) return;
    
    // Get the last board state from history
    const lastBoard = boardHistory[boardHistory.length - 1];
    
    // Update the game board to the previous state
    setGameBoard(lastBoard);
    
    // Remove the last board state from history
    setBoardHistory(history => history.slice(0, -1));
    
    // Decrement the move count
    setMoves(prev => prev - 1);
  };

  // Handle difficulty change
  const handleDifficultyChange = (newDifficulty: 'easy' | 'medium' | 'hard') => {
    setDifficulty(newDifficulty);
    // Start a new game with the new difficulty
    setGameBoard(createEmptyBoard(BOARD_SIZE));
    
    let numMoves;
    switch (newDifficulty) {
      case 'easy':
        numMoves = 8;
        break;
      case 'hard':
        numMoves = 25;
        break;
      case 'medium':
      default:
        numMoves = RANDOM_MOVES;
    }
    
    setTargetBoard(generateSolvableBoard(BOARD_SIZE, numMoves));
    setIsWin(false);
    setMoves(0);
    setBoardHistory([]);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="mb-6 flex flex-col items-center justify-center space-y-4">
        <div className="flex items-center justify-center space-x-4">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
            {t('moves')}: {moves}
          </span>
          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
            {t('matching')}: {matchingTiles}/{TOTAL_TILES} ({Math.round((matchingTiles / TOTAL_TILES) * 100)}%)
          </span>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={() => handleDifficultyChange('easy')}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              difficulty === 'easy'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            {t('easy')}
          </button>
          <button
            onClick={() => handleDifficultyChange('medium')}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              difficulty === 'medium'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            {t('medium')}
          </button>
          <button
            onClick={() => handleDifficultyChange('hard')}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              difficulty === 'hard'
                ? 'bg-red-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            {t('hard')}
          </button>
        </div>
        
        <div className="flex space-x-3">
          <button
            onClick={startNewGame}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-700 dark:hover:bg-blue-600"
          >
            {t('newGame')}
          </button>
          
          <button
            onClick={handleUndo}
            disabled={boardHistory.length === 0 || isWin || moves === 0}
            className={`rounded-md px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 ${
              boardHistory.length === 0 || isWin || moves === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500'
                : 'bg-amber-500 text-white hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-500'
            }`}
          >
            {t('undoMove')}
          </button>
        </div>
      </div>

      {isWin && (
        <div className="mb-6 rounded-lg bg-green-100 p-4 text-center text-green-800 dark:bg-green-900/30 dark:text-green-400">
          <p className="text-lg font-bold">{t('congratulations')}</p>
          <p>{t('youWon', { moves })}</p>
        </div>
      )}

      <div className="flex flex-col items-center space-y-8 lg:flex-row lg:space-y-0 lg:space-x-12 w-full justify-center">
        <div>
          <h3 className="mb-4 text-center text-lg font-semibold text-gray-900 dark:text-white">
            {t('yourBoard')}
          </h3>
          <Board 
            board={gameBoard} 
            isInteractive={!isWin} 
            onTileClick={handleTileClick} 
          />
        </div>
        
        <div>
          <h3 className="mb-4 text-center text-lg font-semibold text-gray-900 dark:text-white">
            {t('targetPattern')}
          </h3>
          <Board 
            board={targetBoard} 
            isInteractive={false} 
          />
        </div>
      </div>

      <div className="mt-8 rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
        <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">{t('howToPlay')}</h3>
        <ul className="list-inside list-disc space-y-1 text-gray-700 dark:text-gray-300">
          <li>{t('instructions.toggle')}</li>
          <li>{t('instructions.goal')}</li>
          <li>{t('instructions.solvable')}</li>
          <li>{t('instructions.undo')}</li>
          <li>{t('instructions.fewerMoves')}</li>
        </ul>
      </div>
    </div>
  );
} 