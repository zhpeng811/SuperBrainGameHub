import { useState } from 'react';
import { calculateNextState } from './utils';
import Board from './Board';

export default function TestBoard() {
  const boardSize = 5;
  const [board, setBoard] = useState<boolean[][]>(
    Array(boardSize).fill(null).map(() => Array(boardSize).fill(false))
  );

  const handleCellClick = (row: number, col: number) => {
    setBoard(prevBoard => {
      const newBoard = [...prevBoard.map(row => [...row])];
      newBoard[row][col] = !newBoard[row][col];
      return newBoard;
    });
  };

  const calculateNext = () => {
    setBoard(calculateNextState(board));
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <Board
        board={board}
        isInteractive={true}
        onTileClick={handleCellClick}
        title="Test Board"
      />
      
      <button
        onClick={calculateNext}
        className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Calculate Next State
      </button>
    </div>
  );
} 