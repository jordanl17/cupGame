type Props = {
  position: 0 | 1 | 2;
  onGuess: () => void;
  startPosition: 0 | 1 | 2;
  isShuffling: boolean;
};

const Cup = (props: Props) => {
  return (
    <button
      style={{
        position: "absolute",
        left: `calc((200vw/6) * ${props.position})`,
        backgroundColor: "purple",
        border: "none",
        outline: "none",
        height: "100%",
        width: "calc(100vw/6)",
        transition: "left 1s ease",
        borderRadius: "unset",
      }}
      disabled={props.isShuffling}
      onClick={props.onGuess}
    />
  );
};

export default Cup;
