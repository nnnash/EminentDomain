import {v4} from 'uuid'
import {nativeMath, pick} from 'random-js'

import {Card, Game, GameStatus, Phase, Planet, Player} from '@types'
import {createPlayer} from './player'
import {getStartPlanets} from './planets'

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
  game.activePlayer = pick(nativeMath, playersIds)
}
