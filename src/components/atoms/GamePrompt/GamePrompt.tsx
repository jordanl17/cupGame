import { GAME_PHASE } from "@constants/gamePhases";
import { useGameState } from "@contexts/gameState/gameStateProvider";
import { useMemo } from "react";

const GamePrompt = () => {
  const { gameState } = useGameState();

  const promptMessage = useMemo(() => {
    if (gameState.isGuessing) {
      return "GUESS A CUP";
    }

    switch (gameState.gamePhase) {
      case GAME_PHASE.PLACING_BALL:
        return "WATCH THE BALL...";
      case GAME_PHASE.SHUFFLING:
        return "SHUFFLING THE CUPS...";
      case GAME_PHASE.WIN:
        return `YOU WON: YOU HAVE ${gameState.points} POINTS`;
      case GAME_PHASE.LOSE:
        return `YOU LOST: YOU HAVE ${gameState.points} POINTS`;
      default:
        return "";
    }
  }, [gameState.isGuessing, gameState.gamePhase]);

  return (
    <div style={{ height: 25, display: "flex", justifyContent: "center" }}>
      <h1>{promptMessage}</h1>
    </div>
  );
};

export default GamePrompt;
