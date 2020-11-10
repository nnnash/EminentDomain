import {createReducer} from 'typesafe-actions'

import {Game} from '@types'
import {RootAction} from '@actions/index'
import {reqGetGame, sendGame, sendGameError} from '@actions/game'

export interface GameState extends Game {
  loading: boolean
}
export const initialGameState: GameState = ({
  loading: false,
} as unknown) as GameState

export const game = createReducer<GameState, RootAction>(initialGameState)
  .handleAction(reqGetGame, (state): GameState => ({...state, loading: true}))
  .handleAction(sendGame, (state, {payload: gameState}): GameState => ({...state, loading: false, ...gameState}))
  .handleAction(sendGameError, (state): GameState => ({...state, loading: false}))
