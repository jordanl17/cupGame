import { useGameState } from "@contexts/gameState/gameStateProvider";

const Points = () => {
  const { gameState } = useGameState();

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        right: 0,
        margin: 20,
        padding: 10,
        backgroundColor: "#bbb",
      }}
    >
      Points: {gameState.points}
    </div>
  );
};

export default Points;
