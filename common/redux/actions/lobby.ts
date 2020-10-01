import {createAsyncAction} from 'typesafe-actions'
import {GameShort} from '@types'

export const getGames = createAsyncAction('GET_GAMES', 'GET_GAMES_SUCCESS', 'GET_GAMES_ERROR')<
  undefined,
  Array<GameShort>,
  undefined
>()

export const createGame = createAsyncAction('socket/CREATE_GAME', 'CREATE_GAME_SUCCESS', 'CREATE_GAME_ERROR')<
  {gameName: string; playerName: string},
  GameShort,
  undefined
>()
