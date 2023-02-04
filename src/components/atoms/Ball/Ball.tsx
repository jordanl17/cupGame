type Props = {};

const Ball = (props: Props) => {
  return (
    <div
      style={{
        backgroundColor: "red",
        width: "calc(100vw/12)",
        height: "calc(100vw/12)",
        position: "absolute",
        borderRadius: "100%",
        bottom: 0,
        zIndex: 0,
      }}
    />
  );
};

export default Ball;
