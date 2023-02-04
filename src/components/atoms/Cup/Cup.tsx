import Ball from "../Ball";

type Props = {
  position: 0 | 1 | 2;
  onGuess: () => void;
  startPosition: 0 | 1 | 2;
  isShuffling: boolean;
  isPlacingBall: boolean;
  hasBall: boolean;
  hasGuessed: boolean;
};

const Cup = (props: Props) => {
  const tiltCup = props.hasBall && (props.isPlacingBall || props.hasGuessed);

  return (
    <div
      style={{
        position: "absolute",
        width: "calc(100vw/6)",
        height: "100%",
        left: `calc((200vw/6) * ${props.position})`,
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
        disabled={props.isShuffling}
        onClick={props.onGuess}
      ></button>
      {/* only show cup when tilting, to prevent devtool element cheating */}
      {tiltCup && <Ball />}
    </div>
  );
};

export default Cup;
