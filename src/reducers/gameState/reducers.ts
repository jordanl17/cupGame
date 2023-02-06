import { useReducer } from "react";

import { difficultyType, POINTS } from "@constants/difficulty";
import { gameStateType, GAME_PHASE } from "@constants/gamePhases";

type changePhaseActionType = {
  type: "changePhase";
  phase: gameStateType;
};

type guessResultActionType = {
  type: "guessResult";
  guessResult: "WIN" | "LOSE";
  difficulty: difficultyType;
};

export type GameStateActionsType =
  | changePhaseActionType
  | guessResultActionType;

export interface GameStateI {
  isPlaying: boolean;
  isGuessing: boolean;
  revealBall: boolean;
  gamePhase: gameStateType;
  points: number;
}

export const initialGameState: GameStateI = {
  isPlaying: false,
  isGuessing: false,
  revealBall: false,
  gamePhase: GAME_PHASE.IDLE,
  points: 0,
};

const PLAYING_PHASES: gameStateType[] = [
  GAME_PHASE.PLACED_BALL,
  GAME_PHASE.PLACING_BALL,
  GAME_PHASE.SHUFFLING,
  GAME_PHASE.START,
];

const GUESSING_PHASES: gameStateType[] = [GAME_PHASE.SHUFFLED];

const guessResultActionHandler = (
  state: GameStateI,
  action: guessResultActionType
): GameStateI => {
  if (action.guessResult === "WIN") {
    return {
      ...state,
      isPlaying: false,
      isGuessing: false,
      revealBall: true,
      gamePhase: GAME_PHASE.WIN,
      points: state.points + POINTS[action.difficulty],
    };
  }
  if (action.guessResult === "LOSE") {
    return {
      ...state,
      isPlaying: false,
      isGuessing: false,
      revealBall: true,
      gamePhase: GAME_PHASE.LOSE,
      points: Math.max(0, state.points - POINTS[action.difficulty]),
    };
  } else return state;
};

const changePhaseActionHandler = (
  state: GameStateI,
  action: changePhaseActionType
) => {
  return {
    ...state,
    revealBall: action.phase === GAME_PHASE.PLACING_BALL,
    isPlaying: PLAYING_PHASES.includes(action.phase),
    isGuessing: GUESSING_PHASES.includes(action.phase),
    gamePhase: action.phase,
  };
};

function reducer(
  state: GameStateI,
  action: guessResultActionType | changePhaseActionType
): GameStateI {
  switch (action.type) {
    case "changePhase":
      return changePhaseActionHandler(state, action);
    case "guessResult":
      return guessResultActionHandler(state, action);
    default:
      const t: never = action;
      throw Error("no action handler exists");
  }
}

const useGameStateReducer = () => useReducer(reducer, initialGameState);

export default useGameStateReducer;
