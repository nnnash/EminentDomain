import {Socket} from 'socket.io'

import {reqGetGame, reqPlayAction, reqPlayRole, reqStartGame, sendGame} from '@actions/game'
import {playAction, playRole, startGame} from '../models'
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
  ...createReducer(reqPlayAction, payload => {
    safeGameCallback(socket, payload.gameId, game => {
      playAction(game, payload)
      emitAction(io.to(payload.gameId), sendGame(game))
    })
  }),
  ...createReducer(reqPlayRole, payload => {
    safeGameCallback(socket, payload.gameId, game => {
      playRole(game, payload)
      emitAction(io.to(payload.gameId), sendGame(game))
    })
  }),
})

export default gameStateReducers
