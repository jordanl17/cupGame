import { useState } from "react";

import GamePrompt from "@atoms/GamePrompt/GamePrompt";
import Points from "@atoms/Points";

import Controls from "@molecules/Controls";
import PlayingField from "@molecules/PlayingField";

import { DIFFICULTY, difficultyType } from "@constants/difficulty";

import GameStateProvider from "@contexts/gameState/gameStateProvider";

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
