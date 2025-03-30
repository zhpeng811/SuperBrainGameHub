import { render, screen, fireEvent } from '@testing-library/react';
import Tile from '../../../../components/games/gameOfLife/Tile';

describe('Game of Life - Tile Component', () => {
  it('renders a dead cell correctly', () => {
    render(<Tile isAlive={false} isInteractive={false} />);
    
    const tileElement = screen.getByRole('presentation');
    expect(tileElement).toHaveClass('bg-white');
  });

  it('renders an alive cell correctly', () => {
    render(<Tile isAlive={true} isInteractive={false} />);
    
    const tileElement = screen.getByRole('presentation');
    expect(tileElement).toHaveClass('bg-gray-900');
  });

  it('adds interactive classes when isInteractive is true', () => {
    render(<Tile isAlive={false} isInteractive={true} />);
    
    const tileElement = screen.getByRole('button');
    expect(tileElement).toHaveClass('cursor-pointer');
    expect(tileElement).toHaveClass('hover:opacity-80');
  });

  it('adds non-interactive classes when isInteractive is false', () => {
    render(<Tile isAlive={false} isInteractive={false} />);
    
    const tileElement = screen.getByRole('presentation');
    expect(tileElement).toHaveClass('cursor-default');
    expect(tileElement).not.toHaveClass('hover:opacity-80');
  });

  it('adds highlight classes when isHighlighted is true', () => {
    render(<Tile isAlive={false} isInteractive={false} isHighlighted={true} />);
    
    const tileElement = screen.getByRole('presentation');
    expect(tileElement).toHaveClass('ring-2');
    expect(tileElement).toHaveClass('ring-blue-500');
  });

  it('applies correct verification colors when enabled', () => {
    // Correctly predicted alive cell
    const { unmount } = render(
      <Tile 
        isAlive={true} 
        isInteractive={false} 
        isCorrect={true} 
        verificationEnabled={true}
      />
    );
    
    const correctTile = screen.getByRole('presentation');
    expect(correctTile).toHaveClass('bg-green-600');
    
    // Clean up
    unmount();
    
    // Incorrectly predicted alive cell
    render(
      <Tile 
        isAlive={true} 
        isInteractive={false} 
        isCorrect={false} 
        verificationEnabled={true}
      />
    );
    
    const incorrectTile = screen.getByRole('presentation');
    expect(incorrectTile).toHaveClass('bg-red-600');
  });

  it('applies missed cell styling when appropriate', () => {
    render(
      <Tile 
        isAlive={false} 
        isInteractive={false} 
        isMissed={true} 
        showPostSubmission={true}
      />
    );
    
    const missedTile = screen.getByRole('presentation');
    expect(missedTile).toHaveClass('bg-orange-500');
  });

  it('calls the onClick handler when clicked and interactive', () => {
    const handleClick = jest.fn();
    render(
      <Tile 
        isAlive={false} 
        isInteractive={true} 
        onClick={handleClick}
      />
    );
    
    const tileElement = screen.getByRole('button');
    fireEvent.click(tileElement);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('calls hover handlers when mouse events occur', () => {
    const handleHover = jest.fn();
    const handleHoverEnd = jest.fn();
    
    render(
      <Tile 
        isAlive={false} 
        isInteractive={false} 
        onHover={handleHover}
        onHoverEnd={handleHoverEnd}
      />
    );
    
    const tileElement = screen.getByRole('presentation');
    
    fireEvent.mouseEnter(tileElement);
    expect(handleHover).toHaveBeenCalledTimes(1);
    
    fireEvent.mouseLeave(tileElement);
    expect(handleHoverEnd).toHaveBeenCalledTimes(1);
  });
}); 