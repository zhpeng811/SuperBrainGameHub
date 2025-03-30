import { generateRandomString, generateQRStrings, qrCountOptions } from '@/components/games/qrCodeMemory/QRCodeMemoryGame';

describe('QR Code Memory Game Utilities', () => {
  describe('generateRandomString', () => {
    it('generates a string of the specified length', () => {
      const length = 10;
      const result = generateRandomString(length);
      expect(result.length).toBe(length);
    });

    it('generates a string of default length when no length is specified', () => {
      const result = generateRandomString();
      expect(result.length).toBe(8); // Default length is 8
    });

    it('generates different strings on consecutive calls', () => {
      const firstString = generateRandomString(15);
      const secondString = generateRandomString(15);
      expect(firstString).not.toEqual(secondString);
    });

    it('contains only alphanumeric characters', () => {
      const result = generateRandomString(20);
      expect(result).toMatch(/^[A-Za-z0-9]+$/);
    });
  });

  describe('generateQRStrings', () => {
    it('generates the specified number of strings', () => {
      const count = 5;
      const result = generateQRStrings(count);
      expect(result.length).toBe(count);
    });

    it('generates strings of the specified length', () => {
      const length = 12;
      const result = generateQRStrings(3, length);
      result.forEach(str => {
        expect(str.length).toBe(length);
      });
    });

    it('generates unique strings', () => {
      const count = 10;
      const result = generateQRStrings(count);
      const uniqueStrings = new Set(result);
      expect(uniqueStrings.size).toBe(count);
    });
  });

  describe('qrCountOptions', () => {
    it('contains the expected difficulty options', () => {
      expect(qrCountOptions).toEqual([10, 20, 30, 40, 50]);
    });
  });
}); 