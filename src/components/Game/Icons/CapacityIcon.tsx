import React from 'react'
import {Text, Image} from 'react-native'
import EStyle from 'react-native-extended-stylesheet'

const styles = EStyle.create({
  $size: 26,
  root: {
    height: '$size',
    width: '$size * 2',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 18,
    fontWeight: '800',
    color: '$textColor',
    shadowColor: 'white',
    shadowOpacity: 1,
    shadowOffset: {
      height: -1,
    },
    shadowRadius: 2,
    transform: [{translateY: -4}],
  },
  img: {
    $size: 28,
    height: '$size',
    width: '$size',
    transform: [{translateY: 8}],
  },
})

export interface IconProps {
  amount?: number
}
const CapacityIcon: React.FC<IconProps> = ({amount = 1}) => (
  <Text style={styles.root}>
    <Image source={require('../../../img/deck.png')} style={styles.img} /> +{amount}
  </Text>
)

export default CapacityIcon
