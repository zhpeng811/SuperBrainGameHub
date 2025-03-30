import React from 'react';
import { render, screen } from '@testing-library/react';
import Home from '@/app/page';

// Mock the next-intl useTranslations hook
jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      'featuredGames': 'Featured Games',
      'aboutTitle': 'About SuperBrain',
      'aboutDescription': 'Train your brain with fun and challenging games.',
      'learnMore': 'Learn More'
    };
    return translations[key] || key;
  },
}));

// Mock the Header component
jest.mock('@/components/gameHub/Header', () => {
  return function MockHeader() {
    return <header data-testid="header">Header Component</header>;
  };
});

// Mock the GameGrid component
jest.mock('@/components/gameHub/GameGrid', () => {
  return function MockGameGrid({ games }: { games: Array<{id: string}> }) {
    return (
      <div data-testid="game-grid">
        Game Grid with {games.length} games
      </div>
    );
  };
});

// Mock the games data
jest.mock('@/data/games', () => ({
  games: [
    { id: 'game1' },
    { id: 'game2' },
    { id: 'game3' },
  ],
}));

describe('Home Page (Main Menu)', () => {
  it('renders the header component', () => {
    render(<Home />);
    
    expect(screen.getByTestId('header')).toBeInTheDocument();
  });

  it('renders the featured games section', () => {
    render(<Home />);
    
    expect(screen.getByText('Featured Games')).toBeInTheDocument();
    expect(screen.getByTestId('game-grid')).toBeInTheDocument();
    expect(screen.getByText('Game Grid with 3 games')).toBeInTheDocument();
  });

  it('renders the about section', () => {
    render(<Home />);
    
    expect(screen.getByText('About SuperBrain')).toBeInTheDocument();
    expect(screen.getByText('Train your brain with fun and challenging games.')).toBeInTheDocument();
    expect(screen.getByText('Learn More')).toBeInTheDocument();
  });
}); 