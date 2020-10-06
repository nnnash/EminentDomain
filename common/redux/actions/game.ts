import {createAction} from 'typesafe-actions'
import {Game} from '@types'

export const reqGetGame = createAction('socket/GET_GAME')<Game['id']>()
export const reqStartGame = createAction('socket/START_GAME')<Game['id']>()

export const sendGame = createAction('resp/SEND_GAME')<Game>()

export const sendGameError = createAction('resp/GAME_ERROR')<string | undefined>()
