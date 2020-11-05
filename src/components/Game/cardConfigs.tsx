import {ImageSourcePropType} from 'react-native'

import {Action} from '@types'

export * from '../../../common/cardProps'

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
