'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';

export default function RapidCalculationGame() {
  const t = useTranslations('rapidCalculation');
  const [gameState, setGameState] = useState<'ready' | 'playing' | 'result'>('ready');
  const [currentNumber, setCurrentNumber] = useState<number | null>(null);
  const [numbers, setNumbers] = useState<number[]>([]);
  const [userAnswer, setUserAnswer] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState(0);
  const [result, setResult] = useState<'correct' | 'incorrect' | null>(null);
  // Game configuration options
  const [numCount, setNumCount] = useState<number>(5);
  const [timeInterval, setTimeInterval] = useState<number>(1000);
  const [digitCount, setDigitCount] = useState<number>(2);
  // Refs
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const numbersRef = useRef<number[]>([]);
  const currentIndexRef = useRef<number>(0);

  // Generate random numbers based on configuration
  const generateNumbers = () => {
    // Calculate min and max based on digit count
    const min = digitCount === 1 ? 1 : Math.pow(10, digitCount - 1);
    const max = Math.pow(10, digitCount) - 1;
    
    const newNumbers = Array.from({ length: numCount }, () => 
      Math.floor(Math.random() * (max - min + 1)) + min
    );
    setNumbers(newNumbers);
    numbersRef.current = newNumbers;
    setCorrectAnswer(newNumbers.reduce((sum, num) => sum + num, 0));
    return newNumbers;
  };

  // Start the game
  const startGame = () => {
    const newNumbers = generateNumbers();
    setGameState('playing');
    currentIndexRef.current = 0;
    setCurrentNumber(newNumbers[0]);
    
    // Schedule the number display sequence
    timerRef.current = setTimeout(showNextNumber, timeInterval);
  };

  // Show the next number in sequence
  const showNextNumber = () => {
    const nextIndex = currentIndexRef.current + 1;
    
    if (nextIndex < numbersRef.current.length) {
      currentIndexRef.current = nextIndex;
      setCurrentNumber(numbersRef.current[nextIndex]);
      
      // Schedule next number using the configured time interval
      timerRef.current = setTimeout(showNextNumber, timeInterval);
    } else {
      // All numbers displayed, wait for user input
      setCurrentNumber(null);
      setGameState('result');
    }
  };

  // Handle user submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const userGuess = parseInt(userAnswer);
    
    if (userGuess === correctAnswer) {
      setResult('correct');
    } else {
      setResult('incorrect');
    }
  };

  // Reset the game
  const resetGame = () => {
    setGameState('ready');
    setCurrentNumber(null);
    setNumbers([]);
    numbersRef.current = [];
    currentIndexRef.current = 0;
    setUserAnswer('');
    setResult(null);
    
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  };

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  // Helper function to create select controls
  const OptionSelector = ({ 
    label, 
    value, 
    onChange, 
    options 
  }: { 
    label: string; 
    value: number; 
    onChange: (val: number) => void; 
    options: { value: number; label: string }[] 
  }) => (
    <div className="flex flex-col mb-4">
      <label className="mb-2 font-medium text-gray-700 dark:text-gray-300">{label}</label>
      <select 
        value={value} 
        onChange={(e) => onChange(Number(e.target.value))}
        className="px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="flex flex-col items-center">
      {gameState === 'ready' && (
        <div className="text-center">
          <p className="mb-6">{t('instructions')}</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            <OptionSelector
              label={t('numberCount')}
              value={numCount}
              onChange={setNumCount}
              options={[
                { value: 3, label: '3' },
                { value: 5, label: '5' },
                { value: 10, label: '10' },
                { value: 15, label: '15' },
                { value: 20, label: '20' }
              ]}
            />
            
            <OptionSelector
              label={t('timeInterval')}
              value={timeInterval}
              onChange={setTimeInterval}
              options={[
                { value: 500, label: t('timeOptions.half') },
                { value: 1000, label: t('timeOptions.one') },
                { value: 1500, label: t('timeOptions.oneHalf') },
                { value: 2000, label: t('timeOptions.two') }
              ]}
            />
            
            <OptionSelector
              label={t('digitCount')}
              value={digitCount}
              onChange={setDigitCount}
              options={[
                { value: 1, label: t('digitOptions.one') },
                { value: 2, label: t('digitOptions.two') },
                { value: 3, label: t('digitOptions.three') },
                { value: 4, label: t('digitOptions.four') }
              ]}
            />
          </div>
          
          <button
            onClick={startGame}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg"
          >
            {t('startGame')}
          </button>
        </div>
      )}
      
      {gameState === 'playing' && (
        <div className="flex flex-col items-center">
          <div className="text-7xl font-bold mb-8 h-32 flex items-center justify-center">
            {currentNumber}
          </div>
          <p>{t('memorize')}</p>
        </div>
      )}
      
      {gameState === 'result' && (
        <div className="flex flex-col items-center">
          <p className="mb-4 text-xl">{t('enterSum')}</p>
          
          <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4">
            <input
              type="number"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              className="px-4 py-2 border rounded-lg text-xl w-32 text-center"
              autoFocus
            />
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-lg"
            >
              {t('submit')}
            </button>
          </form>
          
          {result && (
            <div className="mt-8 text-center">
              <p className={`text-2xl font-bold ${result === 'correct' ? 'text-green-600' : 'text-red-600'}`}>
                {t(result)}
              </p>
              <p className="mt-2">
                {t('correctAnswer')} {correctAnswer}
              </p>
              <p className="mt-2">
                {t('yourNumbers')} {numbers.join(' + ')}
              </p>
              <button
                onClick={resetGame}
                className="mt-6 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg"
              >
                {t('playAgain')}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 