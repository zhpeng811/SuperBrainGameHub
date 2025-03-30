import React from 'react';
import { render, screen } from '@testing-library/react';
import GameCard from '@/components/gameHub/GameCard';

// Mock the next-intl useTranslations hook
jest.mock('next-intl', () => ({
  useTranslations: () => {
    // Create a function that has both a call signature and a 'has' method
    const t = (key: string) => {
      const translations: Record<string, string> = {
        'games.blackWhiteTiles.title': 'Black White Tiles',
        'games.blackWhiteTiles.description': 'Match the pattern by toggling tiles between black and white.'
      };
      return translations[key] || key;
    };
    t.has = (key: string) => {
      return key.includes('blackWhiteTiles');
    };
    return t;
  }
}));

// Mock the BasePathLink component
jest.mock('@/components/ui/BasePathLink', () => {
  return function MockBasePathLink({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) {
    return (
      <a href={href} className={className} data-testid="base-path-link">
        {children}
      </a>
    );
  };
});

// Mock the BasePathImage component
jest.mock('@/components/ui/BasePathImage', () => {
  return function MockBasePathImage({ src, alt }: {
    src: string;
    alt: string;
    fill?: boolean;
    className?: string;
    sizes?: string;
    priority?: boolean;
  }) {
    return <img src={src} alt={alt} data-testid="base-path-image" />;
  };
});

describe('GameCard Component', () => {
  const mockProps = {
    id: 'blackWhiteTiles',
    title: 'Black White Tiles',
    description: 'Match the pattern by toggling tiles between black and white.',
    imageUrl: '/black-white-tiles.png',
    link: '/games/black-white-tiles',
  };

  it('renders the game card with title and description', () => {
    render(<GameCard {...mockProps} />);
    
    // Check that the title and description are rendered with translated content
    expect(screen.getByText('Black White Tiles')).toBeInTheDocument();
    expect(screen.getByText('Match the pattern by toggling tiles between black and white.')).toBeInTheDocument();
  });

  it('renders the image when imageUrl is provided', () => {
    render(<GameCard {...mockProps} />);
    
    // Check that the image is rendered
    const image = screen.getByTestId('base-path-image');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', '/black-white-tiles.png');
    expect(image).toHaveAttribute('alt', 'Black White Tiles');
  });

  it('renders a fallback when no imageUrl is provided', () => {
    const propsWithoutImage = {
      ...mockProps,
      imageUrl: '',
    };
    
    render(<GameCard {...propsWithoutImage} />);
    
    // Check that the fallback (first letter of title) is rendered
    expect(screen.getByText('B')).toBeInTheDocument();
  });

  it('links to the correct game page', () => {
    render(<GameCard {...mockProps} />);
    
    // Check that the link is rendered with the correct href
    const link = screen.getByTestId('base-path-link');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/games/black-white-tiles');
  });
}); 