import {v4} from 'uuid'

import {Player} from '@types'
import {getDecks} from './decks'

const CAPACITY = 5

export const getPlayer = (name: string): Player => ({
  id: v4(),
  capacity: CAPACITY,
  name,
  cards: getDecks(CAPACITY),
})
