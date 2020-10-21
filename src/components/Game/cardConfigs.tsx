import {ImageSourcePropType} from 'react-native'

import {Action, Card as TCard, Card} from '@types'

type ActionConfig = {
  icon: ImageSourcePropType
  color: string
}
export const actionProps: Record<Action, ActionConfig> = {
  [Action.colonize]: {
    color: '#BC8635',
    icon: require('../../img/planet-earth.png'),
  },
  [Action.envoy]: {
    color: '#6C9648',
    icon: require('../../img/radar.png'),
  },
  [Action.warfare]: {
    color: '#9B3844',
    icon: require('../../img/arm-target.png'),
  },
  [Action.politics]: {
    color: '#6A6D4E',
    icon: require('../../img/temple.png'),
  },
  [Action.produce]: {
    color: '#B49C36',
    icon: require('../../img/factory.png'),
  },
  [Action.sell]: {
    color: '#4B2E79',
    icon: require('../../img/refresh.png'),
  },
}

type CardConfiig = {
  actions: Array<Action>
}
export const cardProps: Record<Card, CardConfiig> = {
  [TCard.envoy]: {
    actions: [Action.envoy],
  },
  [TCard.warfare]: {
    actions: [Action.warfare],
  },
  [TCard.politics]: {
    actions: [Action.politics],
  },
  [TCard.industry]: {
    actions: [Action.produce, Action.sell],
  },
  [TCard.colonize]: {
    actions: [Action.colonize],
  },
}
