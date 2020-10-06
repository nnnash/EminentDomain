import {createAsyncAction, createAction} from 'typesafe-actions'
import {Game, GameShort, Player} from '@types'

export const getGames = createAsyncAction('GET_GAMES', 'GET_GAMES_SUCCESS', 'GET_GAMES_ERROR')<
  undefined,
  Array<GameShort>,
  undefined
>()

export const reqCreateGame = createAction('socket/CREATE_GAME')<{
  gameName: string
  playerName: string
  playerId: string
}>()
export const reqJoinGame = createAction('socket/JOIN_GAME')<{
  gameId: string
  playerName: string
  playerId: string
}>()
export const reqRejoinGame = createAction('socket/REJOIN_GAME')<{gameId: string; playerId: string}>()
export const reqLeaveGame = createAction('socket/LEAVE_GAME')<{gameId: Game['id']; playerId: Player['id']}>()

export const sendGames = createAction('resp/GET_GAMES')<Array<GameShort>>()
export const sendShortGameToJoin = createAction('resp/JOIN_GAME')<GameShort>()

export const sendError = createAction('resp/ERROR')<string | undefined>()
