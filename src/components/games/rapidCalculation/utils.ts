/**
 * Generates a random number between min and max (inclusive)
 */
export const generateRandomNumber = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Calculates the sum of an array of numbers
 */
export const calculateSum = (numbers: number[]): number => {
  return numbers.reduce((sum, num) => sum + num, 0);
};

/**
 * Generates an array of random numbers based on the configuration
 */
export const generateNumbers = (numCount: number, digitCount: number): number[] => {
  // Calculate min and max based on digit count
  const min = digitCount === 1 ? 1 : Math.pow(10, digitCount - 1);
  const max = Math.pow(10, digitCount) - 1;
  
  return Array.from({ length: numCount }, () => 
    generateRandomNumber(min, max)
  );
};

/**
 * Formats time in milliseconds to a user-friendly string
 */
export const formatTime = (milliseconds: number): string => {
  if (milliseconds < 1000) {
    return `${milliseconds}ms`;
  } else {
    const seconds = milliseconds / 1000;
    return `${seconds}s`;
  }
}; 