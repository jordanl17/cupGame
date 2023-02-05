import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { act } from "react-dom/test-utils";
import applyShuffleStrategy from "./components/molecules/PlayingField/utils/difficultyStrategies";
import Game from "./Game";

const mockRandom = jest.spyOn(global.Math, "random");

jest.mock(
  "./components/molecules/PlayingField/utils/difficultyStrategies",
  () => ({
    ...jest.requireActual(
      "./components/molecules/PlayingField/utils/difficultyStrategies"
    ),
    default: jest.fn(),
  })
);

const mockApplyShuffleStrategy = applyShuffleStrategy as jest.Mock;

const advanceTimersAndFlush = (timeMs: number): Promise<unknown> => {
  jest.advanceTimersByTime(timeMs);
  return new Promise<unknown>(jest.requireActual("timers").setImmediate);
};

describe("E2E test", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers({ legacyFakeTimers: true });
  });

  test("can play game and win", async () => {
    render(<Game />);

    screen.getByText("Points: 0");

    expect(screen.queryByTestId("ball")).toBeNull();

    fireEvent.change(screen.getByTestId("difficulty-select"), {
      target: { value: "hard" },
    });

    // mock ball placed in first cup
    mockRandom.mockReturnValueOnce(0);
    fireEvent.click(screen.getByText("Start game"));

    await waitFor(() => {
      expect(screen.queryByTestId("ball")).not.toBeNull();
    });

    within(screen.getAllByTestId("cup")[0].parentElement!).getByTestId("ball");

    await act(async () => {
      await advanceTimersAndFlush(1000);

      screen.getByTestId("ball");

      await advanceTimersAndFlush(500);
    });

    expect(screen.queryByTestId("ball")).toBeNull();

    mockApplyShuffleStrategy
      .mockReturnValueOnce([1, 2, 0])
      .mockReturnValueOnce([2, 0, 1])
      .mockReturnValueOnce([0, 1, 2])
      .mockReturnValueOnce([1, 2, 0])
      .mockReturnValueOnce([2, 0, 1])
      .mockReturnValueOnce([0, 1, 2])
      .mockReturnValueOnce([1, 2, 0])
      .mockReturnValueOnce([2, 0, 1])
      .mockReturnValueOnce([0, 1, 2])
      // final positions:
      // first cup is now second - this is where the ball is
      // second cup is now last
      // last cup is now first
      .mockReturnValueOnce([1, 2, 0]);

    screen.getByText("SHUFFLING THE CUPS...");

    await act(async () => {
      await advanceTimersAndFlush(5000);
    });

    screen.getByText("GUESS A CUP");

    expect(mockApplyShuffleStrategy).toHaveBeenCalledTimes(10);

    const allCups = screen.getAllByTestId("cup");

    fireEvent.click(allCups[0]);

    screen.getByText("YOU WON: YOU HAVE 5 POINTS");

    within(allCups[0].parentElement!).getByTestId("ball");

    // left = calc(200vw * (currentPosition/ (numberOfCups * 2)))
    // numberOfCups = 3
    // thus position of ball is 1
    expect(allCups[0].parentElement!).toHaveStyle({
      left: "calc(200vw * 0.17)",
    });

    screen.getByText("Points: 5");
  });

  test("can play game and lose", async () => {
    render(<Game />);

    screen.getByText("Points: 0");

    expect(screen.queryByTestId("ball")).toBeNull();

    // mock ball placed in first cup
    mockRandom.mockReturnValueOnce(0);
    fireEvent.click(screen.getByText("Start game"));

    await waitFor(() => {
      expect(screen.queryByTestId("ball")).not.toBeNull();
    });

    within(screen.getAllByTestId("cup")[0].parentElement!).getByTestId("ball");

    await act(async () => {
      await advanceTimersAndFlush(1000);

      screen.getByTestId("ball");

      await advanceTimersAndFlush(500);
    });

    expect(screen.queryByTestId("ball")).toBeNull();

    mockApplyShuffleStrategy
      .mockReturnValueOnce([1, 2, 0])
      .mockReturnValueOnce([2, 0, 1])
      .mockReturnValueOnce([0, 1, 2])
      .mockReturnValueOnce([1, 2, 0])
      // final positions:
      // first cup is now last - this is where the ball is
      // second cup is now first
      // last cup is now second
      .mockReturnValueOnce([2, 0, 1]);

    screen.getByText("SHUFFLING THE CUPS...");

    await act(async () => {
      await advanceTimersAndFlush(5000);
    });

    screen.getByText("GUESS A CUP");

    expect(mockApplyShuffleStrategy).toHaveBeenCalledTimes(5);

    const allCups = screen.getAllByTestId("cup");

    fireEvent.click(allCups[1]);

    screen.getByText("YOU LOST: YOU HAVE 0 POINTS");

    within(allCups[0].parentElement!).getByTestId("ball");

    // left = calc(200vw * (currentPosition/ (numberOfCups * 2)))
    // numberOfCups = 3
    // thus position of ball is 2
    expect(allCups[0].parentElement!).toHaveStyle({
      left: "calc(200vw * 0.33)",
    });

    screen.getByText("Points: 0");
  });
});
