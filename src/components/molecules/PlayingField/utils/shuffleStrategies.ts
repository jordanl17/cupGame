import {
  difficultyType,
  NUMBER_OF_CUPS,
} from "@constants/difficulty";

export type cupPositionsType = number[];

export const generateInitialCupPositions = (difficulty: difficultyType) =>
  Array(NUMBER_OF_CUPS[difficulty])
    .fill(undefined)
    .map((_, index) => index);

const pickRandomUnusedPosition = (availablePositions: number[]): number => {
  const proposedNewPositionIndex = Math.floor(
    Math.random() * availablePositions.length
  );

  return availablePositions[proposedNewPositionIndex];
};

/**
 * at most 1 cup may stay in the same position
 */

// CALLOUT - did try doing .some (ie if any are in the same position)
// but this gives weird experience since 2 cups next to each other always
// move in same direction

const isVoidMove = (currentPositions: number[], newPositions: number[]) =>
  currentPositions.filter(
    (currentPosition, index) => newPositions[index] === currentPosition
  ).length > 1;

export const moveThemAll = (currentPositions: number[]): number[] => {
  const proposedNewPositions = placeRemainingCups(currentPositions.length);

  if (isVoidMove(currentPositions, proposedNewPositions))
    return moveThemAll(currentPositions);

  return proposedNewPositions;
};

const placeRemainingCups = (
  numberOfCupsToPlace: number,
  currentlyPlacedCups: number[] = []
): number[] => {
  const availablePositions = Array(
    numberOfCupsToPlace + currentlyPlacedCups.length
  )
    .fill(undefined)
    .map((_, index) => index)
    .filter((cupPosition) => !currentlyPlacedCups.includes(cupPosition));

  // if there's only 1 available position, place the last cup there
  if (numberOfCupsToPlace === 1) return [availablePositions[0]];

  const newPositionForNextCup = pickRandomUnusedPosition(availablePositions);

  return [
    newPositionForNextCup,
    ...placeRemainingCups(numberOfCupsToPlace - 1, [
      ...currentlyPlacedCups,
      newPositionForNextCup,
    ]),
  ];
};

export const twoAtATime = (currentCupPositions: number[]): number[] => {
  const firstCupToSwap = Math.floor(Math.random() * currentCupPositions.length);
  const secondCupToSwap = Math.floor(
    Math.random() * currentCupPositions.length
  );

  if (firstCupToSwap === secondCupToSwap)
    return twoAtATime(currentCupPositions);

  return currentCupPositions.map((currentPosition) => {
    // swap cup 1 and move it to cup 2 position
    if (currentPosition === firstCupToSwap) {
      return secondCupToSwap;
    }

    // swap cup 2 and move it to cup 1 position
    if (currentPosition === secondCupToSwap) {
      return firstCupToSwap;
    }

    // other cups remain in their current position
    return currentPosition;
  });
};
