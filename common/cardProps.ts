import {Action, Card} from '@types'

type CardConfig = {
  actions: Array<Action>
}
export const cardProps: Record<Card, CardConfig> = {
  [Card.envoy]: {
    actions: [Action.envoy],
  },
  [Card.warfare]: {
    actions: [Action.warfare],
  },
  [Card.politics]: {
    actions: [Action.politics],
  },
  [Card.industry]: {
    actions: [Action.produce, Action.sell],
  },
  [Card.colonize]: {
    actions: [Action.colonize],
  },
}
