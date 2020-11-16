import {Socket} from 'socket.io'

import {Planet, PlayerStatus} from '@types'
import {reqCreateGame, reqJoinGame, reqRejoinGame, reqLeaveGame, sendShortGameToJoin, sendGames} from '@actions/lobby'
import {sendGame} from '@actions/game'
import {addPlayer, createGame, createPlayer, State} from '../models'
import {createReducer, getShortGame, IOType, emitAction, safeGameCallback} from './utils'

const lobbyStateReducers = (io: IOType, socket: Socket) => ({
  ...createReducer(reqCreateGame, ({playerName, gameName, playerId}) => {
    const newGame = createGame(gameName, playerName, playerId)
    State.games = {...State.games, [newGame.id]: newGame}
    emitAction(io, sendGames(Object.values(State.games).map(getShortGame)))
    emitAction(socket, sendShortGameToJoin(getShortGame(newGame)))
    socket.join(newGame.id)
  }),
  ...createReducer(reqJoinGame, ({gameId, playerId, playerName}) => {
    safeGameCallback(socket, gameId, game => {
      addPlayer(game, createPlayer(playerName, playerId, game.startPlanets.pop() as Planet))
      emitAction(io, sendGames(Object.values(State.games).map(getShortGame)))
      emitAction(io.to(gameId), sendGame(game))
      emitAction(socket, sendShortGameToJoin(getShortGame(game)))
      socket.join(game.id)
    })
  }),
  ...createReducer(reqRejoinGame, ({gameId, playerId}) => {
    safeGameCallback(socket, gameId, game => {
      game.players[playerId].status = PlayerStatus.in
      emitAction(io.to(gameId), sendGame(game))
      emitAction(socket, sendShortGameToJoin(getShortGame(game)))
      socket.join(game.id)
    })
  }),
  ...createReducer(reqLeaveGame, ({playerId, gameId}) => {
    safeGameCallback(socket, gameId, game => {
      const activePlayer = game.players[playerId]
      if (activePlayer) {
        activePlayer.status = PlayerStatus.away
        emitAction(io.to(gameId), sendGame(game))
      }
      socket.leave(gameId)
    })
  }),
})

export default lobbyStateReducers
