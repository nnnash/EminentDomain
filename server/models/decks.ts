import {nativeMath, shuffle} from 'random-js'
import {times, take, slice} from 'lodash'

import {Card, Player} from '@types'

export const getPlayerDecks = (capacity: number): Player['cards'] => {
  const deck = shuffle(nativeMath, [
    ...times(2, () => Card.colonize),
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

export const fixDeck = (cards: Player['cards']) => {
  cards.deck = cards.deck.concat(shuffle(nativeMath, cards.pile))
  cards.pile = []
}

export const takeCards = (cards: Player['cards'], amount: number) => {
  if (cards.deck.length < amount) fixDeck(cards)
  cards.hand = cards.hand.concat(take(cards.deck, amount))
  cards.deck = slice(cards.deck, amount)
}
