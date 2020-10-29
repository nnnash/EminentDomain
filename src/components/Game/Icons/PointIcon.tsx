import React from 'react'
import {Text, ImageBackground, StyleProp, ImageStyle} from 'react-native'
import EStyle from 'react-native-extended-stylesheet'

const styles = EStyle.create({
  $size: 26,
  root: {
    height: '$size',
    width: '$size',
    alignItems: 'center',
    justifyContent: 'center',
  },
  number: {
    fontSize: 10,
    fontWeight: '900',
    marginLeft: 2,
    marginTop: 2,
    color: 'rgb(73,16,11)',
  },
})

export interface IconProps {
  amount?: number
  style?: StyleProp<ImageStyle>
}
const PointIcon: React.FC<IconProps> = ({amount = 1, style}) => (
  <ImageBackground source={require('../../../img/point.png')} style={[styles.root, style]}>
    <Text style={styles.number}>{amount}</Text>
  </ImageBackground>
)

export default PointIcon
