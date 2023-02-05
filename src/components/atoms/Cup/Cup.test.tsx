import { fireEvent, render, screen } from "@testing-library/react";
import { GAME_PHASE } from "../../../constants/gamePhases";
import { useGameState } from "../../../contexts/gameState/gameStateProvider";
import Cup, { Props } from "./Cup";

jest.mock("../../../contexts/gameState/gameStateProvider", () => ({
  useGameState: jest.fn(),
}));

const defaultProps: Props = {
  position: 1,
  onGuess: jest.fn(),
  startPosition: 2,
  hasBall: false,
  moveSpeed: 1000,
  numberOfCups: 3,
};

const mockUseGameState = useGameState as jest.Mock;

const renderer = (props: Partial<Props> = defaultProps) =>
  render(<Cup {...defaultProps} {...props} />);

describe("Cup", () => {
  beforeEach(() => {
    mockUseGameState.mockReturnValue({
      gameState: {
        revealBall: false,
        isGuessing: false,
        gamePhase: GAME_PHASE.IDLE,
      },
    });
  });

  describe("guessing on cup", () => {
    const getCup = () => screen.getByRole("button");

    test("is not allow guess when game is idle", () => {
      const mockOnGuess = jest.fn();
      renderer({ onGuess: mockOnGuess });

      fireEvent.click(getCup());
      expect(mockOnGuess).not.toHaveBeenCalled();
    });

    test("is not allowed whilst game is not in guessable state", () => {
      const mockOnGuess = jest.fn();
      mockUseGameState.mockReturnValueOnce({
        gameState: { isGuessing: false, gamePhase: GAME_PHASE.PLACING_BALL },
      });

      renderer({ onGuess: mockOnGuess });

      fireEvent.click(getCup());
      expect(mockOnGuess).not.toHaveBeenCalled();
    });

    test("is allowed when game is in guessable state", () => {
      const mockOnGuess = jest.fn();
      mockUseGameState.mockReturnValueOnce({
        gameState: { isGuessing: true, gamePhase: GAME_PHASE.SHUFFLED },
      });

      renderer({ onGuess: mockOnGuess });

      fireEvent.click(getCup());
      expect(mockOnGuess).toHaveBeenCalledTimes(1);
      expect(mockOnGuess).toHaveBeenCalledWith(2);
    });
  });

  describe("ball is not rendered", () => {
    test("when cup does not have ball", () => {
      renderer();

      expect(screen.queryByTestId("ball")).toBeNull();
    });

    test("when cup does not have ball, and game is in placing ball phases", () => {
      mockUseGameState.mockReturnValueOnce({
        gameState: { isGuessing: false, gamePhase: GAME_PHASE.PLACED_BALL },
      });

      renderer();

      expect(screen.queryByTestId("ball")).toBeNull();
    });

    test("when cup does have ball, but game is in shuffle phases", () => {
      mockUseGameState.mockReturnValueOnce({
        gameState: { isGuessing: false, gamePhase: GAME_PHASE.SHUFFLED },
      });

      renderer({ hasBall: true });

      expect(screen.queryByTestId("ball")).toBeNull();
    });
  });

  describe("ball is rendered", () => {
    test("when cup has ball and game phase is placing ball", () => {
      mockUseGameState.mockReturnValueOnce({
        gameState: { isGuessing: false, gamePhase: GAME_PHASE.PLACED_BALL },
      });

      renderer({ hasBall: true });

      screen.getByTestId("ball");
    });

    test("when cup has ball and game phase is win or lose", () => {
      mockUseGameState.mockReturnValueOnce({
        gameState: { isGuessing: false, gamePhase: GAME_PHASE.WIN },
      });

      renderer({ hasBall: true });

      screen.getByTestId("ball");
    });
  });
});
