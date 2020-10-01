import {getType} from 'typesafe-actions'

import {RootAction} from '@actions/index'
import {GameShort, Game} from '@types'

export const createReducer = <T>(ac: (arg: T) => RootAction, func: (payload: T) => void) => ({
  [getType(ac)]: func,
})

export const getShortGame = (game: Game): GameShort => ({
  ...game,
  players: Object.keys(game.players),
})
