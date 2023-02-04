const StartButton = (
  props: React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >
) => {
  return (
    <button
      style={{
        borderRadius: 20,
        backgroundColor: "#da00ff",
        color: "white",
        padding: 10,
        border: "unset",
        opacity: props.disabled ? 0.5 : 1,
      }}
      {...props}
    ></button>
  );
};

export default StartButton;
