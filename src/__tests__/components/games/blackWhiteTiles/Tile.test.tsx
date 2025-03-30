import { render, screen, fireEvent } from '@testing-library/react';
import Tile from '../../../../components/games/blackWhiteTiles/Tile';

describe('Tile Component', () => {
  it('renders a white tile when isBlack is false', () => {
    render(<Tile isBlack={false} isInteractive={false} />);
    
    const tileElement = screen.getByRole('presentation');
    expect(tileElement).toHaveClass('bg-white');
    expect(tileElement).not.toHaveClass('bg-gray-900');
  });

  it('renders a black tile when isBlack is true', () => {
    render(<Tile isBlack={true} isInteractive={false} />);
    
    const tileElement = screen.getByRole('presentation');
    expect(tileElement).toHaveClass('bg-gray-900');
    expect(tileElement).not.toHaveClass('bg-white');
  });

  it('is non-interactive when isInteractive is false', () => {
    render(<Tile isBlack={false} isInteractive={false} />);
    
    const tileElement = screen.getByRole('presentation');
    expect(tileElement).toHaveClass('cursor-default');
    expect(tileElement).not.toHaveClass('cursor-pointer');
  });

  it('is interactive when isInteractive is true', () => {
    render(<Tile isBlack={false} isInteractive={true} />);
    
    const tileElement = screen.getByRole('button');
    expect(tileElement).toHaveClass('cursor-pointer');
    expect(tileElement).not.toHaveClass('cursor-default');
  });

  it('calls onClick when clicked and isInteractive is true', () => {
    const onClickMock = jest.fn();
    
    render(<Tile isBlack={false} isInteractive={true} onClick={onClickMock} />);
    
    const tileElement = screen.getByRole('button');
    fireEvent.click(tileElement);
    
    expect(onClickMock).toHaveBeenCalledTimes(1);
  });

  it('does not call onClick when clicked and isInteractive is false', () => {
    const onClickMock = jest.fn();
    
    render(<Tile isBlack={false} isInteractive={false} onClick={onClickMock} />);
    
    const tileElement = screen.getByRole('presentation');
    fireEvent.click(tileElement);
    
    expect(onClickMock).not.toHaveBeenCalled();
  });

  it('has correct aria-label when interactive', () => {
    render(<Tile isBlack={true} isInteractive={true} />);
    
    const tileElement = screen.getByRole('button');
    expect(tileElement).toHaveAttribute('aria-label', 'Tile black');
  });

  it('has no aria-label when not interactive', () => {
    render(<Tile isBlack={true} isInteractive={false} />);
    
    const tileElement = screen.getByRole('presentation');
    expect(tileElement).not.toHaveAttribute('aria-label');
  });
}); 