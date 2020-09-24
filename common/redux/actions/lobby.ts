import {createAsyncAction} from 'typesafe-actions'
import {GameShort} from '@types'

export const getGames = createAsyncAction('GET_GAMES', 'GET_GAMES_SUCCESS', 'GET_GAMES_ERROR')<
  undefined,
  Array<GameShort>,
  undefined
>()
