import {
  generateRandomNumber,
  calculateSum,
  generateNumbers,
  formatTime,
  calculateResult,
  generateNumbersWithOperators,
  NumberWithOperator
} from '../../../../components/games/rapidCalculation/utils';

describe('Rapid Calculation - Utilities', () => {
  describe('generateRandomNumber', () => {
    it('generates a number within the specified range', () => {
      // Test with a range of 1-10
      const min = 1;
      const max = 10;
      
      // Generate 100 random numbers and check they're all within range
      for (let i = 0; i < 100; i++) {
        const randomNumber = generateRandomNumber(min, max);
        expect(randomNumber).toBeGreaterThanOrEqual(min);
        expect(randomNumber).toBeLessThanOrEqual(max);
      }
    });
    
    it('generates a number with the correct number of digits', () => {
      // Test for 1-digit numbers
      for (let i = 0; i < 20; i++) {
        const oneDigitNumber = generateRandomNumber(1, 9);
        expect(oneDigitNumber.toString().length).toBe(1);
      }
      
      // Test for 2-digit numbers
      for (let i = 0; i < 20; i++) {
        const twoDigitNumber = generateRandomNumber(10, 99);
        expect(twoDigitNumber.toString().length).toBe(2);
      }
      
      // Test for 3-digit numbers
      for (let i = 0; i < 20; i++) {
        const threeDigitNumber = generateRandomNumber(100, 999);
        expect(threeDigitNumber.toString().length).toBe(3);
      }
    });
  });
  
  describe('calculateSum', () => {
    it('correctly sums an array of numbers', () => {
      // Test with a few simple cases
      expect(calculateSum([1, 2, 3])).toBe(6);
      expect(calculateSum([10, 20, 30, 40])).toBe(100);
      expect(calculateSum([-5, 5])).toBe(0);
      expect(calculateSum([99, 1])).toBe(100);
    });
    
    it('returns 0 for an empty array', () => {
      expect(calculateSum([])).toBe(0);
    });
    
    it('handles a single number correctly', () => {
      expect(calculateSum([42])).toBe(42);
    });
    
    it('handles large numbers correctly', () => {
      expect(calculateSum([999, 9999, 99999])).toBe(110997);
    });
  });
  
  describe('generateNumbers', () => {
    it('generates the correct number of items', () => {
      expect(generateNumbers(5, 2).length).toBe(5);
      expect(generateNumbers(10, 1).length).toBe(10);
    });
    
    it('generates numbers with the correct number of digits', () => {
      // Test 1-digit numbers
      const oneDigitNumbers = generateNumbers(20, 1);
      oneDigitNumbers.forEach(num => {
        expect(num.toString().length).toBe(1);
      });
      
      // Test 2-digit numbers
      const twoDigitNumbers = generateNumbers(20, 2);
      twoDigitNumbers.forEach(num => {
        expect(num.toString().length).toBe(2);
      });
    });
  });
  
  describe('formatTime', () => {
    it('formats milliseconds correctly', () => {
      expect(formatTime(500)).toBe('500ms');
      expect(formatTime(999)).toBe('999ms');
    });
    
    it('formats seconds correctly', () => {
      expect(formatTime(1000)).toBe('1s');
      expect(formatTime(1500)).toBe('1.5s');
      expect(formatTime(2000)).toBe('2s');
    });
  });
  
  describe('calculateResult', () => {
    it('correctly applies operations to numbers with operators', () => {
      // Test with a few simple cases
      const testCase1: NumberWithOperator[] = [
        { value: 10, operator: '+' },
        { value: 5, operator: '+' },
        { value: 3, operator: '-' }
      ];
      expect(calculateResult(testCase1)).toBe(12); // 10 + 5 - 3 = 12
      
      const testCase2: NumberWithOperator[] = [
        { value: 20, operator: '+' },
        { value: 10, operator: '-' },
        { value: 5, operator: '-' }
      ];
      expect(calculateResult(testCase2)).toBe(5); // 20 - 10 - 5 = 5
      
      const testCase3: NumberWithOperator[] = [
        { value: 100, operator: '+' },
        { value: 50, operator: '+' },
        { value: 25, operator: '+' }
      ];
      expect(calculateResult(testCase3)).toBe(175); // 100 + 50 + 25 = 175
    });
    
    it('returns the first number when array has only one item', () => {
      expect(calculateResult([{ value: 42, operator: '+' }])).toBe(42);
    });
    
    it('returns 0 for an empty array', () => {
      expect(calculateResult([])).toBe(0);
    });
  });
  
  describe('generateNumbersWithOperators', () => {
    it('generates the correct number of items', () => {
      expect(generateNumbersWithOperators(5, 2, ['+', '-']).length).toBe(5);
      expect(generateNumbersWithOperators(10, 1, ['+']).length).toBe(10);
    });
    
    it('generates numbers with the correct number of digits', () => {
      // Test 1-digit numbers
      const oneDigitNumbersWithOps = generateNumbersWithOperators(20, 1, ['+']);
      oneDigitNumbersWithOps.forEach(num => {
        expect(num.value.toString().length).toBe(1);
      });
      
      // Test 2-digit numbers
      const twoDigitNumbersWithOps = generateNumbersWithOperators(20, 2, ['+']);
      twoDigitNumbersWithOps.forEach(num => {
        expect(num.value.toString().length).toBe(2);
      });
    });
    
    it('uses only the operators provided in the options', () => {
      // Test addition only
      const additionOnly = generateNumbersWithOperators(20, 1, ['+']);
      additionOnly.forEach(num => {
        expect(num.operator).toBe('+');
      });
      
      // Test subtraction only
      const subtractionOnly = generateNumbersWithOperators(20, 1, ['-']);
      // First number always has + operator, subsequent numbers should have - operator
      expect(subtractionOnly[0].operator).toBe('+');
      subtractionOnly.slice(1).forEach(num => {
        expect(num.operator).toBe('-');
      });
      
      // Test mixed operators
      const mixedOperators = generateNumbersWithOperators(100, 1, ['+', '-']);
      // First element always has + operator
      expect(mixedOperators[0].operator).toBe('+');
      
      // Check the remaining elements to see if both operators are used
      const remainingOps = mixedOperators.slice(1);
      const hasAddition = remainingOps.some(num => num.operator === '+');
      const hasSubtraction = remainingOps.some(num => num.operator === '-');
      
      // With 99 remaining numbers, there should be a mix of both operators
      expect(hasAddition).toBe(true);
      expect(hasSubtraction).toBe(true);
    });
    
    it('always assigns + operator to the first number', () => {
      const numbersWithOps = generateNumbersWithOperators(5, 2, ['-']);
      expect(numbersWithOps[0].operator).toBe('+');
    });
  });
}); 