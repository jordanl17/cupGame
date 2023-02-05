import randomiseCupPositions from "./cupPositionUtil";

const mockRandom = jest.spyOn(global.Math, "random");

describe("randomiseCupPositions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("will give cup positions for 3 cups", () => {
    mockRandom.mockReturnValueOnce(1).mockReturnValueOnce(1);

    const result = randomiseCupPositions([0, 1, 2]);

    expect(result).toEqual([2, 1, 0]);
    expect(mockRandom).toHaveBeenCalledTimes(2);
  });

  test("will always give different positions than the input", () => {
    mockRandom
      // make first cup go to position 0
      .mockReturnValueOnce(0)
      // make second cup go to position 1; third cup go to position 2
      .mockReturnValueOnce(0)
      // this is same as input - make second iteration move first cup to position 2
      .mockReturnValueOnce(1)
      // make second cup go to position 1, third cup to go position 0
      .mockReturnValueOnce(0);

    const result = randomiseCupPositions([0, 1, 2]);

    expect(result).toEqual([2, 0, 1]);
    expect(mockRandom).toHaveBeenCalledTimes(4);
  });
});
