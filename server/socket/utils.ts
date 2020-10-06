import {getType} from 'typesafe-actions'
import socketIO, {Socket, Namespace} from 'socket.io'

import {RootAction} from '@actions/index'
import {sendError} from '@actions/lobby'
import {GameShort, Game} from '@types'
import {State} from '../models'

export const createReducer = <T>(ac: (arg: T) => RootAction, func: (payload: T) => void) => ({
  [getType(ac)]: func,
})

export const getShortGame = (game: Game): GameShort => ({
  ...game,
  players: Object.keys(game.players),
})

export type IOType = ReturnType<typeof socketIO>
export type SocketEmitter = IOType | Socket | Namespace

export const emitAction = (emitter: SocketEmitter, action: RootAction) => {
  emitter.emit('action', action)
}

export const safeGameCallback = (emitter: SocketEmitter, gameId: Game['id'], callback: (game: Game) => void) => {
  const game = State.games[gameId]
  if (!game) {
    emitAction(emitter, sendError(`Couldn't find game ${gameId}`))
  } else {
    callback(game)
  }
}
