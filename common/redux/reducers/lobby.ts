import {createReducer} from 'typesafe-actions'

import {GameShort} from '@types'

import {getGames} from '@actions/lobby'
import {RootAction} from '@actions/index'

export interface LobbyState {
  games: Array<GameShort>
  loading: boolean
}
export const initialLobbyState: LobbyState = {
  games: [],
  loading: false,
}

export const lobby = createReducer<LobbyState, RootAction>(initialLobbyState)
  .handleAction(getGames.request, (state): LobbyState => ({...state, loading: true}))
  .handleAction(getGames.success, (state, {payload: games}): LobbyState => ({...state, loading: false, games}))
  .handleAction(getGames.failure, (state): LobbyState => ({...state, loading: false}))
