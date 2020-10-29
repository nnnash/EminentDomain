import {Card, ExploredPlanet, Planet, Player, PlayerStatus} from '@types'
import {getPlayerDecks, takeCards} from './decks'
import {getAddedPlanet, setPlanetOccupied} from './planets'
import {times} from 'lodash'

const CAPACITY = 5

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
  spaceships: 0,
})

export const playPoliticsAction = (player: Player, card: Card, index: number) => {
  player.cards.hand[index] = card
}

export const playEnvoyAction = ({cards}: Player, index: number) => {
  cards.hand.splice(index, 1)
  takeCards(cards, 2)
}

export const playColonizeAction = (player: Player, planetIndex: number, cardIndex: number) => {
  const {planets, cards} = player
  const {explored} = planets
  const active = explored[planetIndex]
  if (active.cost.colonize === active.colonies) {
    planets.occupied.push(setPlanetOccupied(active))
    planets.explored.splice(planetIndex, 1)
    player.points += active.points
    cards.pile = cards.pile.concat(times(active.colonies, () => Card.colonize))
  } else {
    active.colonies++
  }
  cards.hand.splice(cardIndex, 1)
}

export const playWarfareAction = (player: Player, planetIndex: number | undefined, cardIndex: number) => {
  if (planetIndex === undefined) {
    player.spaceships++
  } else {
    const activePlanet = player.planets.explored[planetIndex]
    player.planets.occupied.push(setPlanetOccupied(activePlanet))
    player.planets.explored.splice(planetIndex, 1)
    player.points += activePlanet.points
    player.spaceships -= activePlanet.cost.warfare
  }
  player.cards.hand.splice(cardIndex, 1)
}

export const playProduceAction = (player: Player, cardIndex: number) => {
  const planet = player.planets.occupied.find(pl => pl.production.find(pr => !pr.produced))
  if (!planet) return
  planet.production.some(pr => {
    if (!pr.produced) pr.produced = true
    else return false
    return true
  })
  player.cards.hand.splice(cardIndex, 1)
}

export const playSellAction = (player: Player, cardIndex: number) => {
  const planet = player.planets.occupied.find(pl => pl.production.find(pr => pr.produced))
  if (!planet) return
  planet.production.some(pr => {
    if (pr.produced) {
      pr.produced = false
      player.points++
    } else return false
    return true
  })
  player.cards.hand.splice(cardIndex, 1)
}
