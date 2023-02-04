import PlayingField from "./components/molecules/PlayingField/PlayingField";
import GameStateProvider from "./contexts/gameState/gameStateProvider";
// import "./Game.css";

function Game() {
  return (
    <GameStateProvider>
      <PlayingField />
    </GameStateProvider>
  );
}

export default Game;
