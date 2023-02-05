import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { DIFFICULTY } from "../../../constants/difficulty";
import { useGameState } from "../../../contexts/gameState/gameStateProvider";

import Controls, { Props } from "./Controls";

jest.mock("../../../contexts/gameState/gameStateProvider", () => ({
  useGameState: jest.fn(),
}));

const mockUseGameState = useGameState as jest.Mock;

const defaultProps: Props = {
  setDifficulty: jest.fn() as unknown as any,
  difficulty: DIFFICULTY.MODERATE,
};

const renderer = (props: Partial<Props> = defaultProps) =>
  render(<Controls {...defaultProps} {...props} />);

describe("Controls", () => {
  const mockDispatch = jest.fn();

  beforeEach(() => {
    mockUseGameState.mockReturnValue({ gameState: {}, dispatch: mockDispatch });
  });

  test("has start and difficulty select", () => {
    renderer();

    expect(screen.getByText("Start game")).not.toBeDisabled();

    expect(screen.getByTestId("difficulty-select")).not.toBeDisabled();

    // only moderate (the active difficulty) should be selected
    expect(screen.getByText("moderate")).toHaveAttribute("selected");
    expect(screen.getByText("easy")).not.toHaveAttribute("selected");
    expect(screen.getByText("hard")).not.toHaveAttribute("selected");
  });

  test("should allow for game start", () => {
    renderer();

    fireEvent.click(screen.getByText("Start game"));

    expect(mockDispatch).toHaveBeenCalledWith({
      phase: "start",
      type: "changePhase",
    });
  });

  test("should allow for changing difficulty", () => {
    const mockSetDifficulty = jest.fn();

    renderer({ setDifficulty: mockSetDifficulty });

    fireEvent.change(screen.getByTestId("difficulty-select"), {
      target: { value: DIFFICULTY.HARD },
    });

    expect(mockSetDifficulty).toHaveBeenCalledWith(DIFFICULTY.HARD);
  });

  test("should disable controls when game is playing", () => {
    mockUseGameState.mockReturnValue({
      gameState: { isPlaying: true, isGuessing: false },
      dispatch: jest.fn(),
    });
    renderer();

    expect(screen.getByText("Start game")).toBeDisabled();
    expect(screen.getByTestId("difficulty-select")).toBeDisabled();
  });

  test("should disable controls when game is awaiting guess", () => {
    mockUseGameState.mockReturnValue({
      gameState: { isPlaying: false, isGuessing: true },
      dispatch: jest.fn(),
    });
    renderer();

    expect(screen.getByText("Start game")).toBeDisabled();
    expect(screen.getByTestId("difficulty-select")).toBeDisabled();
  });
});
