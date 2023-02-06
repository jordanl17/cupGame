import { createContext, Dispatch, useContext } from 'react'

import useGameStateReducer from '../../reducers/gameState'

import {
  GameStateActionsType,
  GameStateI,
  initialGameState,
} from '../../reducers/gameState/reducers'

interface GameStateProviderPropTypes {
  children: React.ReactNode
}

const GameStateContext = createContext<{
  gameState: GameStateI
  dispatch: Dispatch<GameStateActionsType>
}>({
  gameState: initialGameState,
  dispatch: () => null,
})

export const useGameState = () => {
  const context = useContext(GameStateContext)

  return context
}

const GameStateProvider = ({ children }: GameStateProviderPropTypes) => {
  const [gameState, dispatch] = useGameStateReducer()

  const value = { gameState, dispatch }
  return (
    <GameStateContext.Provider value={value}>
      {children}
    </GameStateContext.Provider>
  )
}

export default GameStateProvider
