import React from 'react'
import {Animated, View} from 'react-native'
import EStyle from 'react-native-extended-stylesheet'

import {Card as TCard} from '@types'
import CardContent from './CardContent'
import PannedCard from './PannedCard'
import {useYourTurn} from '../../../utils'

const styles = EStyle.create({
  root: {
    borderRadius: 8,
  },
  dum: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    borderWidth: 1,
    borderRadius: 8,
  },
})

interface CardProps {
  type: TCard
  margin?: Animated.AnimatedDivision
  index?: number
  isBoard?: boolean
}
const Card: React.FC<CardProps> = ({type, index, margin, isBoard}) => {
  const width = isBoard ? 90 : 142
  const height = width * 1.4
  const rootStyle = {
    width,
    height,
    marginLeft: index && !!margin ? margin : 0,
  }
  const isActive = useYourTurn()

  return (
    <Animated.View style={[styles.root, rootStyle]}>
      {isBoard && (
        <View style={styles.dum}>
          <CardContent type={type} width={width} />
        </View>
      )}
      {isActive ? (
        <PannedCard type={type} height={height} width={width} isBoard={isBoard} />
      ) : (
        <CardContent type={type} width={width} />
      )}
    </Animated.View>
  )
}

export default Card
