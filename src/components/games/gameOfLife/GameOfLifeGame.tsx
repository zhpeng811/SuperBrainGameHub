'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import Board from './Board';
import { createEmptyBoard, generateRandomBoard, calculateNextState, countMatchingCells } from './utils';

const BOARD_SIZE = 15;

export default function GameOfLifeGame() {
  const t = useTranslations('gameOfLife');
  
  // Initial state of the observation board
  const [initialBoard, setInitialBoard] = useState<boolean[][]>([]);
  // Player's board representing their prediction
  const [playerBoard, setPlayerBoard] = useState<boolean[][]>([]);
  // The correct next state
  const [correctBoard, setCorrectBoard] = useState<boolean[][]>([]);
  // Track if player has submitted their prediction
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);
  // Track if player's prediction is correct
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  // Track player's score
  const [score, setScore] = useState<number>(0);
  // Track the round number
  const [round, setRound] = useState<number>(1);
  // Count of matching cells
  const [matchingCells, setMatchingCells] = useState<number>(0);
  // For highlighting cells across boards
  const [highlightedCell, setHighlightedCell] = useState<{ row: number, col: number } | null>(null);
  // For verification of player predictions
  const [verificationEnabled, setVerificationEnabled] = useState<boolean>(false);
  // Total possible cells
  const totalCells = BOARD_SIZE * BOARD_SIZE;
  // Track the time step (generation)
  const [timeStep, setTimeStep] = useState<number>(0);

  // Initialize the game
  useEffect(() => {
    startNewGame();
  }, []);

  // Start a completely new game
  const startNewGame = () => {
    const newInitialBoard = generateRandomBoard(BOARD_SIZE, 0.3);
    const newCorrectBoard = calculateNextState(newInitialBoard);
    
    setInitialBoard(newInitialBoard);
    setCorrectBoard(newCorrectBoard);
    setPlayerBoard(createEmptyBoard(BOARD_SIZE));
    setHasSubmitted(false);
    setIsCorrect(false);
    setMatchingCells(0);
    setHighlightedCell(null);
    setVerificationEnabled(false);
    setRound(1);
    setTimeStep(0);
  };

  // Start the next round using the previous solution as the new initial state
  const startNextRound = () => {
    // Use the current correct board as the new initial board
    const newInitialBoard = correctBoard;
    const newCorrectBoard = calculateNextState(newInitialBoard);
    
    setInitialBoard(newInitialBoard);
    setCorrectBoard(newCorrectBoard);
    setPlayerBoard(createEmptyBoard(BOARD_SIZE));
    setHasSubmitted(false);
    setIsCorrect(false);
    setMatchingCells(0);
    setHighlightedCell(null);
    setVerificationEnabled(false);
    setTimeStep(prevTimeStep => prevTimeStep + 1);
    setRound(prevRound => prevRound + 1);
  };

  // Handle cell click on the player board
  const handleCellClick = (row: number, col: number) => {
    if (hasSubmitted) return;

    setPlayerBoard(prevBoard => {
      const newBoard = [...prevBoard.map(row => [...row])];
      newBoard[row][col] = !newBoard[row][col];
      return newBoard;
    });
  };

  // Handle cell hover
  const handleCellHover = (row: number, col: number) => {
    setHighlightedCell({ row, col });
  };

  // Handle cell hover end
  const handleCellHoverEnd = () => {
    setHighlightedCell(null);
  };

  // Toggle verification mode
  const toggleVerification = () => {
    setVerificationEnabled(prev => !prev);
  };

  // Submit player's prediction
  const handleSubmitPrediction = () => {
    if (hasSubmitted) return;
    
    // Calculate how many cells match between the player's prediction and correct solution
    const matches = countMatchingCells(playerBoard, correctBoard);
    setMatchingCells(matches);
    
    // Check if the prediction is completely correct
    const isAllCorrect = matches === totalCells;
    setIsCorrect(isAllCorrect);
    
    // Update player's score based on accuracy
    if (isAllCorrect) {
      setScore(prevScore => prevScore + 1);
    }
    
    setHasSubmitted(true);
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="flex flex-col items-center gap-2 sm:flex-row sm:gap-4">
        <div className="text-center sm:text-left">
          <div className="mb-2 flex items-center gap-4">
            <div className="flex items-center">
              <span className="font-medium text-gray-700 dark:text-gray-300">{t('round')}:</span>
              <span className="ml-1 font-bold text-gray-900 dark:text-white">{round}</span>
            </div>
            <div className="flex items-center">
              <span className="font-medium text-gray-700 dark:text-gray-300">{t('score')}:</span>
              <span className="ml-1 font-bold text-gray-900 dark:text-white">{score}</span>
            </div>
            <div className="flex items-center">
              <span className="font-medium text-gray-700 dark:text-gray-300">{t('timeStep')}:</span>
              <span className="ml-1 font-bold text-gray-900 dark:text-white">{timeStep}</span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <button
              onClick={startNewGame}
              className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
            >
              {t('newGame')}
            </button>
            
            <button
              onClick={toggleVerification}
              className={`rounded-md px-3 py-1.5 text-sm font-medium ${
                verificationEnabled
                  ? 'bg-red-600 text-white dark:bg-red-700'
                  : 'bg-green-600 text-white hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600'
              }`}
            >
              {verificationEnabled ? t('disableVerification') : t('enableVerification')}
            </button>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col gap-8 md:flex-row md:gap-12">
        <Board
          board={initialBoard}
          isInteractive={false}
          title={t('currentState')}
          highlightedCell={highlightedCell}
          onTileHover={handleCellHover}
          onTileHoverEnd={handleCellHoverEnd}
        />
        
        <Board
          board={playerBoard}
          isInteractive={!hasSubmitted}
          onTileClick={handleCellClick}
          title={t('yourPrediction')}
          highlightedCell={highlightedCell}
          onTileHover={handleCellHover}
          onTileHoverEnd={handleCellHoverEnd}
          verificationEnabled={verificationEnabled}
          correctBoard={correctBoard}
          showPostSubmission={hasSubmitted}
        />
      </div>
      
      <div className="flex flex-wrap justify-center gap-2">
        {!hasSubmitted ? (
          <button
            onClick={handleSubmitPrediction}
            className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600"
          >
            {t('submitPrediction')}
          </button>
        ) : (
          <>
            <div className="mb-4 text-center">
              <p className="text-lg font-bold">
                {isCorrect 
                  ? t('perfectPrediction') 
                  : t('accuracy', { matchingCells, totalCells, percentage: Math.round((matchingCells / totalCells) * 100) })}
              </p>
            </div>
            <button
              onClick={startNextRound}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
            >
              {t('nextRound')}
            </button>
          </>
        )}
      </div>
      
      <div className="mt-8 rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20 max-w-3xl">
        <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">{t('howToPlay')}</h3>
        <ul className="list-inside list-disc space-y-1 text-gray-700 dark:text-gray-300">
          <li>{t('instructions.leftBoard')}</li>
          <li>{t('instructions.yourTask')}</li>
          <li>{t('instructions.evolution')}</li>
          <li>{t('instructions.rules.title')}
            <ul className="ml-6 list-inside list-disc">
              <li>{t('instructions.rules.survive')}</li>
              <li>{t('instructions.rules.birth')}</li>
              <li>{t('instructions.rules.death')}</li>
            </ul>
          </li>
          <li>{t('instructions.verification')}</li>
          <li>{t('instructions.colors.title')}
            <ul className="ml-6 list-inside list-disc">
              <li><span className="inline-block w-3 h-3 bg-green-600 rounded-full mr-1"></span> {t('instructions.colors.green')}</li>
              <li><span className="inline-block w-3 h-3 bg-red-600 rounded-full mr-1"></span> {t('instructions.colors.red')}</li>
              <li><span className="inline-block w-3 h-3 bg-orange-500 rounded-full mr-1"></span> {t('instructions.colors.orange')}</li>
            </ul>
          </li>
          <li>{t('instructions.hover')}</li>
        </ul>
      </div>
    </div>
  );
} 