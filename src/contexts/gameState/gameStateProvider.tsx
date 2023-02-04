import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useReducer,
  useState,
} from "react";
import { difficultyType, POINTS } from "../../constants/difficulty";

export const GAME_STATE = {
  START: "start",
  IDLE: "idle",
  PLACING_BALL: "placingBall",
  PLACED_BALL: "placedBall",
  SHUFFLING: "shuffling",
  SHUFFLED: "shuffled",
  GUESSED: "guessed",
  WIN: "win",
  LOSE: "lose",
} as const;

type gameStateType = typeof GAME_STATE[keyof typeof GAME_STATE];

const initialState: GameStateI = {
  isPlaying: false,
  isGuessing: false,
  revealBall: false,
  gamePhase: GAME_STATE.IDLE,
  points: 0,
};

const GameStateContext = createContext<{
  gameState: GameStateI;
  dispatch: Dispatch<changePhaseActionType | guessResultActionType>;
}>({
  gameState: initialState,
  dispatch: () => null,
});

export const useGameState = () => {
  const context = useContext(GameStateContext);

  return context;
};

interface GameStateProviderPropTypes {
  children: React.ReactNode;
}

interface GameStateI {
  isPlaying: boolean;
  isGuessing: boolean;
  revealBall: boolean;
  gamePhase: gameStateType;
  points: number;
}

const PLAYING_STATES: gameStateType[] = [
  GAME_STATE.PLACED_BALL,
  GAME_STATE.PLACING_BALL,
  GAME_STATE.SHUFFLING,
  GAME_STATE.START,
];

const GUESSING_STATES: gameStateType[] = [GAME_STATE.SHUFFLED];

const changePhaseAction = (
  state: GameStateI,
  action: changePhaseActionType
) => {
  return {
    ...state,
    revealBall: action.phase === GAME_STATE.PLACING_BALL,
    isPlaying: PLAYING_STATES.includes(action.phase),
    isGuessing: GUESSING_STATES.includes(action.phase),
    gamePhase: action.phase,
  };
};

type changePhaseActionType = {
  type: "changePhase";
  phase: gameStateType;
};

type guessResultActionType = {
  type: "guessResult";
  guessResult: "WIN" | "LOSE";
  difficulty: difficultyType;
};

const guessResultAction = (
  state: GameStateI,
  action: guessResultActionType
): GameStateI => {
  if (action.guessResult === "WIN") {
    return {
      ...state,
      isPlaying: false,
      isGuessing: false,
      revealBall: true,
      gamePhase: GAME_STATE.WIN,
      points: state.points + POINTS[action.difficulty],
    };
  }
  if (action.guessResult === "LOSE") {
    return {
      ...state,
      isPlaying: false,
      isGuessing: false,
      revealBall: true,
      gamePhase: GAME_STATE.LOSE,
      points: Math.max(0, state.points - POINTS[action.difficulty]),
    };
  } else return state;
};

function reducer(
  state: GameStateI,
  action: guessResultActionType | changePhaseActionType
): GameStateI {
  switch (action.type) {
    case "changePhase":
      return changePhaseAction(state, action);
    case "guessResult":
      return guessResultAction(state, action);
    default:
      const t: never = action;
      throw Error("no action handler exists for", action);
  }
}

const GameStateProvider = ({ children }: GameStateProviderPropTypes) => {
  const [gameState, dispatch] = useReducer(reducer, initialState);

  const value = { gameState, dispatch };
  return (
    <GameStateContext.Provider value={value}>
      {children}
    </GameStateContext.Provider>
  );
};

export default GameStateProvider;
