import React from 'react';
import { render, screen } from '@testing-library/react';
import GameGrid from '@/components/gameHub/GameGrid';

// Mock the GameCard component
jest.mock('@/components/gameHub/GameCard', () => {
  return function MockGameCard({ id, title, description, imageUrl, link }: {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    link: string;
  }) {
    return (
      <div data-testid={`game-card-${id}`}>
        <h3>{title}</h3>
        <p>{description}</p>
        <span>{imageUrl}</span>
        <a href={link}>{link}</a>
      </div>
    );
  };
});

describe('GameGrid Component', () => {
  const mockGames = [
    {
      id: 'game1',
      title: 'Game 1',
      description: 'Description 1',
      imageUrl: '/image1.png',
      link: '/game1',
    },
    {
      id: 'game2',
      title: 'Game 2',
      description: 'Description 2',
      imageUrl: '/image2.png',
      link: '/game2',
    },
    {
      id: 'game3',
      title: 'Game 3',
      description: 'Description 3',
      imageUrl: '/image3.png',
      link: '/game3',
    },
  ];

  it('renders the correct number of game cards', () => {
    render(<GameGrid games={mockGames} />);
    
    // Check that the correct number of game cards are rendered
    expect(screen.getByTestId('game-card-game1')).toBeInTheDocument();
    expect(screen.getByTestId('game-card-game2')).toBeInTheDocument();
    expect(screen.getByTestId('game-card-game3')).toBeInTheDocument();
  });

  it('passes correct props to each GameCard', () => {
    render(<GameGrid games={mockGames} />);
    
    // Check that the correct titles are passed to each GameCard
    expect(screen.getByText('Game 1')).toBeInTheDocument();
    expect(screen.getByText('Game 2')).toBeInTheDocument();
    expect(screen.getByText('Game 3')).toBeInTheDocument();
    
    // Check that the correct descriptions are passed to each GameCard
    expect(screen.getByText('Description 1')).toBeInTheDocument();
    expect(screen.getByText('Description 2')).toBeInTheDocument();
    expect(screen.getByText('Description 3')).toBeInTheDocument();
    
    // Check that the correct links are passed to each GameCard
    expect(screen.getByText('/game1')).toBeInTheDocument();
    expect(screen.getByText('/game2')).toBeInTheDocument();
    expect(screen.getByText('/game3')).toBeInTheDocument();
  });

  it('renders correctly with an empty array of games', () => {
    render(<GameGrid games={[]} />);
    
    // Check that no game cards are rendered
    const container = screen.queryByTestId(/game-card-/);
    expect(container).not.toBeInTheDocument();
  });
}); 