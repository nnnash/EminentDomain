import {Planet, Player, PlayerStatus} from '@types'
import {getPlayerDecks} from './decks'
import {getAddedPlanet} from './planets'

const CAPACITY = 5

export const createPlayer = (name: string, id: string, planet: Planet): Player => ({
  id,
  capacity: CAPACITY,
  status: PlayerStatus.in,
  name,
  cards: getPlayerDecks(CAPACITY),
  points: 0,
  planets: {
    occupied: [],
    explored: [getAddedPlanet(planet)],
  },
  spaceships: 0,
})
