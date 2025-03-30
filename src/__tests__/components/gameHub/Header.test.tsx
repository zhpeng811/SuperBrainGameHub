import React from 'react';
import { render, screen } from '@testing-library/react';
import Header from '@/components/gameHub/Header';

// Mock the next-intl useTranslations hook
jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      'title': 'SuperBrain Game Hub',
      'subtitle': 'Train your brain with fun games',
      'myProfile': 'My Profile',
      'settings': 'Settings'
    };
    return translations[key] || key;
  },
}));

// Mock the LanguageSelector component
jest.mock('@/components/ui/LanguageSelector', () => {
  return function MockLanguageSelector() {
    return <div data-testid="language-selector">LanguageSelector</div>;
  };
});

describe('Header Component', () => {
  it('renders the header with title and subtitle', () => {
    render(<Header />);
    
    // Check that the title is rendered
    expect(screen.getByText('SuperBrain Game Hub')).toBeInTheDocument();
    
    // Check that the subtitle is rendered
    expect(screen.getByText('Train your brain with fun games')).toBeInTheDocument();
  });

  it('renders the profile and settings buttons', () => {
    render(<Header />);
    
    // Check that the buttons are rendered
    expect(screen.getByText('My Profile')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('renders the language selector component', () => {
    render(<Header />);
    
    // Check that the language selector is rendered
    expect(screen.getByTestId('language-selector')).toBeInTheDocument();
  });
}); 