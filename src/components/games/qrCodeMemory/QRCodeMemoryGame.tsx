'use client';

import { useState, useEffect, useCallback } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useTranslations } from 'next-intl';

// Function to generate random strings for QR codes
export const generateRandomString = (length: number = 8) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

// Generate an array of unique random strings
export const generateQRStrings = (count: number, length: number = 8) => {
  const strings: string[] = [];
  while (strings.length < count) {
    const newString = generateRandomString(length);
    if (!strings.includes(newString)) {
      strings.push(newString);
    }
  }
  return strings;
};

// Available QR code count options
export const qrCountOptions = [10, 20, 30, 40, 50];

export default function QRCodeMemoryGame() {
  const t = useTranslations('qrCodeMemory');
  
  // Game states
  const [gameState, setGameState] = useState<'memorize' | 'select' | 'result'>('memorize');
  const [targetQRCode, setTargetQRCode] = useState<string>('');
  const [qrOptions, setQROptions] = useState<string[]>([]);
  const [selectedQRCode, setSelectedQRCode] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [qrCount, setQrCount] = useState<number>(10); // Default to 10 QR codes
  const [hoveredQRCode, setHoveredQRCode] = useState<number | null>(null);

  // Initialize the game
  const initializeGame = useCallback(() => {
    // Generate the target QR code string
    const target = generateRandomString(10);
    setTargetQRCode(target);
    
    // Reset other states
    setGameState('memorize');
    setSelectedQRCode(null);
    setIsCorrect(null);
    setHoveredQRCode(null);
  }, []);

  // Generate options when moving to selection phase
  const startSelectionPhase = useCallback(() => {
    // Generate n-1 random QR code strings
    const otherOptions = generateQRStrings(qrCount - 1, 10);
    
    // Insert the target QR code at a random position
    const randomIndex = Math.floor(Math.random() * qrCount);
    const allOptions = [...otherOptions];
    allOptions.splice(randomIndex, 0, targetQRCode);
    
    setQROptions(allOptions);
    setGameState('select');
  }, [targetQRCode, qrCount]);

  // Handle QR code selection
  const handleSelection = (selected: string) => {
    setSelectedQRCode(selected);
    const correct = selected === targetQRCode;
    setIsCorrect(correct);
    setGameState('result');
  };

  // Reset the game
  const resetGame = () => {
    initializeGame();
  };

  // Initialize on first render
  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  // Determine the grid columns based on the number of QR codes
  const getGridColumns = () => {
    if (qrCount <= 10) return 'grid-cols-2 md:grid-cols-5';
    if (qrCount <= 20) return 'grid-cols-2 md:grid-cols-5 lg:grid-cols-6';
    if (qrCount <= 30) return 'grid-cols-2 md:grid-cols-6 lg:grid-cols-7';
    return 'grid-cols-2 md:grid-cols-6 lg:grid-cols-8';
  };

  // Determine the QR code size based on the number of QR codes
  const getQRCodeSize = () => {
    if (qrCount <= 10) return 80;
    if (qrCount <= 20) return 70;
    if (qrCount <= 30) return 60;
    if (qrCount <= 40) return 55;
    return 50;
  };

  // Get enlarged QR code size for hover effect
  const getEnlargedQRCodeSize = () => {
    return getQRCodeSize() * 2.5; // A bit smaller than 3x but still large enough
  };

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
          {t('title', { defaultValue: 'QR Code Memory' })}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {t('description', { defaultValue: 'Memorize a QR code and identify it among others' })}
        </p>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-md dark:border-gray-700 dark:bg-gray-800">
        {gameState === 'memorize' && (
          <div className="flex flex-col items-center space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {t('memorizePhase', { defaultValue: 'Memorize this QR code' })}
            </h2>
            <div className="p-4 bg-white rounded-lg">
              <QRCodeSVG value={targetQRCode} size={200} />
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              {t('memorizeInstructions', { defaultValue: 'Take your time to memorize the details and pattern of this QR code.' })}
            </p>
            
            <div className="w-full max-w-md">
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                {t('difficultyLevel', { defaultValue: 'Difficulty Level (Number of QR codes)' })}
              </label>
              <div className="flex flex-wrap gap-2 justify-center">
                {qrCountOptions.map((count) => (
                  <button
                    key={count}
                    onClick={() => setQrCount(count)}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                      qrCount === count
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                    }`}
                    data-testid={`difficulty-button-${count}`}
                  >
                    {count}
                  </button>
                ))}
              </div>
            </div>
            
            <button
              onClick={startSelectionPhase}
              className="rounded-md bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              data-testid="done-memorizing-button"
            >
              {t('doneMemorizing', { defaultValue: 'Done Memorizing' })}
            </button>
          </div>
        )}

        {gameState === 'select' && (
          <div className="space-y-6">
            <div className="flex flex-col items-center space-y-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {t('selectPhase', { defaultValue: 'Select the QR code you just memorized' })}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t('selectFromOptions', { defaultValue: 'Select from {count} options', count: qrCount })}
              </p>
              <p className="text-xs text-gray-500 italic">
                {t('hoverToEnlarge', { defaultValue: 'Hover over any QR code to enlarge it' })}
              </p>
            </div>

            <div className={`grid ${getGridColumns()} gap-3 relative`} data-testid="qr-code-grid">
              {qrOptions.map((qrValue, index) => (
                <button
                  key={index}
                  onClick={() => handleSelection(qrValue)}
                  onMouseEnter={() => setHoveredQRCode(index)}
                  onMouseLeave={() => setHoveredQRCode(null)}
                  className="flex flex-col items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative"
                  data-testid={`qr-option-${index}`}
                >
                  <div className="bg-white p-2 rounded">
                    <QRCodeSVG value={qrValue} size={getQRCodeSize()} />
                  </div>
                  <span className="mt-1 text-xs text-gray-500">#{index + 1}</span>
                  
                  {hoveredQRCode === index && (
                    <div 
                      className="absolute z-20 top-full left-1/2 transform -translate-x-1/2 mt-3 bg-white p-3 rounded-lg shadow-xl border border-gray-200" 
                      data-testid="enlarged-qr-code"
                    >
                      <QRCodeSVG value={qrValue} size={getEnlargedQRCodeSize()} />
                      <div className="mt-2 text-center text-sm text-gray-500">#{index + 1}</div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {gameState === 'result' && (
          <div className="flex flex-col items-center space-y-6" data-testid="result-screen">
            <h2 className={`text-xl font-semibold ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
              {isCorrect 
                ? t('correctSelection', { defaultValue: 'Correct! Great job!' })
                : t('incorrectSelection', { defaultValue: 'Incorrect! Try again.' })}
            </h2>
            
            <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-8">
              <div className="flex flex-col items-center">
                <p className="mb-2 text-gray-600 dark:text-gray-400">
                  {t('originalQRCode', { defaultValue: 'Original QR Code' })}
                </p>
                <div className="p-4 bg-white rounded-lg">
                  <QRCodeSVG value={targetQRCode} size={150} />
                </div>
              </div>
              
              {!isCorrect && selectedQRCode && (
                <div className="flex flex-col items-center">
                  <p className="mb-2 text-gray-600 dark:text-gray-400">
                    {t('yourSelection', { defaultValue: 'Your Selection' })}
                  </p>
                  <div className="p-4 bg-white rounded-lg">
                    <QRCodeSVG value={selectedQRCode} size={150} />
                  </div>
                </div>
              )}
            </div>
            
            <div className="text-center">
              <p className="mb-2 text-gray-600 dark:text-gray-400">
                {t('difficultyWas', { defaultValue: 'Difficulty: {count} QR codes', count: qrCount })}
              </p>
              <button
                onClick={resetGame}
                className="rounded-md bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                data-testid="play-again-button"
              >
                {t('playAgain', { defaultValue: 'Play Again' })}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 