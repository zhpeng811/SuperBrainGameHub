import { render, screen, fireEvent } from '@testing-library/react';
import GameOfLifeGame from '../../../../components/games/gameOfLife/GameOfLifeGame';
import * as utils from '../../../../components/games/gameOfLife/utils';

// Mock the next-intl useTranslations hook
jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

// Define interface for MockBoard props
interface MockBoardProps {
  board: boolean[][];
  isInteractive: boolean;
  onTileClick?: (row: number, col: number) => void;
  title?: string;
  highlightedCell?: { row: number, col: number } | null;
  verificationEnabled?: boolean;
  correctBoard?: boolean[][];
  showPostSubmission?: boolean;
  onTileHover?: (row: number, col: number) => void;
  onTileHoverEnd?: () => void;
}

// Mock the Board component
jest.mock('../../../../components/games/gameOfLife/Board', () => {
  return function MockBoard({ 
    board, 
    isInteractive, 
    onTileClick, 
    title, 
    verificationEnabled,
    correctBoard,
    showPostSubmission
  }: MockBoardProps) {
    // Add a safety check to handle potentially undefined boards during testing
    const boardRows = board?.length || 0;
    const boardCols = boardRows > 0 && board[0]?.length ? board[0].length : 0;
    
    return (
      <div data-testid="game-board">
        <h3 data-testid="board-title">{title}</h3>
        <div data-testid="board-interactive">{isInteractive.toString()}</div>
        {isInteractive && onTileClick && (
          <button 
            data-testid="board-tile-button" 
            onClick={() => onTileClick(1, 1)}
          >
            Click Tile
          </button>
        )}
        <div data-testid="verification-enabled">{verificationEnabled ? 'true' : 'false'}</div>
        <div data-testid="show-post-submission">{showPostSubmission ? 'true' : 'false'}</div>
        <div data-testid="board-size">{boardRows}x{boardCols}</div>
        {correctBoard && <div data-testid="has-correct-board">true</div>}
      </div>
    );
  };
});

// Mock the utility functions
jest.mock('../../../../components/games/gameOfLife/utils', () => ({
  createEmptyBoard: jest.fn(() => [
    [false, false],
    [false, false]
  ]),
  generateRandomBoard: jest.fn(() => [
    [true, false],
    [false, true]
  ]),
  calculateNextState: jest.fn(() => [
    [false, true],
    [true, false]
  ]),
  countMatchingCells: jest.fn(() => 2),
}));

describe('Game of Life Game Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the game correctly', () => {
    render(<GameOfLifeGame />);
    
    // Check for main game elements - we should have two boards
    const boards = screen.getAllByTestId('game-board');
    expect(boards).toHaveLength(2);
    
    // Check for current state board
    const boardTitles = screen.getAllByTestId('board-title');
    expect(boardTitles[0].textContent).toBe('currentState');
    expect(boardTitles[1].textContent).toBe('yourPrediction');
  });

  it('initializes the game with proper board states', () => {
    render(<GameOfLifeGame />);
    
    // Check that utility functions were called to initialize the game
    expect(utils.generateRandomBoard).toHaveBeenCalled();
    expect(utils.calculateNextState).toHaveBeenCalled();
    expect(utils.createEmptyBoard).toHaveBeenCalled();
  });

  it('handles tile clicks on the player board', () => {
    render(<GameOfLifeGame />);
    
    // Find and click a tile on the player board
    const tileButton = screen.getByTestId('board-tile-button');
    fireEvent.click(tileButton);
    
    // The Board component's onTileClick should call handleCellClick in the game component
    // We can't directly verify the state changes, but we can check if the player board remains interactive
    expect(screen.getAllByTestId('board-interactive')[1].textContent).toBe('true');
  });

  it('handles game verification mode', () => {
    render(<GameOfLifeGame />);
    
    // Initially, verification should be disabled
    const verificationElements = screen.getAllByTestId('verification-enabled');
    expect(verificationElements[1].textContent).toBe('false');
    
    // Toggle verification mode
    const verificationButton = screen.getByText('enableVerification');
    fireEvent.click(verificationButton);
    
    // Verification should now be enabled
    expect(verificationElements[1].textContent).toBe('true');
    
    // Toggle verification mode again
    const disableButton = screen.getByText('disableVerification');
    fireEvent.click(disableButton);
    
    // Verification should be disabled again
    expect(verificationElements[1].textContent).toBe('false');
  });

  it('handles prediction submission', () => {
    // Mock countMatchingCells to return a partial match (not perfect)
    (utils.countMatchingCells as jest.Mock).mockReturnValue(3);
    
    render(<GameOfLifeGame />);
    
    // Submit the prediction
    const submitButton = screen.getByText('submitPrediction');
    fireEvent.click(submitButton);
    
    // The player board should no longer be interactive
    expect(screen.getAllByTestId('board-interactive')[1].textContent).toBe('false');
    
    // The post-submission display should be shown
    expect(screen.getAllByTestId('show-post-submission')[1].textContent).toBe('true');
    
    // For a non-perfect match, the accuracy message should be displayed
    expect(screen.getByText('accuracy')).toBeInTheDocument();
    
    // Next round button should be available
    expect(screen.getByText('nextRound')).toBeInTheDocument();
  });

  it('handles starting a new game', () => {
    render(<GameOfLifeGame />);
    
    // Clear mocks to check new calls
    jest.clearAllMocks();
    
    // Start a new game
    const newGameButton = screen.getByText('newGame');
    fireEvent.click(newGameButton);
    
    // Check that new boards were generated
    expect(utils.generateRandomBoard).toHaveBeenCalledTimes(1);
    expect(utils.calculateNextState).toHaveBeenCalledTimes(1);
    expect(utils.createEmptyBoard).toHaveBeenCalledTimes(1);
  });

  it('advances to the next round', () => {
    render(<GameOfLifeGame />);
    
    // Submit the prediction to enable next round
    const submitButton = screen.getByText('submitPrediction');
    fireEvent.click(submitButton);
    
    // Clear mocks to check new calls
    jest.clearAllMocks();
    
    // Go to the next round
    const nextRoundButton = screen.getByText('nextRound');
    fireEvent.click(nextRoundButton);
    
    // Check that new state was calculated
    expect(utils.calculateNextState).toHaveBeenCalledTimes(1);
    expect(utils.createEmptyBoard).toHaveBeenCalledTimes(1);
    
    // The player board should be interactive again
    expect(screen.getAllByTestId('board-interactive')[1].textContent).toBe('true');
  });
}); 