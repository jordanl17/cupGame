import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { act } from "react-dom/test-utils";
import randomiseCupPositions from "./components/molecules/PlayingField/cupPositionUtil";
import Game from "./Game";

const mockRandom = jest.spyOn(global.Math, "random");

jest.mock("./components/molecules/PlayingField/cupPositionUtil", () => ({
  ...jest.requireActual("./components/molecules/PlayingField/cupPositionUtil"),
  default: jest.fn(),
}));

const mockRandomiseCupPositions = randomiseCupPositions as jest.Mock;

const advanceTimersAndFlush = (timeMs: number): Promise<unknown> => {
  jest.advanceTimersByTime(timeMs);
  return new Promise<unknown>(jest.requireActual("timers").setImmediate);
};

global.innerWidth = 500;

function flushPromises() {
  new Promise(jest.requireActual("timers").setImmediate);
}

describe("E2E test", () => {
  beforeEach(() => {
    jest.useFakeTimers({ legacyFakeTimers: true });
  });
  // test("starts with 0 points", () => {
  //   render(<Game />);

  //   screen.getByText("Points: 0");
  // });

  test("starting game places and shows the ball", async () => {
    render(<Game />);

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

    mockRandomiseCupPositions
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

    expect(mockRandomiseCupPositions).toHaveBeenCalledTimes(5);

    const allCups = screen.getAllByTestId("cup");

    fireEvent.click(allCups[0]);

    screen.getByText("YOU WON: YOU HAVE 1 POINTS");

    within(allCups[0].parentElement!).getByTestId("ball");

    // left = calc(200vw * (currentPosition/ (numberOfCups * 2)))
    // numberOfCups = 3
    // thus position of ball is 2
    expect(allCups[0].parentElement!).toHaveStyle({
      left: "calc(200vw * 0.33)",
    });
  });
});
