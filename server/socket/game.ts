import {Socket} from 'socket.io'

import {reqGetGame, reqStartGame, sendGame} from '@actions/game'
import {startGame} from '../models'
import {createReducer, safeGameCallback, emitAction, IOType} from './utils'

const gameStateReducers = (io: IOType, socket: Socket) => ({
  ...createReducer(reqGetGame, gameId => {
    safeGameCallback(socket, gameId, game => {
      emitAction(socket, sendGame(game))
    })
  }),
  ...createReducer(reqStartGame, gameId => {
    safeGameCallback(socket, gameId, game => {
      startGame(game)
      emitAction(io.to(gameId), sendGame(game))
    })
  }),
})

export default gameStateReducers
