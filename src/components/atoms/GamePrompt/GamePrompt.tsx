import { GAME_PHASE } from "@constants/gamePhases";
import { useGameState } from "@contexts/gameState/gameStateProvider";

const GamePrompt = () => {
  const { gameState } = useGameState();

  const renderPrompt = () => {
    if (gameState.gamePhase === GAME_PHASE.PLACING_BALL) {
      return <h1>WATCH THE BALL...</h1>;
    }

    if (gameState.gamePhase === GAME_PHASE.SHUFFLING) {
      return <h1>SHUFFLING THE CUPS...</h1>;
    }

    if (gameState.isGuessing) {
      return <h1>GUESS A CUP</h1>;
    }

    if (gameState.gamePhase === GAME_PHASE.WIN) {
      return <h1>YOU WON: YOU HAVE {gameState.points} POINTS</h1>;
    }

    if (gameState.gamePhase === GAME_PHASE.LOSE) {
      return <h1>YOU LOST: YOU HAVE {gameState.points} POINTS</h1>;
    }
  };

  return (
    <div style={{ height: 25, display: "flex", justifyContent: "center" }}>
      {renderPrompt()}
    </div>
  );
};

export default GamePrompt;
