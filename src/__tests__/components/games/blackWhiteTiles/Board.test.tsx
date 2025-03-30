import { render, screen, fireEvent } from '@testing-library/react';
import Board from '../../../../components/games/blackWhiteTiles/Board';

// Mock the Tile component
jest.mock('../../../../components/games/blackWhiteTiles/Tile', () => {
  return function MockTile({ isBlack, isInteractive, onClick }: { isBlack: boolean; isInteractive: boolean; onClick?: () => void }) {
    return (
      <div 
        data-testid={`tile-${isBlack ? 'black' : 'white'}`}
        data-interactive={isInteractive}
        onClick={onClick}
        role={isInteractive ? 'button' : 'presentation'}
      />
    );
  };
});

describe('Board Component', () => {
  const mockBoard = [
    [true, false],
    [false, true]
  ];
  
  it('renders the correct number of tiles', () => {
    render(<Board board={mockBoard} isInteractive={false} />);
    
    // 2x2 board, so 4 tiles
    const tiles = screen.getAllByTestId(/^tile-/);
    expect(tiles).toHaveLength(4);
  });
  
  it('renders tiles with correct colors', () => {
    render(<Board board={mockBoard} isInteractive={false} />);
    
    const blackTiles = screen.getAllByTestId('tile-black');
    const whiteTiles = screen.getAllByTestId('tile-white');
    
    // Our mock board has 2 black and 2 white tiles
    expect(blackTiles).toHaveLength(2);
    expect(whiteTiles).toHaveLength(2);
  });
  
  it('sets interactive prop on tiles correctly when board is interactive', () => {
    render(<Board board={mockBoard} isInteractive={true} />);
    
    const tiles = screen.getAllByRole('button');
    expect(tiles).toHaveLength(4);
    
    tiles.forEach(tile => {
      expect(tile).toHaveAttribute('data-interactive', 'true');
    });
  });
  
  it('sets interactive prop on tiles correctly when board is not interactive', () => {
    render(<Board board={mockBoard} isInteractive={false} />);
    
    const tiles = screen.getAllByRole('presentation');
    expect(tiles).toHaveLength(4);
    
    tiles.forEach(tile => {
      expect(tile).toHaveAttribute('data-interactive', 'false');
    });
  });
  
  it('calls onTileClick with correct coordinates when a tile is clicked', () => {
    const mockOnTileClick = jest.fn();
    
    render(<Board board={mockBoard} isInteractive={true} onTileClick={mockOnTileClick} />);
    
    const tiles = screen.getAllByRole('button');
    
    // Click the first tile (0,0)
    fireEvent.click(tiles[0]);
    expect(mockOnTileClick).toHaveBeenCalledWith(0, 0);
    
    // Click the last tile (1,1)
    fireEvent.click(tiles[3]);
    expect(mockOnTileClick).toHaveBeenCalledWith(1, 1);
  });
  
  it('does not provide onClick handler to tiles when onTileClick is not provided', () => {
    render(<Board board={mockBoard} isInteractive={true} />);
    
    // All tiles should still be interactive (buttons) even without an onClick handler
    const tiles = screen.getAllByRole('button');
    expect(tiles).toHaveLength(4);
  });
}); 