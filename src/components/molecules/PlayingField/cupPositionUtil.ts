export type cupPositionsType = number[];

export const generateInitialCupPositions = (numberOfCups: number) =>
  Array(numberOfCups)
    .fill(undefined)
    .map((_, index) => index);

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
