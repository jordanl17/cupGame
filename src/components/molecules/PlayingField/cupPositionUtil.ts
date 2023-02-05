export type cupPositionsType = (0 | 1 | 2)[];

export const INITIAL_CUP_POSITIONS: cupPositionsType = [0, 1, 2];

// TODO: make this better for 4,5,6 number of cups
const randomiseCupPositions = (
  currentCupPositions: cupPositionsType
): cupPositionsType => {
  const firstCup = Math.floor(Math.random() * 3);
  const remainingPositions = [0, 1, 2].filter((el) => el !== firstCup);
  const [secondCup, thirdCup] = Math.round(Math.random())
    ? remainingPositions.reverse()
    : remainingPositions;

  const newPositions = [firstCup, secondCup, thirdCup] as cupPositionsType;

  const isNewPositionsVoidMove = currentCupPositions.every(
    (currentPosition, index) => newPositions[index] === currentPosition
  );

  if (isNewPositionsVoidMove) return randomiseCupPositions(currentCupPositions);
  return newPositions;
};

export default randomiseCupPositions;
