import { DIFFICULTY, difficultyType } from "../../../../constants/difficulty";
import { moveThemAll, twoAtATime } from "./shuffleStrategies";

const DIFFICULTY_SHUFFLE_STRATEGIES: Record<
  difficultyType,
  (currentPositions: number[]) => number[]
> = {
  [DIFFICULTY.EASY]: twoAtATime,
  [DIFFICULTY.MODERATE]: moveThemAll,
  [DIFFICULTY.HARD]: moveThemAll,
} as const;

const applyShuffleStrategy = (
  difficulty: difficultyType,
  currentCupPositions: number[]
) => DIFFICULTY_SHUFFLE_STRATEGIES[difficulty](currentCupPositions);

export default applyShuffleStrategy;
