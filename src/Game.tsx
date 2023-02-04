import { useState } from "react";
import GamePrompt from "./components/atoms/GamePrompt/GamePrompt";
import Points from "./components/atoms/Points";
import Controls from "./components/molecules/Controls/Controls";
import PlayingField from "./components/molecules/PlayingField/PlayingField";
import { DIFFICULTY, difficultyType } from "./constants/difficulty";
import GameStateProvider from "./contexts/gameState/gameStateProvider";
// import "./Game.css";

function Game() {
  const [difficulty, setDifficulty] = useState<difficultyType>(DIFFICULTY.EASY);

  return (
    <GameStateProvider>
      <Points />
      <GamePrompt />
      <PlayingField difficulty={difficulty} />
      <Controls setDifficulty={setDifficulty} difficulty={difficulty} />
    </GameStateProvider>
  );
}

export default Game;
