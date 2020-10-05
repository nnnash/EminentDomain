import {Player, PlayerStatus} from '@types'
import {getDecks} from './decks'

const CAPACITY = 5

export const createPlayer = (name: string, id: string): Player => ({
  id,
  capacity: CAPACITY,
  status: PlayerStatus.in,
  name,
  cards: getDecks(CAPACITY),
  points: 0,
  planets: {
    occupied: [],
    explored: [],
  },
})
