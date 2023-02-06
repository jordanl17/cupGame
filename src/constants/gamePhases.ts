export const GAME_PHASE = {
  START: 'start',
  IDLE: 'idle',
  PLACING_BALL: 'placingBall',
  PLACED_BALL: 'placedBall',
  SHUFFLING: 'shuffling',
  SHUFFLED: 'shuffled',
  WIN: 'win',
  LOSE: 'lose',
} as const

export type gameStateType = (typeof GAME_PHASE)[keyof typeof GAME_PHASE]
