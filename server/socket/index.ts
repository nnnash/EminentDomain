import socketIO from 'socket.io'
import {Server} from 'http'
import {writeFileSync} from 'fs'
import {join} from 'path'

import {State} from '../models'
import {RootAction} from '@actions/index'
import {sendGames} from '@actions/lobby'
import {getShortGame} from './utils'
import lobbyStateReducers from './lobby'
import gameStateReducers from './game'
import {emitAction} from './utils'

const socketInit = (server: Server) => {
  const io = socketIO(server)

  io.on('connection', socket => {
    const reducers = {
      ...lobbyStateReducers(io, socket),
      ...gameStateReducers(io, socket),
    }

    emitAction(socket, sendGames(Object.values(State.games).map(getShortGame)))

    socket.on('action', (action: RootAction) => {
      if (!reducers[action.type]) return
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      reducers[action.type](action.payload)
      writeFileSync(join(__dirname, '../../..', 'state.json'), JSON.stringify(State))
    })
  })
}

export default socketInit
