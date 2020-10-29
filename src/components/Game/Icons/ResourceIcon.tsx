import React from 'react'
import {View, Image, ImageSourcePropType, StyleProp, ViewStyle} from 'react-native'
import EStyle from 'react-native-extended-stylesheet'

import {Resource} from '@types'

const styles = EStyle.create({
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    shadowColor: 'white',
    shadowOpacity: 1,
    shadowRadius: 2,
    shadowOffset: {
      height: 0,
    },
    overflow: 'hidden',
    padding: 2,
  },
  wrapper: {
    $size: 24,
    height: '$size',
    width: '$size',
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: '$size / 2',
  },
  icon: {
    shadowColor: 'black',
    shadowOpacity: 1,
    shadowOffset: {
      height: 0,
    },
    $size: '75%',
    width: '$size',
    height: '$size',
  },
})

const resourceProps: Record<Resource, {icon: ImageSourcePropType; color: string}> = {
  [Resource.wheat]: {
    icon: require('../../../img/wheat.png'),
    color: '#9CB371',
  },
  [Resource.coal]: {
    icon: require('../../../img/coal.png'),
    color: '#A08FC5',
  },
  [Resource.water]: {
    icon: require('../../../img/drop.png'),
    color: '#5C89AF',
  },
  [Resource.iron]: {
    icon: require('../../../img/mineral.png'),
    color: '#8f533e',
  },
}

export interface IconProps {
  resource: Resource
  style?: StyleProp<ViewStyle>
}
const ResourceIcon: React.FC<IconProps> = ({resource, style}) => {
  const {icon, color} = resourceProps[resource]
  return (
    <View style={[styles.centered, styles.container, style]}>
      <View
        style={[
          styles.centered,
          styles.wrapper,
          {
            backgroundColor: color,
          },
        ]}>
        <Image source={icon} style={styles.icon} />
      </View>
    </View>
  )
}

export default ResourceIcon
