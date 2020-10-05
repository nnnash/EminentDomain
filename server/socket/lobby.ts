import socketIO, {Socket} from 'socket.io'

import {createGame as createGameAction, getGames, joinGame, leaveGame, rejoinGame} from '@actions/lobby'
import {getGame} from '@actions/game'
import {createGame, createPlayer, State} from '../models'
import {createReducer, getShortGame} from './utils'
import {PlayerStatus} from '@types'

const lobbyStateReducers = (io: ReturnType<typeof socketIO>, socket: Socket) => ({
  ...createReducer(createGameAction.request, ({playerName, gameName, playerId}) => {
    const newGame = createGame(gameName, playerName, playerId)
    State.games = {...State.games, [newGame.id]: newGame}
    io.emit('action', getGames.success(Object.values(State.games).map(getShortGame)))
    socket.emit('action', createGameAction.success(getShortGame(newGame)))
    socket.join(newGame.id)
  }),
  ...createReducer(joinGame.request, ({gameId, playerId, playerName}) => {
    const game = State.games[gameId]
    if (!game) {
      socket.emit('action', joinGame.failure())
    } else {
      game.players = {...game.players, [playerId]: createPlayer(playerName, playerId)}
      io.emit('action', getGames.success(Object.values(State.games).map(getShortGame)))
      io.to(gameId).emit('action', getGame.success(game))
      socket.emit('action', joinGame.success(getShortGame(game)))
      socket.join(game.id)
    }
  }),
  ...createReducer(rejoinGame.request, ({gameId, playerId}) => {
    const game = State.games[gameId]
    if (!game) {
      socket.emit('action', rejoinGame.failure())
    } else {
      game.players[playerId].status = PlayerStatus.in
      io.to(gameId).emit('action', getGame.success(game))
      socket.emit('action', rejoinGame.success(getShortGame(game)))
      socket.join(game.id)
    }
  }),
  ...createReducer(leaveGame, ({playerId, gameId}) => {
    const game = State.games[gameId]
    if (game) {
      game.players[playerId].status = PlayerStatus.away
      io.to(gameId).emit('action', getGame.success(game))
      socket.leave(gameId)
    }
  }),
})

export default lobbyStateReducers
