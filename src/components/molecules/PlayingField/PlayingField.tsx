import { useEffect, useState } from "react";
import {
  PAUSE_BETWEEN_GAME_PHASES,
  REVEAL_BALL_TRANSITION_MS,
} from "../../../constants/animationDurations";
import {
  difficultyType,
  MOVE_SPEED,
  NUMBER_OF_MOVES,
} from "../../../constants/difficulty";
import {
  GAME_STATE,
  useGameState,
} from "../../../contexts/gameState/gameStateProvider";

import Cup from "../../atoms/Cup";
import randomiseCupPositions, {
  cupPositionsType,
  INITIAL_CUP_POSITIONS,
} from "./cupPositionUtil";

type Props = {
  difficulty: difficultyType;
};

const PlayingField = ({ difficulty }: Props) => {
  const [cupPositions, setCupPositions] = useState<cupPositionsType>(
    INITIAL_CUP_POSITIONS
  );
  const [ballPosition, setBallPosition] = useState<number | null>(null);
  const { gameState, dispatch } = useGameState();

  const makeAShuffle = (onComplete: (() => void) | null) => () => {
    setCupPositions((currentCupPositions) =>
      randomiseCupPositions(currentCupPositions)
    );

    if (onComplete) onComplete();
  };

  const makeAllShuffles = () =>
    new Promise<void>((res) => {
      dispatch({ type: "changePhase", phase: GAME_STATE.SHUFFLING });

      for (
        let shuffleNumber = 0;
        shuffleNumber < NUMBER_OF_MOVES[difficulty];
        shuffleNumber++
      ) {
        // pass through complete cb when shuffle is the last
        const onComplete =
          shuffleNumber === NUMBER_OF_MOVES[difficulty] - 1
            ? () => setTimeout(res, MOVE_SPEED[difficulty])
            : null;

        setTimeout(
          makeAShuffle(onComplete),
          MOVE_SPEED[difficulty] * shuffleNumber
        );
      }
    });

  const placeBall = () =>
    new Promise<void>((res) => {
      dispatch({ type: "changePhase", phase: GAME_STATE.PLACING_BALL });
      const ballCupPosition = Math.floor(Math.random() * 3);
      setBallPosition(ballCupPosition);
      setTimeout(() => {
        dispatch({ type: "changePhase", phase: GAME_STATE.PLACED_BALL });
        res();
      }, REVEAL_BALL_TRANSITION_MS * 2);
    });

  const delay = (timeout: number) =>
    new Promise((res) => setTimeout(res, timeout));

  const startGame = async () => {
    if (gameState.gamePhase !== GAME_STATE.IDLE) {
      // reset game is this isn't the first time
      dispatch({ type: "changePhase", phase: GAME_STATE.IDLE });
      // brief pause to reset all cup tilts
      await delay(PAUSE_BETWEEN_GAME_PHASES);
    }

    await placeBall();
    await delay(PAUSE_BETWEEN_GAME_PHASES);
    await makeAllShuffles();
    dispatch({ type: "changePhase", phase: GAME_STATE.SHUFFLED });
  };

  useEffect(() => {
    if (gameState.gamePhase === GAME_STATE.START) startGame();
  }, [gameState]);

  const handleOnGuess = (initialPositionGuess: number) =>
    dispatch({
      type: "guessResult",
      difficulty,
      guessResult: initialPositionGuess === ballPosition ? "WIN" : "LOSE",
    });

  return (
    <div
      style={{
        margin: "calc(100vw/12)",
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        gap: 20,
      }}
    >
      <div style={{ position: "relative", height: "250px", width: "100%" }}>
        {cupPositions.map((position, initialPosition) => (
          <Cup
            onGuess={handleOnGuess}
            key={initialPosition}
            position={position}
            numberOfCups={cupPositions.length}
            startPosition={initialPosition as 0 | 1 | 2}
            hasBall={ballPosition === initialPosition}
            moveSpeed={MOVE_SPEED[difficulty]}
          />
        ))}
      </div>
    </div>
  );
};

export default PlayingField;
