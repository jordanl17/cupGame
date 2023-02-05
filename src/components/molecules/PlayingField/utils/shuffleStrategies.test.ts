import { moveThemAll, twoAtATime } from "./shuffleStrategies";

const mockRandom = jest.spyOn(global.Math, "random");

describe("shuffleStrategies", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("twoAtATime", () => {
    test("should move only 2 cups at a time, other cup should stay static", () => {
      mockRandom.mockReturnValueOnce(0).mockReturnValueOnce(0.99);

      const result = twoAtATime([0, 1, 2, 3]);

      expect(mockRandom).toHaveBeenCalledTimes(2);

      expect(result).toEqual([3, 1, 2, 0]);
    });

    test("should always make sure 2 different random cups are moved", () => {
      mockRandom
        .mockReturnValueOnce(0)
        .mockReturnValueOnce(0)
        .mockReturnValueOnce(0.4)
        .mockReturnValueOnce(0.99);

      const result = twoAtATime([0, 1, 2]);

      expect(mockRandom).toHaveBeenCalledTimes(4);

      expect(result).toEqual([0, 2, 1]);
    });
  });

  describe("moveThemAll", () => {
    test("should shuffle all cups", () => {
      mockRandom
        // first cup will go to last position
        .mockReturnValueOnce(0.9)
        // second cup will go to second last position
        .mockReturnValueOnce(0.9)
        // third cup will go to first position
        .mockReturnValueOnce(0.2)
        // fourth cup will go to second position
        .mockReturnValueOnce(0.2);
      // last cup will go to third position

      const result = moveThemAll([0, 1, 2, 3, 4]);

      expect(mockRandom).toHaveBeenCalledTimes(4);

      expect(result).toEqual([4, 3, 0, 1, 2]);
    });

    test("should reshuffle if all cups are in same position", () => {
      mockRandom
        // first 4 calls keep all cups in same position
        .mockReturnValueOnce(0)
        .mockReturnValueOnce(0)
        .mockReturnValueOnce(0)
        .mockReturnValueOnce(0)
        // reshuffle is triggered - same as above test
        .mockReturnValueOnce(0.9)
        .mockReturnValueOnce(0.9)
        .mockReturnValueOnce(0.2)
        .mockReturnValueOnce(0.2);

      const result = moveThemAll([0, 1, 2, 3, 4]);

      expect(mockRandom).toHaveBeenCalledTimes(8);

      expect(result).toEqual([4, 3, 0, 1, 2]);
    });

    test("should reshuffle if 2 cups are in same position", () => {
      mockRandom
        .mockReturnValueOnce(0)
        .mockReturnValueOnce(0)
        .mockReturnValueOnce(0.6)
        .mockReturnValueOnce(0.9)
        .mockReturnValueOnce(0.9)
        .mockReturnValueOnce(0.2);

      const result = moveThemAll([0, 1, 2, 3]);

      expect(mockRandom).toHaveBeenCalledTimes(6);

      expect(result).toEqual([3, 2, 0, 1]);
    });

    test("should allow 1 cup in same position", () => {
      mockRandom.mockReturnValueOnce(0).mockReturnValueOnce(0.9);

      const result = moveThemAll([0, 1, 2]);

      expect(mockRandom).toHaveBeenCalledTimes(2);

      expect(result).toEqual([0, 2, 1]);
    });
  });
});
