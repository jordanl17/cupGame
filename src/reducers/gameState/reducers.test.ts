import { act, renderHook } from "@testing-library/react";
import { DIFFICULTY } from "@constants/difficulty";
import { GAME_PHASE } from "@constants/gamePhases";
import useGameStateReducer, { GameStateActionsType } from "./reducers";

describe("useGameStateReducer", () => {
  test("has initial state", () => {
    const { result } = renderHook(useGameStateReducer);

    expect(result.current[0]).toEqual({
      gamePhase: "idle",
      isGuessing: false,
      isPlaying: false,
      points: 0,
      revealBall: false,
    });
  });

  test("can win game", () => {
    const { result, rerender } = renderHook(useGameStateReducer);

    act(() => {
      result.current[1]({
        type: "guessResult",
        guessResult: "WIN",
        difficulty: DIFFICULTY.HARD,
      });
    });

    rerender();

    expect(result.current[0]).toEqual({
      gamePhase: "win",
      isGuessing: false,
      isPlaying: false,
      points: 5,
      revealBall: true,
    });
  });

  test("can lose game", () => {
    const { result, rerender } = renderHook(useGameStateReducer);

    act(() => {
      result.current[1]({
        type: "guessResult",
        guessResult: "LOSE",
        difficulty: DIFFICULTY.HARD,
      });
    });

    rerender();

    expect(result.current[0]).toEqual({
      gamePhase: "lose",
      isGuessing: false,
      isPlaying: false,
      points: 0,
      revealBall: true,
    });
  });

  test("can change game phase", () => {
    const { result, rerender } = renderHook(useGameStateReducer);

    act(() => {
      result.current[1]({
        type: "changePhase",
        phase: GAME_PHASE.SHUFFLING,
      });
    });

    rerender();

    expect(result.current[0]).toEqual({
      gamePhase: "shuffling",
      isGuessing: false,
      isPlaying: true,
      points: 0,
      revealBall: false,
    });
  });

  test("invalid action is noop", () => {
    const { result, rerender } = renderHook(useGameStateReducer);

    const state = {
      gamePhase: "idle",
      isGuessing: false,
      isPlaying: false,
      points: 0,
      revealBall: false,
    };

    expect(result.current[0]).toEqual(state);

    try {
      act(() => {
        result.current[1]({
          type: "something-not-valid",
          phase: GAME_PHASE.SHUFFLING,
        } as unknown as GameStateActionsType);
      });
    } catch (e: any) {
      expect(e.message).toEqual("no action handler exists");
      rerender();

      expect(result.current[0]).toEqual(state);
    }
  });
});
