import socketIO, {Socket} from 'socket.io'

import {createGame, getGames} from '@actions/lobby'
import {State, getGame} from '../models'
import {createReducer} from './utils'

const lobbyStateReducers = (io: ReturnType<typeof socketIO>, socket: Socket) => ({
  ...createReducer(createGame.request, ({playerName, gameName}) => {
    const newGame = getGame(gameName, playerName)
    State.games = {...State.games, [newGame.id]: newGame}
    socket.emit(
      'action',
      getGames.success(
        Object.values(State.games).map(game => ({
          ...game,
          players: Object.keys(game.players).length,
        })),
      ),
    )
    socket.emit('action', createGame.success({...newGame, players: Object.keys(newGame.players).length}))
  }),
})

export default lobbyStateReducers
