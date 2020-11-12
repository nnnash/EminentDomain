import {Socket} from 'socket.io'

import {
  reqGetGame,
  reqPlayAction,
  reqPlayCleanup,
  reqPlayRole,
  reqSkipAction,
  reqStartGame,
  sendGame,
} from '@actions/game'
import {playAction, playCleanUp, playRole, skipAction, startGame} from '../models'
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
  ...createReducer(reqSkipAction, payload => {
    safeGameCallback(socket, payload.gameId, game => {
      skipAction(game)
      emitAction(io.to(payload.gameId), sendGame(game))
    })
  }),
  ...createReducer(reqPlayRole, payload => {
    safeGameCallback(socket, payload.gameId, game => {
      playRole(game, payload)
      emitAction(io.to(payload.gameId), sendGame(game))
    })
  }),
  ...createReducer(reqPlayCleanup, payload => {
    safeGameCallback(socket, payload.gameId, game => {
      playCleanUp(game, payload.cards)
      emitAction(io.to(payload.gameId), sendGame(game))
    })
  }),
})

export default gameStateReducers
