import {createReducer} from 'typesafe-actions'

import {Game, GameStage} from '@types'
import {RootAction} from '@actions/index'
import {getGame} from '@actions/game'

export interface GameState extends Game {
  loading: boolean
}
export const initialGameState: GameState = {
  id: '',
  players: {},
  name: '',
  stage: GameStage.new,
  loading: false,
}

export const game = createReducer<GameState, RootAction>(initialGameState)
  .handleAction(getGame.request, (state): GameState => ({...state, loading: true}))
  .handleAction(getGame.success, (state, {payload: gameState}): GameState => ({...state, loading: false, ...gameState}))
  .handleAction(getGame.failure, (state): GameState => ({...state, loading: false}))
