import { render, screen, fireEvent, act } from '@testing-library/react';
import RapidCalculationGame from '../../../../components/games/rapidCalculation/RapidCalculationGame';

// Mock the next-intl useTranslations hook
jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

// Mock the utils file
jest.mock('../../../../components/games/rapidCalculation/utils', () => ({
  generateNumbers: jest.fn(() => [10, 20, 30, 40, 50]),
  calculateSum: jest.fn(() => 150),
}));

// Mock setTimeout and clearTimeout
jest.useFakeTimers();

describe('Rapid Calculation Game Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  it('renders the initial game state with options', () => {
    render(<RapidCalculationGame />);
    
    // Check for instructions
    expect(screen.getByText('instructions')).toBeInTheDocument();
    
    // Check for configuration options
    expect(screen.getByLabelText('numberCount')).toBeInTheDocument();
    expect(screen.getByLabelText('timeInterval')).toBeInTheDocument();
    expect(screen.getByLabelText('digitCount')).toBeInTheDocument();
    
    // Check for start button
    expect(screen.getByText('startGame')).toBeInTheDocument();
  });

  it('allows changing configuration options', () => {
    render(<RapidCalculationGame />);
    
    // Select number count
    const numberCountSelector = screen.getByLabelText('numberCount');
    fireEvent.change(numberCountSelector, { target: { value: '10' } });
    expect(numberCountSelector).toHaveValue('10');
    
    // Select time interval
    const timeIntervalSelector = screen.getByLabelText('timeInterval');
    fireEvent.change(timeIntervalSelector, { target: { value: '500' } });
    expect(timeIntervalSelector).toHaveValue('500');
    
    // Select digit count
    const digitCountSelector = screen.getByLabelText('digitCount');
    fireEvent.change(digitCountSelector, { target: { value: '3' } });
    expect(digitCountSelector).toHaveValue('3');
  });

  it('transitions to playing state when game starts', () => {
    render(<RapidCalculationGame />);
    
    // Start the game
    fireEvent.click(screen.getByText('startGame'));
    
    // Should be in playing state now
    expect(screen.getByText('memorize')).toBeInTheDocument();
    
    // Should display a number (we mocked it to start with 10)
    const numberDisplay = screen.getByText('10');
    expect(numberDisplay).toBeInTheDocument();
  });

  it('transitions through number sequence and to result screen', () => {
    render(<RapidCalculationGame />);
    
    // Start with a small number count for testing
    const numberCountSelector = screen.getByLabelText('numberCount');
    fireEvent.change(numberCountSelector, { target: { value: '3' } });
    
    // Start the game
    fireEvent.click(screen.getByText('startGame'));
    
    // Run all timers to transition through all numbers and to result screen
    act(() => {
      jest.runAllTimers();
    });
    
    // Should now be in result state
    expect(screen.getByText('enterSum')).toBeInTheDocument();
    expect(screen.getByText('submit')).toBeInTheDocument();
  });

  it('handles correct answer submission', () => {
    render(<RapidCalculationGame />);
    
    // Start the game
    fireEvent.click(screen.getByText('startGame'));
    
    // Move through all numbers
    act(() => {
      jest.runAllTimers();
    });
    
    // Fill in the correct answer (which we mocked to be 150)
    const inputField = screen.getByRole('spinbutton');
    fireEvent.change(inputField, { target: { value: '150' } });
    
    // Submit the answer
    fireEvent.click(screen.getByText('submit'));
    
    // Check that the result is displayed as correct
    expect(screen.queryByText('correct')).toBeInTheDocument();
    expect(screen.getByText('playAgain')).toBeInTheDocument();
  });

  it('handles incorrect answer submission', () => {
    render(<RapidCalculationGame />);
    
    // Start the game
    fireEvent.click(screen.getByText('startGame'));
    
    // Move through all numbers
    act(() => {
      jest.runAllTimers();
    });
    
    // Submit an answer that's definitely wrong
    const inputField = screen.getByRole('spinbutton');
    fireEvent.change(inputField, { target: { value: '0' } });
    
    // Submit the answer
    fireEvent.click(screen.getByText('submit'));
    
    // Check that the result is displayed (we're expecting it to be incorrect)
    expect(screen.queryByText('incorrect')).toBeInTheDocument();
    expect(screen.getByText('playAgain')).toBeInTheDocument();
  });

  it('resets the game correctly', () => {
    render(<RapidCalculationGame />);
    
    // Start the game
    fireEvent.click(screen.getByText('startGame'));
    
    // Move through all numbers
    act(() => {
      jest.runAllTimers();
    });
    
    // Submit any answer
    const inputField = screen.getByRole('spinbutton');
    fireEvent.change(inputField, { target: { value: '123' } });
    fireEvent.click(screen.getByText('submit'));
    
    // Reset the game
    fireEvent.click(screen.getByText('playAgain'));
    
    // Should be back to initial state
    expect(screen.getByText('startGame')).toBeInTheDocument();
    expect(screen.getByText('instructions')).toBeInTheDocument();
  });

  it('cleans up timers when unmounted', () => {
    const { unmount } = render(<RapidCalculationGame />);
    
    // Start the game
    fireEvent.click(screen.getByText('startGame'));
    
    // Spy on clearTimeout
    const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');
    
    // Unmount the component
    unmount();
    
    // Check that clearTimeout was called
    expect(clearTimeoutSpy).toHaveBeenCalled();
  });
}); 