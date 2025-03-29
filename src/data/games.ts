import { GameCardProps } from '@/components/gameHub/GameCard';

export const games: GameCardProps[] = [
  {
    id: 'blackWhiteTiles',
    title: 'Black White Tiles',
    description: 'Match the pattern by toggling tiles between black and white.',
    imageUrl: '/black-white-tiles.png',
    link: '/games/black-white-tiles',
  },
  {
    id: 'digitalLabyrinth',
    title: 'Digital Labyrinth',
    description: 'Connect numbers from 1 to 81 by filling in the missing tiles.',
    imageUrl: '/digital-labyrinth.jpg',
    link: '/games/digital-labyrinth',
  },
  {
    id: 'numberPuzzle',
    title: 'Number Puzzle',
    description: 'Solve the sliding number puzzle by rearranging the tiles.',
    imageUrl: '/number-puzzle.jpg',
    link: '/games/number-puzzle',
  },
  {
    id: 'gameOfLife',
    title: 'Conway\'s Game of Life',
    description: 'Predict the next state of cells based on Conway\'s Game of Life rules.',
    imageUrl: '/game-of-life.png',
    link: '/games/game-of-life',
  },
  {
    id: 'memoryMatch',
    title: 'Memory Match',
    description: 'Test your memory by matching pairs of cards.',
    imageUrl: '/placeholder-game.jpg',
    link: '/games/memory-match',
  },
  {
    id: 'wordScramble',
    title: 'Word Scramble',
    description: 'Unscramble the letters to form meaningful words.',
    imageUrl: '/placeholder-game.jpg',
    link: '/games/word-scramble',
  },
  {
    id: 'mathChallenge',
    title: 'Math Challenge',
    description: 'Solve math problems against the clock.',
    imageUrl: '/placeholder-game.jpg',
    link: '/games/math-challenge',
  },
  {
    id: 'patternRecognition',
    title: 'Pattern Recognition',
    description: 'Identify and complete visual patterns.',
    imageUrl: '/placeholder-game.jpg',
    link: '/games/pattern-recognition',
  },
  {
    id: 'reactionTime',
    title: 'Reaction Time',
    description: 'Test your reflexes with this fast-paced reaction game.',
    imageUrl: '/placeholder-game.jpg',
    link: '/games/reaction-time',
  },
]; 