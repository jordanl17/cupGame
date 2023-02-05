import { useGameState } from "../../../contexts/gameState/gameStateProvider";
import Ball from "../Ball";
import { REVEAL_BALL_TRANSITION_SECONDS } from "../../../constants/animationDurations";
import { GAME_PHASE } from "../../../constants/gamePhases";

export type Props = {
  position: number;
  onGuess: (initialPosition: number) => void;
  startPosition: number;
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

  /**
   * only render ball when tilting, to prevent devtool element cheating
   * NOTE: 'shuffled' phase is equivalent to 'ready to guess'
   */
  const canRenderBall =
    hasBall &&
    gameState.gamePhase !== GAME_PHASE.SHUFFLING &&
    gameState.gamePhase !== GAME_PHASE.SHUFFLED;

  const horizontalMoveTransition = `left ${moveSpeed / 1000}s ease`;
  const revealBallTransition = `transform ${REVEAL_BALL_TRANSITION_SECONDS}s ease`;

  const transition = [
    horizontalMoveTransition,
    canRenderBall && revealBallTransition,
  ].join(", ");

  return (
    <div
      style={{
        position: "absolute",
        width: `calc(100vw/${numberOfCups * 2})`,
        height: "100%",
        left: `calc(200vw * ${(position / (numberOfCups * 2)).toFixed(2)})`,
        transition: horizontalMoveTransition,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <button
        data-testid="cup"
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
          transition,
          transformOrigin: "bottom left",
          transform: `rotate(${tiltCup ? -30 : 0}deg)`,
          cursor: gameState.isGuessing ? "pointer" : "not-allowed",
        }}
        disabled={!gameState.isGuessing}
        onClick={handleGuess}
      ></button>
      {canRenderBall && <Ball />}
    </div>
  );
};

export default Cup;
