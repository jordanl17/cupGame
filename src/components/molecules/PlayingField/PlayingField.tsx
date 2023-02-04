import { useEffect, useState } from "react";
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

type Props = {
  difficulty: difficultyType;
};

const PlayingField = ({ difficulty }: Props) => {
  const [cupPositions, setCupPositions] = useState<(0 | 1 | 2)[]>([0, 1, 2]);
  const [ballPosition, setBallPosition] = useState<number | null>(null);

  // TODO: make this better for 4,5,6 number of cups
  const generatePositions = (
    currentCupPositions: (0 | 2 | 1)[]
  ): (0 | 1 | 2)[] => {
    const firstCup = Math.floor(Math.random() * 3);
    const remainingPositions = [0, 1, 2].filter((el) => el !== firstCup);
    const [secondCup, thirdCup] = Math.round(Math.random())
      ? remainingPositions.reverse()
      : remainingPositions;

    const newPositions = [firstCup, secondCup, thirdCup] as (0 | 1 | 2)[];

    const isNewPositionsVoidMove = currentCupPositions.every(
      (currentPosition, index) => newPositions[index] === currentPosition
    );

    if (isNewPositionsVoidMove) return generatePositions(currentCupPositions);
    return newPositions;
  };

  const makeAShuffle = (onComplete: (() => void) | null) => () => {
    setCupPositions((currentCupPositions) =>
      generatePositions(currentCupPositions)
    );

    if (onComplete) onComplete();
  };

  const makeAllShuffles = () =>
    new Promise<void>((res) => {
      setGameState(GAME_STATE.SHUFFLING);
      for (
        let shuffleNumber = 0;
        shuffleNumber < NUMBER_OF_MOVES[difficulty];
        shuffleNumber++
      ) {
        const onComplete =
          shuffleNumber === NUMBER_OF_MOVES[difficulty] - 1
            ? () => setTimeout(res, 1000)
            : null;
        setTimeout(
          makeAShuffle(onComplete),
          MOVE_SPEED[difficulty] * shuffleNumber
        );
      }
    });

  const placeBall = () =>
    new Promise<void>((res) => {
      setGameState(GAME_STATE.PLACING_BALL);
      const ballCupPosition = Math.floor(Math.random() * 3);
      setBallPosition(ballCupPosition);
      setTimeout(() => {
        setGameState(GAME_STATE.PLACED_BALL);
        res();
      }, 1000);
    });

  const { gameState, setGameState } = useGameState();

  const delay = (timeout: number) =>
    new Promise((res) => setTimeout(res, timeout));

  const startGame = async () => {
    setGameState(GAME_STATE.IDLE);
    await placeBall();
    await delay(500);
    await makeAllShuffles();
    setGameState(GAME_STATE.SHUFFLED);
  };

  useEffect(() => {
    if (gameState === GAME_STATE.START) startGame();
  }, [gameState]);

  const handleOnGuess = (initialPositionGuess: number) => () => {
    setGameState(
      initialPositionGuess === ballPosition ? GAME_STATE.WIN : GAME_STATE.LOSE
    );
  };

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
      <div>{gameState}</div>
      <div style={{ position: "relative", height: "250px", width: "100%" }}>
        {cupPositions.map((position, initialPosition) => (
          <Cup
            onGuess={handleOnGuess(initialPosition)}
            key={initialPosition}
            position={position}
            startPosition={initialPosition as 0 | 1 | 2}
            hasBall={ballPosition === initialPosition}
          />
        ))}
      </div>
    </div>
  );
};

export default PlayingField;
