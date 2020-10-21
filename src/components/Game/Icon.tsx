import React from 'react'
import {View, Image, StyleProp, ViewStyle} from 'react-native'
import EStyle from 'react-native-extended-stylesheet'

import {Action} from '@types'
import {actionProps} from './cardConfigs'

const styles = EStyle.create({
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    shadowColor: 'black',
    shadowOpacity: 1,
    overflow: 'hidden',
  },
  wrapper: {
    borderColor: 'white',
  },
})

export interface IconProps {
  action: Action
  style?: StyleProp<ViewStyle>
  size?: 'big' | 'middle'
  width?: number
}
const Icon: React.FC<IconProps> = ({action, size, style, width = 70}) => {
  const {icon, color} = actionProps[action]
  const iconSize = size === 'big' ? width : width / (size === 'middle' ? 1.3 : 3.2)
  const wrapperPadding = width / (size ? 3.5 : 17.5)
  return (
    <View
      style={[
        style,
        styles.centered,
        styles.container,
        {
          height: iconSize + wrapperPadding,
          width: iconSize + wrapperPadding,
          shadowOffset: {
            height: 1,
          },
        },
      ]}>
      <View
        style={{
          ...styles.centered,
          ...styles.wrapper,
          height: iconSize,
          width: iconSize,
          borderRadius: iconSize / 2,
          backgroundColor: color,
          borderWidth: size ? 4 : 2,
        }}>
        <Image source={icon} style={{height: '70%', width: '70%'}} />
      </View>
    </View>
  )
}

interface DoubleIconProps {
  icon1: IconProps
  icon2: IconProps
  middle?: boolean
}
export const DoubleIcon: React.FC<DoubleIconProps> = ({icon1, icon2, middle}) => {
  const size = middle ? 'middle' : undefined
  return (
    <View
      style={{
        flexDirection: !middle ? 'column' : 'row',
      }}>
      <Icon {...icon1} size={size} />
      <Icon {...icon2} size={size} style={size ? {marginLeft: -25} : {marginTop: -10}} />
    </View>
  )
}

export default Icon
