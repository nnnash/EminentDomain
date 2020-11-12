import {Action, Card, Planet, Player} from '@types'
import {cardProps} from './cardProps'

export const getPlanetEmpower = (player: Player, type: Action) =>
  player.planets.occupied.filter(p => p.action === type).length
export const getCardEmpower = (player: Player, type: Action) =>
  player.cards.hand.filter(c => cardProps[c].actions.includes(type)).length

export const getEmpower = (player: Player, type: Action) =>
  getCardEmpower(player, type) + getPlanetEmpower(player, type)

const cardByAction: Record<Action, Card> = Object.entries(cardProps).reduce((acc, [card, item]) => {
  item.actions.forEach(a => {
    acc = {...acc, [a]: card}
  })
  return acc
}, {} as Record<Action, Card>)

export const getCardByAction = (action: Action): Card => cardByAction[action]

export const getPlanetColonizeCost = ({cost}: Planet, {coloniesDiscount}: Player) =>
  Math.max(cost.colonize - coloniesDiscount)
