export const DIFFICULTY = {
  EASY: "easy",
  MODERATE: "moderate",
  HARD: "hard",
} as const;

export type difficultyType = typeof DIFFICULTY[keyof typeof DIFFICULTY];

export const NUMBER_OF_MOVES: Record<difficultyType, number> = {
  [DIFFICULTY.EASY]: 5,
  [DIFFICULTY.MODERATE]: 7,
  [DIFFICULTY.HARD]: 10,
};

export const MOVE_SPEED: Record<difficultyType, number> = {
  [DIFFICULTY.EASY]: 1000,
  [DIFFICULTY.MODERATE]: 750,
  [DIFFICULTY.HARD]: 500,
};

export const POINTS: Record<difficultyType, number> = {
  [DIFFICULTY.EASY]: 1,
  [DIFFICULTY.MODERATE]: 2,
  [DIFFICULTY.HARD]: 5,
};
