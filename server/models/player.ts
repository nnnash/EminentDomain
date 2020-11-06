import {times} from 'lodash'

import {Action, Card, ExploredPlanet, Planet, Player, PlayerStatus} from '@types'
import {getPlayerDecks, takeCards} from './decks'
import {getAddedPlanet, setPlanetOccupied} from './planets'
import {getPlanetColonizeCost, getPlanetEmpower} from '../../common/utils'

const CAPACITY = 5

const removePlayedCards = (type: Card, amount: number, cards: Player['cards']) => {
  if (amount < 1) return
  cards.hand = cards.hand.reduce<Array<Card>>((acc, item) => {
    if (amount === 0 || item !== type) return [...acc, item]
    amount--
    return acc
  }, [])
}

export const createPlayer = (name: string, id: string, planet: Planet): Player => ({
  id,
  capacity: CAPACITY,
  status: PlayerStatus.in,
  name,
  cards: getPlayerDecks(CAPACITY),
  points: 0,
  planets: {
    // occupied: [],
    occupied: [setPlanetOccupied(planet as ExploredPlanet)], // TODO return previous one
    explored: [getAddedPlanet(planet)],
  },
  // spaceships: 0,
  spaceships: 2, // TODO return previous one
  coloniesDiscount: 0,
})

export const playPoliticsAction = (player: Player, card: Card, index: number) => {
  player.cards.hand[index] = card
}

export const playEnvoyAction = ({cards}: Player, index: number) => {
  cards.hand.splice(index, 1)
  takeCards(cards, 2)
}

export const playEnvoyRole = (player: Player, planet: Planet, amount: number) => {
  player.planets.explored.push(getAddedPlanet(planet))
  const byPlanet = getPlanetEmpower(player, Action.envoy)
  removePlayedCards(Card.envoy, amount - byPlanet - 1, player.cards)
}

const occupyPlanet = (player: Player, planetIndex: number) => {
  const planets = player.planets
  const activePlanet = player.planets.explored[planetIndex]
  planets.occupied.push(setPlanetOccupied(activePlanet))
  planets.explored.splice(planetIndex, 1)
  player.points += activePlanet.points
  if (activePlanet.cardCapacity) player.capacity++
  if (activePlanet.action === Action.colonize) player.coloniesDiscount++
}

interface ColonizeParams {
  player: Player
  planetIndex: number
  cardIndex?: number
  coloniesAmount?: number
}
export const playColonize = ({cardIndex, coloniesAmount, planetIndex, player}: ColonizeParams) => {
  const {
    planets: {explored},
    cards,
  } = player
  const active = explored[planetIndex]
  if (getPlanetColonizeCost(active, player) <= active.colonies) {
    occupyPlanet(player, planetIndex)
    cards.pile = cards.pile.concat(times(active.colonies + 1, () => Card.colonize))
  } else {
    active.colonies += coloniesAmount || 1
  }
  if (cardIndex !== undefined) cards.hand.splice(cardIndex, 1)
  else if (coloniesAmount !== undefined) removePlayedCards(Card.colonize, coloniesAmount - 1, cards)
}

interface WarfareParams {
  player: Player
  planetIndex?: number
  cardIndex?: number
  fighterAmount?: number
}
export const playWarfare = ({cardIndex, fighterAmount, planetIndex, player}: WarfareParams) => {
  if (planetIndex === undefined) {
    player.spaceships += fighterAmount || 1
  } else {
    const activePlanet = player.planets.explored[planetIndex]
    occupyPlanet(player, planetIndex)
    player.spaceships -= activePlanet.cost.warfare
  }
  player.cards.pile = player.cards.pile.concat(times(fighterAmount || 1, () => Card.warfare))
  if (cardIndex !== undefined) player.cards.hand.splice(cardIndex, 1)
  else if (fighterAmount) {
    const byPlanet = getPlanetEmpower(player, Action.warfare)
    removePlayedCards(Card.warfare, fighterAmount - byPlanet - 1, player.cards)
  }
}

interface IndustryParams {
  player: Player
  cardIndex?: number
  amount?: number
  isProduction: boolean
}
export const playIndustry = ({amount, cardIndex, player, isProduction}: IndustryParams) => {
  const planets = player.planets.occupied
  let i = 0,
    actions = amount || 1
  while (i < planets.length && actions > 0) {
    const planet = planets[i]
    planet.production.forEach(planetProd => {
      if (planetProd.produced === !isProduction && actions > 0) {
        planetProd.produced = isProduction
        if (!isProduction) player.points++
        actions--
      }
    })
    i++
  }
  player.cards.pile = player.cards.pile.concat(times(amount || 1, () => Card.industry))
  if (cardIndex !== undefined) player.cards.hand.splice(cardIndex, 1)
  else if (amount) {
    const byPlanets = getPlanetEmpower(player, isProduction ? Action.produce : Action.sell)
    removePlayedCards(Card.industry, amount - byPlanets - 1, player.cards)
  }
}
