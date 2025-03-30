import {
  generateRandomNumber,
  calculateSum,
  generateNumbers,
  formatTime
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
}); 