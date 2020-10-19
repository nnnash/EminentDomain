import React from 'react'
import {View, Image, ImageSourcePropType, StyleProp, ViewStyle} from 'react-native'
import EStyle from 'react-native-extended-stylesheet'

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

interface IconProps {
  color: string
  image: ImageSourcePropType
  style?: StyleProp<ViewStyle>
  size?: 'big' | 'middle'
  width?: number
}
const Icon: React.FC<IconProps> = ({image, size, color, style, width = 70}) => {
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
        <Image source={image} style={{height: '70%', width: '70%'}} />
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
