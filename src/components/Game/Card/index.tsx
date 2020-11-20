import React from 'react'
import {shallowEqual, useSelector} from 'react-redux'
import {Animated, View} from 'react-native'
import EStyle from 'react-native-extended-stylesheet'

import {BoardCard, Card as TCard, Phase} from '@types'
import {GlobalState} from '@reducers/index'
import CardContent from './CardContent'
import PannedCard from './PannedCard'
import {useUser, useYourTurn, useFadeInOut} from '../../../utils'
import {canProduceAmount, canSellAmount} from '../../../../common/actionsAlowed'

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
  arrow: {
    $size: 16,
    position: 'absolute',
    width: '$size',
    height: '$size',
    borderTopWidth: 8,
    borderLeftWidth: 8,
    borderColor: 'white',
  },
  arrowTop: {
    top: -20,
    left: 10,
    transform: [{rotate: '45deg'}],
  },
  arrowBottom: {
    bottom: -20,
    left: '45%',
    transform: [{rotate: '-135deg'}],
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
    game: {playersPhase, activePlayer, players, rolePlayer, planetsDeck, cards},
    ui: {activePolitics, activeColonize, activeIndustry, activeWarfare},
  } = useSelector<GlobalState, GlobalState>(s => s, shallowEqual)
  const width = isBoard ? 90 : 142
  const height = width * 1.4
  const rootStyle = {
    width,
    height,
    marginLeft: index && !!margin ? margin : 0,
  }
  const user = useUser()
  const isYourTurn = useYourTurn()
  const opacity = useFadeInOut()
  const getIsActive = () => {
    if (activeColonize || activeIndustry || activeWarfare) return false
    const player = players[activePlayer]
    if (!isYourTurn || (isYourTurn && playersPhase === Phase.role && rolePlayer !== user.id)) return false
    if (activePolitics !== undefined) return isBoard || type === TCard.politics
    if (playersPhase !== Phase.role && isBoard) return false
    if (playersPhase === Phase.role && !isBoard) return false
    if (playersPhase === Phase.cleanup) return !isBoard
    switch (type) {
      case TCard.industry:
        return !!canProduceAmount(player) || !!canSellAmount(player)
      case TCard.colonize:
        return !!player.planets.explored.length
      case TCard.envoy:
        return playersPhase !== Phase.role || !!planetsDeck.length
      default:
        return true
    }
  }
  const isActive = getIsActive()

  return (
    <Animated.View style={[styles.root, rootStyle]}>
      {isBoard && !!cards[type as BoardCard] && (
        <View style={styles.dum}>
          <CardContent type={type} width={width} />
        </View>
      )}
      {isActive ? (
        <>
          <Animated.View style={[styles.arrow, isBoard ? styles.arrowBottom : styles.arrowTop, {opacity}]} />
          <PannedCard type={type} height={height} width={width} isBoard={isBoard} index={index || 0} />
        </>
      ) : (
        <CardContent type={type} width={width} />
      )}
    </Animated.View>
  )
}

export default Card
