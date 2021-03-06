import React from 'react'
import {Image, ImageStyle, StyleProp} from 'react-native'
import EStyle from 'react-native-extended-stylesheet'

const styles = EStyle.create({
  $size: 26,
  root: {
    height: '$size',
    width: '$size',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'white',
    shadowOpacity: 1,
    shadowOffset: {
      height: -1,
    },
    shadowRadius: 2,
  },
})

const FighterIcon: React.FC<{style?: StyleProp<ImageStyle>}> = ({style}) => (
  <Image source={require('../../../img/aircraft.png')} style={[styles.root, style]} />
)

export default FighterIcon
