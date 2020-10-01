import socketIO from 'socket.io'
import {Server} from 'http'

import {State} from '../models'
import {RootAction} from '@actions/index'
import {getGames} from '@actions/lobby'
import lobbyStateReducers from './lobby'
import gameStateReducers from './game'

const socketInit = (server: Server) => {
  const io = socketIO(server)

  io.on('connection', socket => {
    const reducers = {
      ...lobbyStateReducers(io, socket),
      ...gameStateReducers(io, socket),
    }

    socket.emit(
      'action',
      getGames.success(
        Object.values(State.games).map(game => ({
          ...game,
          players: Object.keys(game.players).length,
        })),
      ),
    )

    socket.on('action', (action: RootAction) => {
      if (!reducers[action.type]) return
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      reducers[action.type](action.payload)
    })
  })
}

export default socketInit
