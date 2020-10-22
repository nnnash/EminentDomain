import {ImageSourcePropType} from 'react-native'

import {PlanetType} from '@types'

export const planetProps: Record<PlanetType, ImageSourcePropType> = {
  [PlanetType.advanced]: require('../../img/advanced.png'),
  [PlanetType.metal]: require('../../img/metal.png'),
  [PlanetType.fertile]: require('../../img/fertile.png'),
  [PlanetType.prestige]: require('../../img/prestige.png'),
  [PlanetType.utopia]: require('../../img/utopia.png'),
}
