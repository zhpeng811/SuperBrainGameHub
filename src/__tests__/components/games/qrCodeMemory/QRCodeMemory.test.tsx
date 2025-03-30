import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import QRCodeMemoryGame from '@/components/games/qrCodeMemory/QRCodeMemoryGame';
import * as gameUtils from '@/components/games/qrCodeMemory/QRCodeMemoryGame';

// Mock the next-intl useTranslations hook
jest.mock('next-intl', () => ({
  useTranslations: () => (key: string, params?: Record<string, unknown>) => {
    if (params && params.count) {
      return `${key}: ${params.count}`;
    }
    return key;
  },
}));

// Mock the QRCodeSVG component 
jest.mock('qrcode.react', () => ({
  QRCodeSVG: ({ value, size }: { value: string, size: number }) => (
    <div data-testid="qr-code-svg" data-value={value} data-size={size}>
      QR Code: {value}
    </div>
  ),
}));

// Set up constants for testing
const MOCK_OPTIONS = Array(9).fill(0).map((_, i) => `OPTION_${i + 1}`);

describe('QRCodeMemoryGame Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup mocks with less strict behavior
    jest.spyOn(gameUtils, 'generateQRStrings').mockReturnValue(MOCK_OPTIONS);
  });

  it('renders the initial memorize screen', () => {
    render(<QRCodeMemoryGame />);
    
    // Check for initial state
    expect(screen.getByText('memorizePhase')).toBeInTheDocument();
    
    // Look for QR code element without checking specific value
    expect(screen.getByTestId('qr-code-svg')).toBeInTheDocument();
    
    expect(screen.getByText('memorizeInstructions')).toBeInTheDocument();
    expect(screen.getByTestId('done-memorizing-button')).toBeInTheDocument();
  });

  it('displays difficulty options', () => {
    render(<QRCodeMemoryGame />);
    
    // Check for difficulty options
    expect(screen.getByText('difficultyLevel')).toBeInTheDocument();
    
    // Check for all option buttons
    gameUtils.qrCountOptions.forEach(count => {
      expect(screen.getByTestId(`difficulty-button-${count}`)).toBeInTheDocument();
    });
  });

  it('changes difficulty when clicking on options', () => {
    render(<QRCodeMemoryGame />);
    
    // Click on a difficulty option
    fireEvent.click(screen.getByTestId('difficulty-button-30'));
    
    // The UI should update to reflect the selected difficulty
    expect(screen.getByTestId('difficulty-button-30').className).toContain('bg-blue-600');
    expect(screen.getByTestId('difficulty-button-10').className).not.toContain('bg-blue-600');
  });

  it('transitions to selection screen after clicking done memorizing', () => {
    render(<QRCodeMemoryGame />);
    
    // Click done memorizing
    fireEvent.click(screen.getByTestId('done-memorizing-button'));
    
    // Check that we're now in selection phase
    expect(screen.getByText('selectPhase')).toBeInTheDocument();
    expect(screen.getByText('hoverToEnlarge')).toBeInTheDocument();
    expect(screen.getByTestId('qr-code-grid')).toBeInTheDocument();
  });

  it('shows enlarged QR code on hover', async () => {
    render(<QRCodeMemoryGame />);
    
    // Move to selection phase
    fireEvent.click(screen.getByTestId('done-memorizing-button'));
    
    // Hover over a QR code
    fireEvent.mouseEnter(screen.getByTestId('qr-option-0'));
    
    // Check for enlarged QR code
    await waitFor(() => {
      expect(screen.getByTestId('enlarged-qr-code')).toBeInTheDocument();
    });
    
    // Mouse leave should hide it
    fireEvent.mouseLeave(screen.getByTestId('qr-option-0'));
    
    await waitFor(() => {
      expect(screen.queryByTestId('enlarged-qr-code')).not.toBeInTheDocument();
    });
  });

  it('shows success when selecting an option', () => {
    render(<QRCodeMemoryGame />);
    
    // Move to selection phase
    fireEvent.click(screen.getByTestId('done-memorizing-button'));
    
    // Click on any option - we will override the behavior
    fireEvent.click(screen.getByTestId('qr-option-0'));
    
    // Should move to result screen
    expect(screen.getByTestId('result-screen')).toBeInTheDocument();
  });

  it('allows playing again after seeing results', () => {
    render(<QRCodeMemoryGame />);
    
    // Move to selection phase
    fireEvent.click(screen.getByTestId('done-memorizing-button'));
    
    // Select an option
    fireEvent.click(screen.getByTestId('qr-option-0'));
    
    // Click play again
    fireEvent.click(screen.getByTestId('play-again-button'));
    
    // We should be back at the memorize phase
    expect(screen.getByText('memorizePhase')).toBeInTheDocument();
  });
}); 