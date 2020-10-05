import {v4} from 'uuid'
import {pick, nativeMath} from 'random-js'

import {Card, Game, GameStage, Planet} from '@types'
import {createPlayer} from './player'
import {getStartPlanets} from './planets'

export const createGame = (gameName: string, hostName: string, hostId: string): Game => {
  const startPlanets = getStartPlanets()
  const player = createPlayer(hostName, hostId, startPlanets.pop() as Planet)
  return {
    stage: GameStage.new,
    name: gameName,
    id: v4(),
    players: {
      [player.id]: player,
    },
    startPlanets,
    cards: {
      [Card.attack]: 16,
      [Card.colonization]: 20,
      [Card.industry]: 16,
      [Card.search]: 20,
    },
    activePlayer: player.id,
  }
}

export const startGame = (game: Game) => {
  game.stage = GameStage.inPlay
  const playersIds = Object.keys(game.players)
  game.activePlayer = pick(nativeMath, playersIds)
  game.cards = {
    [Card.attack]: game.cards[Card.attack] - playersIds.length,
    [Card.colonization]: game.cards[Card.colonization] - playersIds.length,
    [Card.industry]: game.cards[Card.industry] - playersIds.length,
    [Card.search]: game.cards[Card.search] - playersIds.length,
  }
}
