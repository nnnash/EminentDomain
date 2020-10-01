import socketIO, {Socket} from 'socket.io'

import {getGame} from '@actions/game'
import {State} from '../models'
import {createReducer} from './utils'

const gameStateReducers = (io: ReturnType<typeof socketIO>, socket: Socket) => ({
  ...createReducer(getGame.request, gameId => {
    const game = State.games[gameId]
    socket.emit('action', game ? getGame.success(game) : getGame.failure())
  }),
})

export default gameStateReducers
