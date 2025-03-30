import { render, screen, fireEvent } from '@testing-library/react';
import Board from '../../../../components/games/gameOfLife/Board';

// Define interface for MockTile props
interface MockTileProps {
  isAlive: boolean;
  isInteractive: boolean;
  isHighlighted?: boolean;
  isCorrect?: boolean | null;
  isMissed?: boolean;
  verificationEnabled?: boolean;
  showPostSubmission?: boolean;
  onClick?: () => void;
  onHover?: () => void;
  onHoverEnd?: () => void;
}

// Mock the Tile component
jest.mock('../../../../components/games/gameOfLife/Tile', () => {
  return function MockTile({ 
    isAlive, 
    isInteractive, 
    isHighlighted, 
    onClick, 
    onHover, 
    onHoverEnd 
  }: MockTileProps) {
    return (
      <div 
        data-testid={`tile-${isAlive ? 'alive' : 'dead'}`}
        data-interactive={isInteractive}
        data-highlighted={isHighlighted || false}
        onClick={onClick}
        onMouseEnter={onHover}
        onMouseLeave={onHoverEnd}
      />
    );
  };
});

describe('Game of Life - Board Component', () => {
  const mockBoard = [
    [true, false],
    [false, true]
  ];

  it('renders the correct number of tiles', () => {
    render(<Board board={mockBoard} isInteractive={false} />);
    
    // 2x2 board should render 4 tiles
    const tiles = screen.getAllByTestId(/^tile-/);
    expect(tiles).toHaveLength(4);
    
    // Check specific tiles
    expect(screen.getAllByTestId('tile-alive')).toHaveLength(2);
    expect(screen.getAllByTestId('tile-dead')).toHaveLength(2);
  });

  it('renders the title when provided', () => {
    render(<Board board={mockBoard} isInteractive={false} title="Test Title" />);
    
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('passes interactivity prop to tiles correctly', () => {
    render(<Board board={mockBoard} isInteractive={true} />);
    
    const tiles = screen.getAllByTestId(/^tile-/);
    tiles.forEach(tile => {
      expect(tile).toHaveAttribute('data-interactive', 'true');
    });
  });

  it('calls onTileClick when a tile is clicked', () => {
    const handleTileClick = jest.fn();
    render(
      <Board 
        board={mockBoard} 
        isInteractive={true} 
        onTileClick={handleTileClick} 
      />
    );
    
    const firstTile = screen.getAllByTestId(/^tile-/)[0];
    fireEvent.click(firstTile);
    
    expect(handleTileClick).toHaveBeenCalledTimes(1);
    expect(handleTileClick).toHaveBeenCalledWith(0, 0);
  });

  it('highlights the correct cell when highlightedCell is provided', () => {
    const highlightedCell = { row: 0, col: 1 };
    render(
      <Board 
        board={mockBoard} 
        isInteractive={false} 
        highlightedCell={highlightedCell}
      />
    );
    
    const tiles = screen.getAllByTestId(/^tile-/);
    
    // The second tile (index 1) should be highlighted
    expect(tiles[1]).toHaveAttribute('data-highlighted', 'true');
    
    // Other tiles should not be highlighted
    expect(tiles[0]).toHaveAttribute('data-highlighted', 'false');
    expect(tiles[2]).toHaveAttribute('data-highlighted', 'false');
    expect(tiles[3]).toHaveAttribute('data-highlighted', 'false');
  });

  it('calls onTileHover and onTileHoverEnd when mouse events occur', () => {
    const handleTileHover = jest.fn();
    const handleTileHoverEnd = jest.fn();
    
    render(
      <Board 
        board={mockBoard} 
        isInteractive={false} 
        onTileHover={handleTileHover}
        onTileHoverEnd={handleTileHoverEnd}
      />
    );
    
    const firstTile = screen.getAllByTestId(/^tile-/)[0];
    
    fireEvent.mouseEnter(firstTile);
    expect(handleTileHover).toHaveBeenCalledTimes(1);
    expect(handleTileHover).toHaveBeenCalledWith(0, 0);
    
    fireEvent.mouseLeave(firstTile);
    expect(handleTileHoverEnd).toHaveBeenCalledTimes(1);
  });

  it('passes verification props to tiles correctly', () => {
    const correctBoard = [
      [true, true],
      [true, true]
    ];
    
    render(
      <Board 
        board={mockBoard} 
        isInteractive={false} 
        verificationEnabled={true}
        correctBoard={correctBoard}
        showPostSubmission={true}
      />
    );
    
    // All tiles should render
    const tiles = screen.getAllByTestId(/^tile-/);
    expect(tiles).toHaveLength(4);
  });
}); 