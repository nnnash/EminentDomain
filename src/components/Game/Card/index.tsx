import React from 'react'
import {shallowEqual, useSelector} from 'react-redux'
import {Animated, View} from 'react-native'
import EStyle from 'react-native-extended-stylesheet'

import {Card as TCard, Phase} from '@types'
import CardContent from './CardContent'
import PannedCard from './PannedCard'
import {useYourTurn} from '../../../utils'
import {GlobalState} from '@reducers/index'

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
  const {
    game: {playersPhase, activePlayer, players},
    ui: {activePolitics},
  } = useSelector<GlobalState, GlobalState>(s => s, shallowEqual)
  const width = isBoard ? 90 : 142
  const height = width * 1.4
  const rootStyle = {
    width,
    height,
    marginLeft: index && !!margin ? margin : 0,
  }
  const isYourTurn = useYourTurn()
  const getIsActive = () => {
    const player = players[activePlayer]
    if (!isYourTurn) return false
    if (activePolitics !== undefined) return isBoard || type === TCard.politics
    if (playersPhase === Phase.action && isBoard) return false
    if (playersPhase === Phase.role && !isBoard) return false
    switch (type) {
      case TCard.industry:
        return !!player.planets.occupied.length
      case TCard.colonize:
        return !!player.planets.explored.length
      default:
        return true
    }
  }
  const isActive = getIsActive()

  return (
    <Animated.View style={[styles.root, rootStyle]}>
      {isBoard && (
        <View style={styles.dum}>
          <CardContent type={type} width={width} />
        </View>
      )}
      {isActive ? (
        <PannedCard type={type} height={height} width={width} isBoard={isBoard} index={index || 0} />
      ) : (
        <CardContent type={type} width={width} />
      )}
    </Animated.View>
  )
}

export default Card
