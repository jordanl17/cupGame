import { Dispatch, SetStateAction, useCallback } from "react";
import { DIFFICULTY, difficultyType } from "../../../constants/difficulty";
import { GAME_PHASE } from "../../../constants/gamePhases";
import { useGameState } from "../../../contexts/gameState/gameStateProvider";
import StartButton from "../../atoms/StartButton";

export type Props = {
  setDifficulty: Dispatch<SetStateAction<difficultyType>>;
  difficulty: difficultyType;
};

const Controls = ({ setDifficulty, difficulty }: Props) => {
  const { gameState, dispatch } = useGameState();

  const handleStartGame = () =>
    dispatch({ type: "changePhase", phase: GAME_PHASE.START });

  const handleChangeDifficulty = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const {
        target: { value },
      } = e;

      setDifficulty(value as difficultyType);
    },
    []
  );

  const isControlDisabled = gameState.isPlaying || gameState.isGuessing;

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "baseline",
        gap: 20,
      }}
    >
      <div>
        <StartButton disabled={isControlDisabled} onClick={handleStartGame}>
          Start game
        </StartButton>
      </div>
      <div>
        <select
          data-testid="difficulty-select"
          disabled={isControlDisabled}
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
