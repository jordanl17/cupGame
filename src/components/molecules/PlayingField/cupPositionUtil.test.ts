import { twoAtATime } from "./utils/shuffleStrategies";

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
});

// describe.skip("randomiseCupPositions", () => {
//   beforeEach(() => {
//     jest.clearAllMocks();
//   });

//   test("will give cup positions for 3 cups", () => {
//     mockRandom.mockReturnValueOnce(0.99).mockReturnValueOnce(0.99);

//     const result = randomiseCupPositions([0, 1, 2]);

//     expect(result).toEqual([2, 1, 0]);
//     expect(mockRandom).toHaveBeenCalledTimes(2);
//   });

//   test("will always give different positions than the input", () => {
//     mockRandom
//       // make first cup go to position 0
//       .mockReturnValueOnce(0)
//       // make second cup go to position 1; third cup go to position 2
//       .mockReturnValueOnce(0)
//       // this is same as input - make second iteration move first cup to position 2
//       .mockReturnValueOnce(0.99)
//       // make second cup go to position 1, third cup to go position 0
//       .mockReturnValueOnce(0);

//     const result = randomiseCupPositions([0, 1, 2]);

//     expect(result).toEqual([2, 0, 1]);
//     expect(mockRandom).toHaveBeenCalledTimes(4);
//   });
// });
