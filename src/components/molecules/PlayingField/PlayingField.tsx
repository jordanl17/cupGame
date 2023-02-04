import { useEffect, useState } from "react";

import Cup from "../../atoms/Cup";

type Props = {};

const DIFFICULTY = {
  EASY: "easy",
  MODERATE: "moderate",
  HARD: "hard",
} as const;

const NUMBER_OF_MOVES: Record<
  typeof DIFFICULTY[keyof typeof DIFFICULTY],
  number
> = {
  [DIFFICULTY.EASY]: 5,
  [DIFFICULTY.MODERATE]: 7,
  [DIFFICULTY.HARD]: 10,
};

const MOVE_SPEED: Record<typeof DIFFICULTY[keyof typeof DIFFICULTY], number> = {
  [DIFFICULTY.EASY]: 1000,
  [DIFFICULTY.MODERATE]: 750,
  [DIFFICULTY.HARD]: 500,
};

const PlayingField = (props: Props) => {
  const [difficulty, setDifficulty] = useState<
    typeof DIFFICULTY[keyof typeof DIFFICULTY]
  >(DIFFICULTY.EASY);
  const [isShuffling, setIsShuffling] = useState(false);
  const [isPlacingBall, setIsPlacingBall] = useState(false);
  const [cupPositions, setCupPositions] = useState<(0 | 1 | 2)[]>([0, 1, 2]);
  const [ballPosition, setBallPosition] = useState<number | null>(null);
  const [gameStatus, setGameStatus] = useState<"WIN" | "LOSE" | undefined>();

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
    console.log("shuffle");
    setCupPositions((currentCupPositions) =>
      generatePositions(currentCupPositions)
    );
    if (onComplete) onComplete();
  };

  const makeAllShuffles = () =>
    new Promise<void>((res) => {
      for (
        let shuffleNumber = 0;
        shuffleNumber < NUMBER_OF_MOVES[difficulty];
        shuffleNumber++
      ) {
        console.log(
          shuffleNumber,
          shuffleNumber === NUMBER_OF_MOVES[difficulty] - 1
        );
        const onComplete =
          shuffleNumber === NUMBER_OF_MOVES[difficulty] - 1 ? res : null;
        setTimeout(
          makeAShuffle(onComplete),
          MOVE_SPEED[difficulty] * shuffleNumber
        );
      }
    });

  const placeBall = () =>
    new Promise<void>((res) => {
      setIsPlacingBall(true);
      const ballCupPosition = Math.floor(Math.random() * 3);
      setBallPosition(ballCupPosition);
      setTimeout(() => {
        setIsPlacingBall(false);
        res();
      }, 1000);
    });

  const delay = (timeout: number) =>
    new Promise((res) => setTimeout(res, timeout));

  const handleStartGame = async () => {
    setGameStatus(undefined);
    await placeBall();
    await delay(500);
    setIsShuffling(true);
    await makeAllShuffles();
    setIsShuffling(false);
  };

  useEffect(() => {
    if (!isShuffling) {
      console.log(
        "ball was initially under cup",
        ballPosition,
        "and now that cup is",
        cupPositions[ballPosition!]
      );
      console.log(cupPositions);
    }
  }, [isShuffling, ballPosition, cupPositions]);

  const handleOnGuess = (initialPositionGuess: number) => () => {
    setGameStatus(initialPositionGuess === ballPosition ? "WIN" : "LOSE");
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
      <div style={{ position: "relative", height: "250px", width: "100%" }}>
        {cupPositions.map((position, initialPosition) => (
          <Cup
            onGuess={handleOnGuess(initialPosition)}
            isShuffling={isShuffling}
            key={initialPosition}
            position={position}
            startPosition={initialPosition as 0 | 1 | 2}
            isPlacingBall={isPlacingBall}
            hasBall={ballPosition === initialPosition}
            hasGuessed={!!gameStatus}
          />
        ))}
      </div>
      <div>
        <button disabled={isShuffling} onClick={handleStartGame}>
          Start game
        </button>
        <div>{gameStatus}</div>
      </div>
    </div>
  );
};

export default PlayingField;
