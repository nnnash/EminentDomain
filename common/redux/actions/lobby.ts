import {createAsyncAction, createAction} from 'typesafe-actions'
import {Game, GameShort, Player} from '@types'

export const getGames = createAsyncAction('GET_GAMES', 'GET_GAMES_SUCCESS', 'GET_GAMES_ERROR')<
  undefined,
  Array<GameShort>,
  undefined
>()

export const createGame = createAsyncAction('socket/CREATE_GAME', 'CREATE_GAME_SUCCESS', 'CREATE_GAME_ERROR')<
  {gameName: string; playerName: string; playerId: string},
  GameShort,
  undefined
>()

export const joinGame = createAsyncAction('socket/JOIN_GAME', 'JOIN_GAME_SUCCESS', 'JOIN_GAME_ERROR')<
  {gameId: string; playerName: string; playerId: string},
  GameShort,
  undefined
>()

export const rejoinGame = createAsyncAction('socket/REJOIN_GAME', 'REJOIN_GAME_SUCCESS', 'REJOIN_GAME_ERROR')<
  {gameId: string; playerId: string},
  GameShort,
  undefined
>()

export const leaveGame = createAction('socket/LEAVE_GAME')<{gameId: Game['id']; playerId: Player['id']}>()
