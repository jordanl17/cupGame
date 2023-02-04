import { Dispatch, SetStateAction, useCallback } from "react";
import { DIFFICULTY, difficultyType } from "../../../constants/difficulty";
import {
  GAME_STATE,
  useGameState,
} from "../../../contexts/gameState/gameStateProvider";

type Props = {
  setDifficulty: Dispatch<SetStateAction<difficultyType>>;
  difficulty: difficultyType;
};

const Controls = ({ setDifficulty, difficulty }: Props) => {
  const { gameState, setGameState } = useGameState();

  const handleStartGame = () => setGameState(GAME_STATE.START);

  const handleChangeDifficulty = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const {
        target: { value },
      } = e;

      setDifficulty(value as difficultyType);
    },
    []
  );

  return (
    <div>
      <div>
        <button
          disabled={
            gameState !== GAME_STATE.IDLE && gameState !== GAME_STATE.GUESSED
          }
          onClick={handleStartGame}
        >
          Start game
        </button>
      </div>
      <div>
        <select
          disabled={
            gameState !== GAME_STATE.IDLE && gameState !== GAME_STATE.GUESSED
          }
          defaultValue={difficulty}
          name="difficulty"
          id="difficulty"
          onChange={handleChangeDifficulty}
        >
          {Object.values(DIFFICULTY).map((difficultyOption) => (
            <option key={difficultyOption} value={difficultyOption}>
              {difficultyOption}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Controls;
