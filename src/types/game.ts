export type GameMode = 'lobby' | 'scramble' | 'wheel' | 'story';

export type TeamId = 'teamA' | 'teamB';

export interface Team {
  id: TeamId;
  name: string;
  score: number;
  color: string;
  avatar: string;
}

export interface MysteryRound {
  id: string;
  title: string;
  category: string;
  imagePath: string;
  fallbackGradient: string;
  clues: string[];
  answer: string;
  points: number;
}

export interface ScrambleWord {
  id: string;
  word: string;
  category: string;
  definitionClue: string;
  sentenceClue: string;
  points: number;
}

export interface WheelChallenge {
  id: string;
  title: string;
  type: 'spell' | 'twister' | 'charade' | 'opposite' | 'rhyme' | 'blitz' | 'describe' | 'bonus';
  instruction: string;
  target: string;
  timeLimit: number;
  points: number;
  color: string;
}

export interface StoryPrompt {
  id: string;
  scenario: string;
  imagePath: string;
  character: string;
  item: string;
  location: string;
  twist: string;
}
