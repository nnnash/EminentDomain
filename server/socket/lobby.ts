import socketIO, {Socket} from 'socket.io'

import {createGame, getGames, joinGame} from '@actions/lobby'
import {getGame as gg} from '@actions/game'
import {State, getGame, getPlayer} from '../models'
import {createReducer, getShortGame} from './utils'

const lobbyStateReducers = (io: ReturnType<typeof socketIO>, socket: Socket) => ({
  ...createReducer(createGame.request, ({playerName, gameName, playerId}) => {
    const newGame = getGame(gameName, playerName, playerId)
    State.games = {...State.games, [newGame.id]: newGame}
    io.emit('action', getGames.success(Object.values(State.games).map(getShortGame)))
    socket.emit('action', createGame.success(getShortGame(newGame)))
    socket.join(newGame.id)
  }),
  ...createReducer(joinGame.request, ({gameId, playerId, playerName}) => {
    const game = State.games[gameId]
    if (!game) {
      socket.emit('action', joinGame.failure())
    } else {
      game.players = {...game.players, [playerId]: getPlayer(playerName, playerId)}
      io.emit('action', getGames.success(Object.values(State.games).map(getShortGame)))
      io.to(gameId).emit('action', gg.success(game))
      socket.emit('action', joinGame.success(getShortGame(game)))
      socket.join(game.id)
    }
  }),
})

export default lobbyStateReducers
