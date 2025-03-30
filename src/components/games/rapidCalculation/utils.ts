/**
 * Generates a random number between min and max (inclusive)
 */
export const generateRandomNumber = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export type Operator = '+' | '-';

export interface NumberWithOperator {
  value: number;
  operator: Operator;
}

/**
 * Calculates the result of applying operations to numbers
 */
export const calculateResult = (numbersWithOperators: NumberWithOperator[]): number => {
  if (numbersWithOperators.length === 0) return 0;
  
  // First number is always positive
  let result = numbersWithOperators[0].value;
  
  // Apply operations for the rest of the numbers
  for (let i = 1; i < numbersWithOperators.length; i++) {
    const { value, operator } = numbersWithOperators[i];
    
    if (operator === '+') {
      result += value;
    } else if (operator === '-') {
      result -= value;
    }
  }
  
  return result;
};

/**
 * Calculates the sum of an array of numbers (for backward compatibility)
 */
export const calculateSum = (numbers: number[]): number => {
  return numbers.reduce((sum, num) => sum + num, 0);
};

/**
 * Generates an array of random numbers with operators based on the configuration
 */
export const generateNumbersWithOperators = (
  numCount: number, 
  digitCount: number, 
  operatorOptions: Operator[]
): NumberWithOperator[] => {
  // Calculate min and max based on digit count
  const min = digitCount === 1 ? 1 : Math.pow(10, digitCount - 1);
  const max = Math.pow(10, digitCount) - 1;
  
  return Array.from({ length: numCount }, (_, index) => {
    // First number always has + operator (doesn't matter since it's the first)
    const operator = index === 0 
      ? '+' 
      : operatorOptions[Math.floor(Math.random() * operatorOptions.length)];
      
    return {
      value: generateRandomNumber(min, max),
      operator
    };
  });
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