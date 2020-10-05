import socketIO, {Socket} from 'socket.io'

import {getGame, startGame} from '@actions/game'
import {State, startGame as sg} from '../models'
import {createReducer} from './utils'

const gameStateReducers = (io: ReturnType<typeof socketIO>, socket: Socket) => ({
  ...createReducer(getGame.request, gameId => {
    const game = State.games[gameId]
    socket.emit('action', game ? getGame.success(game) : getGame.failure())
  }),
  ...createReducer(startGame.request, gameId => {
    const game = State.games[gameId]
    if (!game) {
      socket.emit('action', startGame.failure())
    } else {
      sg(game)
      io.to(gameId).emit('action', getGame.success(game))
    }
  }),
})

export default gameStateReducers
