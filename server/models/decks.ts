import {nativeMath, shuffle} from 'random-js'
import {times, take, slice} from 'lodash'

import {Card, Player} from '@types'

export const getPlayerDecks = (capacity: number): Player['cards'] => {
  const deck = shuffle(nativeMath, [
    ...times(2, () => Card.colonization),
    ...times(2, () => Card.industry),
    ...times(2, () => Card.envoy),
    Card.warfare,
    Card.politics,
  ])
  return {
    hand: take(deck, capacity),
    deck: slice(deck, capacity),
    pile: [],
  }
}
