import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import NumberPuzzleGame from '../../../../components/games/numberPuzzle/NumberPuzzleGame';

// Mock the next-intl translations
jest.mock('next-intl', () => ({
  useTranslations: () => (key: string, params?: Record<string, number>) => {
    if (key === 'moves') return 'Moves';
    if (key === 'newGame') return 'New Game';
    if (key === 'gridSize') return 'Grid Size';
    if (key === 'congratulations') return `Congratulations! You solved the puzzle in ${params?.moves} moves!`;
    if (key === 'howToPlay') return 'How to Play';
    if (key.startsWith('instructions.')) return 'Mock instruction';
    return key;
  },
}));

describe('NumberPuzzleGame', () => {
  it('renders correctly with default grid size', () => {
    render(<NumberPuzzleGame />);
    
    // Check that the game UI elements are present
    expect(screen.getByText('Moves:')).toBeInTheDocument();
    expect(screen.getByText('New Game')).toBeInTheDocument();
    expect(screen.getByText('Grid Size:')).toBeInTheDocument();
    expect(screen.getByText('How to Play')).toBeInTheDocument();
    
    // Check that grid size buttons are present
    expect(screen.getByText('3x3')).toBeInTheDocument();
    expect(screen.getByText('4x4')).toBeInTheDocument();
    expect(screen.getByText('5x5')).toBeInTheDocument();
    
    // 4x4 is the default size, so we should have 15 number tiles (1-15)
    for (let i = 1; i <= 15; i++) {
      expect(screen.getByText(i.toString())).toBeInTheDocument();
    }
  });
  
  it('changes grid size when size buttons are clicked', () => {
    render(<NumberPuzzleGame />);
    
    // Initially 4x4 grid with numbers 1-15
    expect(screen.getByText('15')).toBeInTheDocument();
    
    // Click 3x3 grid size button
    fireEvent.click(screen.getByText('3x3'));
    
    // Now should have numbers 1-8 for a 3x3 grid
    expect(screen.getByText('8')).toBeInTheDocument();
    expect(screen.queryByText('9')).not.toBeInTheDocument();
    
    // Click 5x5 grid size button
    fireEvent.click(screen.getByText('5x5'));
    
    // Now should have numbers 1-24 for a 5x5 grid
    expect(screen.getByText('24')).toBeInTheDocument();
  });
  
  it('increments move counter when a valid tile is clicked', () => {
    render(<NumberPuzzleGame />);
    
    // Find the initial move count
    const movesText = screen.getByText(/Moves:/);
    expect(movesText).toHaveTextContent('Moves: 0');
    
    // Find a tile that is adjacent to the empty space
    // Note: Since the puzzle is randomly initialized, we need to find a movable tile dynamically
    // This is a bit tricky in a unit test, we'll need to find a tile that's enabled (clickable)
    const allTiles = screen.getAllByRole('button').filter(
      button => button.textContent && /^\d+$/.test(button.textContent) && !button.hasAttribute('disabled')
    );
    
    // If there are movable tiles, click one
    if (allTiles.length > 0) {
      fireEvent.click(allTiles[0]);
      // Check that move counter has incremented
      expect(movesText).not.toHaveTextContent('Moves: 0');
    }
  });
  
  it('starts a new game when New Game button is clicked', () => {
    render(<NumberPuzzleGame />);
    
    // Get initial move count
    const movesText = screen.getByText(/Moves:/);
    expect(movesText).toHaveTextContent('Moves: 0');
    
    // Find and click a movable tile to increment the move counter
    const allTiles = screen.getAllByRole('button').filter(
      button => button.textContent && /^\d+$/.test(button.textContent) && !button.hasAttribute('disabled')
    );
    
    if (allTiles.length > 0) {
      fireEvent.click(allTiles[0]);
      // Verify move counter has changed
      expect(movesText).not.toHaveTextContent('Moves: 0');
    }
    
    // Click New Game button
    const newGameButton = screen.getByText('New Game');
    fireEvent.click(newGameButton);
    
    // Verify move counter has been reset
    expect(movesText).toHaveTextContent('Moves: 0');
  });
}); 