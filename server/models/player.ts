import {Player} from '@types'
import {getDecks} from './decks'

const CAPACITY = 5

export const getPlayer = (name: string, id: string): Player => ({
  id,
  capacity: CAPACITY,
  name,
  cards: getDecks(CAPACITY),
})
