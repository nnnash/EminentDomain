import {createAsyncAction} from 'typesafe-actions'
import {Game} from '@types'

export const getGame = createAsyncAction('socket/GET_GAME', 'GET_GAME_SUCCESS', 'GET_GAME_ERROR')<
  Game['id'],
  Game,
  undefined
>()
