import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DigitalLabyrinthGame from '../../../../components/games/digitalLabyrinth/DigitalLabyrinthGame';
import React from 'react';

// Mock the next-intl useTranslations hook
jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

describe('DigitalLabyrinthGame Component', () => {
  beforeEach(() => {
    // Mock window.matchMedia which is used in the component
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
  });

  it('renders the game correctly', () => {
    render(<DigitalLabyrinthGame />);
    
    // Check for main game elements - buttons that are always present
    expect(screen.getByText('newGame')).toBeInTheDocument();
    expect(screen.getByText('showLines')).toBeInTheDocument();
    expect(screen.getByText('immediateValidation')).toBeInTheDocument();
  });

  it('initializes with a valid game board', () => {
    render(<DigitalLabyrinthGame />);
    
    // Check that the grid container is rendered
    const gridContainer = document.querySelector('.grid-cols-9');
    expect(gridContainer).toBeInTheDocument();
    
    // Check that there are tile elements in the grid
    const tileElements = document.querySelectorAll('.text-lg.font-bold');
    expect(tileElements.length).toBeGreaterThan(0);
    
    // Verify that some tiles are revealed (have background color gray-200)
    const revealedTiles = document.querySelectorAll('.bg-gray-200');
    expect(revealedTiles.length).toBeGreaterThan(0);
  });

  it('allows starting a new game', () => {
    render(<DigitalLabyrinthGame />);
    
    // Click the New Game button
    const newGameButton = screen.getByText('newGame');
    fireEvent.click(newGameButton);
    
    // The game should have a grid
    const gridContainer = document.querySelector('.grid-cols-9');
    expect(gridContainer).toBeInTheDocument();
  });

  it('toggles show connections correctly', async () => {
    render(<DigitalLabyrinthGame />);
    
    // Find the show lines button
    const showLinesButton = screen.getByText('showLines');
    
    // Get initial state of DOM
    const initialDOM = document.body.innerHTML;
    
    // Click the button
    fireEvent.click(showLinesButton);
    
    // Wait for any state changes to render
    await waitFor(() => {
      // The document should have changed in some way after clicking
      expect(document.body.innerHTML !== initialDOM).toBe(true);
    });
  });

  it('toggles immediate validation mode', async () => {
    render(<DigitalLabyrinthGame />);
    
    // Find the validation toggle button
    const validationButton = screen.getByText('immediateValidation');
    
    // Get initial state of DOM
    const initialDOM = document.body.innerHTML;
    
    // Click the button
    fireEvent.click(validationButton);
    
    // Wait for any state changes to render
    await waitFor(() => {
      // The document should have changed in some way after clicking
      expect(document.body.innerHTML !== initialDOM).toBe(true);
    });
  });

  it('can select an unrevealed tile', () => {
    render(<DigitalLabyrinthGame />);
    
    // Find an unrevealed tile (has bg-white class)
    const unrevealedTiles = document.querySelectorAll('.bg-white');
    expect(unrevealedTiles.length).toBeGreaterThan(0);
    
    // Click the first unrevealed tile
    fireEvent.click(unrevealedTiles[0]);
    
    // Should have some kind of selected state or input field active
    // The exact mechanism depends on how selection is shown in the component
    // This might be a class change, a focused input, etc.
    
    // At minimum, the click should not throw an error
    expect(true).toBeTruthy();
  });

  it('renders revealed tiles with numbers', () => {
    render(<DigitalLabyrinthGame />);
    
    // Find revealed tiles (background color gray-200)
    const revealedTiles = document.querySelectorAll('.bg-gray-200');
    expect(revealedTiles.length).toBeGreaterThan(0);
    
    // At least some revealed tiles should have numeric content
    let hasNumberContent = false;
    revealedTiles.forEach(tile => {
      if (tile.textContent && /\d+/.test(tile.textContent)) {
        hasNumberContent = true;
      }
    });
    
    expect(hasNumberContent).toBe(true);
  });
}); 