import {
  GAME_STATE,
  useGameState,
} from "../../../contexts/gameState/gameStateProvider";
import Ball from "../Ball";

type Props = {
  position: 0 | 1 | 2;
  onGuess: () => void;
  startPosition: 0 | 1 | 2;
  hasBall: boolean;
};

const Cup = ({ hasBall, position, onGuess }: Props) => {
  const { gameState } = useGameState();
  const tiltCup =
    hasBall &&
    (gameState === GAME_STATE.PLACING_BALL || gameState === GAME_STATE.GUESSED);

  return (
    <div
      style={{
        position: "absolute",
        width: "calc(100vw/6)",
        height: "100%",
        left: `calc((200vw/6) * ${position})`,
        transition: "left 1s ease",
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
          width: "calc(100vw/6)",
          transition: "left 1s ease",
          transformOrigin: "bottom left",
          transitionProperty: tiltCup ? "transform" : "unset",
          transitionDuration: "0.5s",
          transform: `rotate(${tiltCup ? -30 : 0}deg)`,
        }}
        disabled={gameState === GAME_STATE.SHUFFLING}
        onClick={onGuess}
      ></button>
      {/* only show cup when tilting, to prevent devtool element cheating */}
      {tiltCup && <Ball />}
    </div>
  );
};

export default Cup;
