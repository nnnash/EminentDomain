import {v4} from 'uuid'

import {Action, Card, Game, GameStatus, Phase, Planet, Player} from '@types'
import {
  createPlayer,
  playColonizeAction,
  playEnvoyAction,
  playPoliticsAction,
  playProduceAction,
  playSellAction,
  playWarfareAction,
} from './player'
import {getStartPlanets} from './planets'
import {ActionPayload} from '@actions/game'

export const createGame = (gameName: string, hostName: string, hostId: string): Game => {
  const startPlanets = getStartPlanets()
  const player = createPlayer(hostName, hostId, startPlanets.pop() as Planet)
  return {
    status: GameStatus.new,
    name: gameName,
    id: v4(),
    players: {
      [player.id]: player,
    },
    startPlanets,
    cards: {
      [Card.warfare]: 15,
      [Card.colonize]: 18,
      [Card.industry]: 15,
      [Card.envoy]: 18,
    },
    activePlayer: player.id,
    playersPhase: Phase.action,
  }
}

export const addPlayer = (game: Game, player: Player) => {
  game.players = {
    ...game.players,
    [player.id]: player,
  }
  game.cards = {
    [Card.warfare]: game.cards[Card.warfare] - 1,
    [Card.colonize]: game.cards[Card.colonize] - 2,
    [Card.industry]: game.cards[Card.industry] - 2,
    [Card.envoy]: game.cards[Card.envoy] - 2,
  }
}

export const startGame = (game: Game) => {
  game.status = GameStatus.inPlay
  const playersIds = Object.keys(game.players)
  // game.activePlayer = pick(nativeMath, playersIds)
  game.activePlayer = playersIds[1] // TODO return the previous one
}

export const playAction = (game: Game, payload: ActionPayload) => {
  const activePlayer = game.players[game.activePlayer]
  switch (payload.type) {
    case Action.politics:
      playPoliticsAction(activePlayer, payload.card, payload.cardIndex)
      game.cards[payload.card] -= 1
      break
    case Action.envoy:
      playEnvoyAction(activePlayer, payload.cardIndex)
      break
    case Action.colonize:
      playColonizeAction(activePlayer, payload.planetIndex, payload.cardIndex)
      break
    case Action.warfare:
      playWarfareAction(activePlayer, payload.planetIndex, payload.cardIndex)
      break
    case Action.produce:
      playProduceAction(activePlayer, payload.cardIndex)
      break
    case Action.sell:
      playSellAction(activePlayer, payload.cardIndex)
      break
    default:
  }
  game.playersPhase = Phase.role
}
