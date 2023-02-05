import { useGameState } from "../../../contexts/gameState/gameStateProvider";
import Ball from "../Ball";
import { REVEAL_BALL_TRANSITION_SECONDS } from "../../../constants/animationDurations";
import { GAME_PHASE } from "../../../constants/gamePhases";

export type Props = {
  position: 0 | 1 | 2;
  onGuess: (initialPosition: number) => void;
  startPosition: 0 | 1 | 2;
  hasBall: boolean;
  moveSpeed: number;
  numberOfCups: number;
};

const Cup = ({
  hasBall,
  position,
  onGuess,
  numberOfCups,
  moveSpeed,
  startPosition,
}: Props) => {
  const { gameState } = useGameState();
  const tiltCup = hasBall && gameState.revealBall;

  const handleGuess = () => onGuess(startPosition);

  return (
    <div
      style={{
        position: "absolute",
        width: `calc(100vw/${numberOfCups * 2})`,
        height: "100%",
        left: `calc((200vw/${numberOfCups * 2}) * ${position})`,
        transition: `left ${moveSpeed / 1000}s ease`,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <button
        style={{
          position: "absolute",
          zIndex: 1,
          borderRadius: "15px",
          backgroundColor: "unset",
          borderBottom: "250px solid purple",
          borderTop: "unset",
          borderLeft: "25px solid transparent",
          borderRight: "25px solid transparent",
          outline: "none",
          height: "250px",
          width: `calc(100vw/${numberOfCups * 2})`,
          transition: `left ${moveSpeed / 1000}s ease`,
          transformOrigin: "bottom left",
          transitionProperty: tiltCup ? "transform" : "unset",
          transitionDuration: `${REVEAL_BALL_TRANSITION_SECONDS}s`,
          transform: `rotate(${tiltCup ? -30 : 0}deg)`,
        }}
        disabled={!gameState.isGuessing}
        onClick={handleGuess}
      ></button>
      {/* only render ball when tilting, to prevent devtool element cheating */}
      {/* NOTE: shuffled phase is equivalent to 'ready to guess' */}
      {hasBall &&
        gameState.gamePhase !== GAME_PHASE.SHUFFLING &&
        gameState.gamePhase !== GAME_PHASE.SHUFFLED && <Ball />}
    </div>
  );
};

export default Cup;
