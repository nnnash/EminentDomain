import React, {useEffect, useRef} from 'react'
import {Animated} from 'react-native'
import {shallowEqual, useDispatch, useSelector} from 'react-redux'
import EStyle from 'react-native-extended-stylesheet'
import {PanGestureHandler, PanGestureHandlerStateChangeEvent, State} from 'react-native-gesture-handler'

import {Action, BoardCard, Card as TCard, Phase} from '@types'
import {addCardForCleanup} from '@actions/ui'
import {playCardAction, playCardRole, reqPlayAction} from '@actions/game'
import {GlobalState} from '@reducers/index'

import CardContent from './CardContent'

const styles = EStyle.create({
  root: {
    borderRadius: '$cardCorner',
    shadowColor: 'white',
    shadowOffset: {
      height: 0,
    },
    shadowRadius: 8,
    shadowOpacity: 1,
  },
})

const MAX_TRANSLATE = 80
const useCardTranslate = (isBoard: boolean) => {
  const mult = isBoard ? 1 : -1
  const {farPoint, maxTranslate, spring} = {
    farPoint: 1000 * mult,
    maxTranslate: MAX_TRANSLATE * mult,
    spring: -10 * mult,
  }
  const inputRange = isBoard ? [-farPoint, spring, maxTranslate, farPoint] : [farPoint, maxTranslate, spring, -farPoint]
  const outputRange = isBoard
    ? [spring, spring, maxTranslate, maxTranslate]
    : [maxTranslate, maxTranslate, spring, spring]
  const touchY = useRef(new Animated.Value(0)).current
  const onPanGestureEvent = Animated.event([{nativeEvent: {translationY: touchY}}], {
    useNativeDriver: false,
  })
  const translate = touchY.interpolate({inputRange, outputRange})
  return {onPanGestureEvent, translate, touchY, mult}
}

interface CardProps {
  height: number
  index: number
  isBoard?: boolean
  type: TCard
  width: number
}
const PannedCard: React.FC<CardProps> = ({type, width, height, isBoard, index}) => {
  const dispatch = useDispatch()
  const {
    ui: {activePolitics, clearFlag},
    game,
  } = useSelector<GlobalState, GlobalState>(s => s, shallowEqual)
  const {translate, onPanGestureEvent, touchY, mult} = useCardTranslate(!!isBoard)
  const onPanHandlerStateChange = (event: PanGestureHandlerStateChangeEvent) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      if (Math.abs(event.nativeEvent.translationY) >= MAX_TRANSLATE) {
        if (game.playersPhase === Phase.action) {
          if (!isBoard) dispatch(playCardAction({cardIndex: index, cardType: type}))
          else if (activePolitics !== undefined)
            dispatch(
              reqPlayAction({
                type: Action.politics,
                card: type as BoardCard,
                gameId: game.id,
                cardIndex: activePolitics,
              }),
            )
        } else if (game.playersPhase === Phase.role) {
          dispatch(playCardRole(type as BoardCard))
        } else {
          dispatch(addCardForCleanup(index))
        }
      } else Animated.spring(touchY, {toValue: 0, useNativeDriver: false}).start()
    }
  }
  useEffect(() => {
    touchY.setValue(0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clearFlag])
  const rootStyle = {width, height}

  return (
    <PanGestureHandler
      onGestureEvent={onPanGestureEvent}
      onHandlerStateChange={onPanHandlerStateChange}
      activeOffsetY={10 * mult}
      failOffsetY={isBoard ? [0, 30] : [-30, 0]}
      failOffsetX={[-40, 40]}>
      <Animated.View
        style={[
          styles.root,
          rootStyle,
          {
            transform: [
              {
                translateY: translate,
              },
            ],
          },
        ]}>
        <CardContent type={type} width={width} />
      </Animated.View>
    </PanGestureHandler>
  )
}

export default PannedCard
