import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";

export const GAME_STATE = {
  IDLE: "idle",
  PLACING_BALL: "placingBall",
  PLACED_BALL: "placedBall",
  SHUFFLING: "shuffling",
  SHUFFLED: "shuffled",
  GUESSED: "guessed",
} as const;

type gameStateType = typeof GAME_STATE[keyof typeof GAME_STATE];

interface gameStateContextType {
  gameState: gameStateType;
  setGameState: Dispatch<SetStateAction<gameStateType>>;
}

const GameStateContext = createContext<gameStateContextType>({
  gameState: GAME_STATE.IDLE,
  setGameState: () => null,
});

export const useGameState = () => {
  const context = useContext(GameStateContext);

  return context;
};

interface GameStateProviderPropTypes {
  children: React.ReactNode;
}

const GameStateProvider = ({ children }: GameStateProviderPropTypes) => {
  const [gameState, setGameState] = useState<gameStateType>(GAME_STATE.IDLE);

  const value = { gameState, setGameState };
  return (
    <GameStateContext.Provider value={value}>
      {children}
    </GameStateContext.Provider>
  );
};

export default GameStateProvider;
