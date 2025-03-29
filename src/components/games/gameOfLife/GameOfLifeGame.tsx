'use client';

import { useState, useEffect } from 'react';
import Board from './Board';
import { createEmptyBoard, generateRandomBoard, calculateNextState, boardsMatch, countMatchingCells } from './utils';

const BOARD_SIZE = 15;

export default function GameOfLifeGame() {
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

  // Handle submission of player's prediction
  const handleSubmit = () => {
    if (hasSubmitted) return;
    
    const matches = countMatchingCells(playerBoard, correctBoard);
    const correct = boardsMatch(playerBoard, correctBoard);
    
    setMatchingCells(matches);
    setIsCorrect(correct);
    setHasSubmitted(true);
    setVerificationEnabled(false);
    
    if (correct) {
      setScore(prevScore => prevScore + 1);
    }
  };

  // Handle next round
  const handleNextRound = () => {
    setRound(prevRound => prevRound + 1);
    startNextRound();
  };

  // Calculate accuracy percentage with 2 decimal places
  const accuracy = ((matchingCells / totalCells) * 100).toFixed(2);

  return (
    <div className="flex flex-col items-center">
      <div className="mb-6 flex items-center gap-6">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Round {round}</h3>
        </div>
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Score: {score}</h3>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-center gap-8 w-full">
        <div className="w-full md:w-auto">
          <Board 
            board={initialBoard} 
            isInteractive={false}
            title={`Initial State (t=${timeStep})`}
            highlightedCell={highlightedCell}
          />
        </div>
        
        <div className="w-full md:w-auto mt-8 md:mt-0">
          <Board 
            board={playerBoard} 
            isInteractive={!hasSubmitted}
            onTileClick={handleCellClick}
            onTileHover={handleCellHover}
            onTileHoverEnd={handleCellHoverEnd}
            title={`Your Prediction (t=${timeStep+1})`}
            highlightedCell={highlightedCell}
            verificationEnabled={verificationEnabled && !hasSubmitted}
            correctBoard={correctBoard}
            showPostSubmission={hasSubmitted}
          />
        </div>
      </div>

      {!hasSubmitted && (
        <div className="mt-4 flex items-center gap-2">
          <button
            onClick={toggleVerification}
            className={`flex items-center px-3 py-1.5 rounded-lg text-sm border ${
              verificationEnabled 
                ? 'bg-blue-100 border-blue-300 text-blue-800 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-200' 
                : 'bg-gray-100 border-gray-300 text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300'
            }`}
          >
            <span className={`mr-2 inline-block w-4 h-4 rounded-full ${verificationEnabled ? 'bg-blue-500' : 'bg-gray-400'}`}></span>
            Verification Mode {verificationEnabled ? 'On' : 'Off'}
          </button>
          {verificationEnabled && (
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <span className="inline-block w-3 h-3 bg-green-600 rounded-full mr-1"></span> Correct
              <span className="inline-block w-3 h-3 bg-red-600 rounded-full ml-3 mr-1"></span> Incorrect
            </div>
          )}
        </div>
      )}

      {hasSubmitted && (
        <div className="mt-4 flex items-center gap-2">
          <div className="text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <span className="inline-block w-3 h-3 bg-green-600 rounded-full mr-1"></span> Correct live cells
            <span className="inline-block w-3 h-3 bg-red-600 rounded-full ml-3 mr-1"></span> Incorrect live cells
            <span className="inline-block w-3 h-3 bg-orange-500 rounded-full ml-3 mr-1"></span> Missed live cells
          </div>
        </div>
      )}

      {hasSubmitted && (
        <div className="mt-8 flex flex-col items-center">
          <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            Correct Next State (t={timeStep+1})
          </h3>
          <Board 
            board={correctBoard} 
            isInteractive={false}
          />
          
          <div className="mt-4 text-center">
            <p className="text-lg font-semibold">
              {isCorrect 
                ? "Perfect! You predicted the next state correctly!" 
                : `You got ${matchingCells}/${totalCells} cells correct (${accuracy}%).`}
            </p>
          </div>
        </div>
      )}

      <div className="mt-8 flex gap-4">
        {!hasSubmitted ? (
          <button
            onClick={handleSubmit}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Submit Prediction
          </button>
        ) : (
          <button
            onClick={handleNextRound}
            className="rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            Next Generation
          </button>
        )}
        
        <button
          onClick={startNewGame}
          className="rounded-lg bg-gray-600 px-4 py-2 text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          New Game
        </button>
      </div>

      <div className="mt-8 rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20 max-w-3xl">
        <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">How to Play</h3>
        <ul className="list-inside list-disc space-y-1 text-gray-700 dark:text-gray-300">
          <li>The left board shows the current state of Conway&apos;s Game of Life at time step t.</li>
          <li>Your task is to predict the next state at time step t+1 on the right board by clicking cells to toggle them between alive (black) and dead (white).</li>
          <li>After each round, the solution becomes the new initial state for the next round, allowing you to follow the evolution of patterns over time.</li>
          <li>The rules of Conway&apos;s Game of Life (B3/S23) are:
            <ul className="ml-6 list-inside list-disc">
              <li>Any live cell with 2 or 3 live neighbors survives to the next generation.</li>
              <li>Any dead cell with exactly 3 live neighbors becomes alive in the next generation.</li>
              <li>All other cells die or remain dead in the next generation.</li>
            </ul>
          </li>
          <li>Turn on verification mode to see if your alive cells are placed correctly (green) or incorrectly (red).</li>
          <li>After submitting your prediction, colors will show your performance:
            <ul className="ml-6 list-inside list-disc">
              <li><span className="inline-block w-3 h-3 bg-green-600 rounded-full mr-1"></span> Green: Correctly placed live cells</li>
              <li><span className="inline-block w-3 h-3 bg-red-600 rounded-full mr-1"></span> Red: Incorrectly placed live cells</li>
              <li><span className="inline-block w-3 h-3 bg-orange-500 rounded-full mr-1"></span> Orange: Missed live cells (cells that should be alive)</li>
            </ul>
          </li>
          <li>Hover over a cell to highlight its corresponding position in both boards.</li>
          <li>After submitting your prediction, the correct next state will be revealed.</li>
          <li>Your score increases for each perfect prediction.</li>
        </ul>
      </div>
    </div>
  );
} 