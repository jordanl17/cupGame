import { difficultyType, NUMBER_OF_CUPS } from "@constants/difficulty";

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

/**
 * at most 1 cup may stay in the same position between shuffles
 */
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

export const twoAtATime = (currentCupPositions: number[]): number[] => {
  const APosition = Math.floor(Math.random() * currentCupPositions.length);
  const BPosition = Math.floor(Math.random() * currentCupPositions.length);

  if (APosition === BPosition) return twoAtATime(currentCupPositions);

  return currentCupPositions.map((currentPosition) => {
    // set cup at position A to be at position B
    if (currentPosition === APosition) {
      return BPosition;
    }

    // swap cup at position B to be at position A
    if (currentPosition === BPosition) {
      return APosition;
    }

    // other cups remain in their current position
    return currentPosition;
  });
};
