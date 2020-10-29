import React, {Dispatch, useEffect, useRef} from 'react'
import {Animated} from 'react-native'
import {shallowEqual, useDispatch, useSelector} from 'react-redux'
import EStyle from 'react-native-extended-stylesheet'
import {PanGestureHandler, PanGestureHandlerStateChangeEvent, State} from 'react-native-gesture-handler'

import {Action, BoardCard, Card as TCard, Game} from '@types'
import CardContent from './CardContent'
import {RootAction} from '@actions/index'
import {setColonizeActive, setIndustryActive, setPoliticsActive, setWarfareActive} from '@actions/ui'
import {GlobalState} from '@reducers/index'
import {reqPlayAction} from '@actions/game'

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

const actionCallbacks = (type: TCard, dispatch: Dispatch<RootAction>, gameId: Game['id'], index: number) => {
  switch (type) {
    case TCard.politics:
      dispatch(setPoliticsActive(index))
      break
    case TCard.envoy:
      dispatch(reqPlayAction({type: Action.envoy, gameId, cardIndex: index}))
      break
    case TCard.colonize:
      dispatch(setColonizeActive(index))
      break
    case TCard.warfare:
      dispatch(setWarfareActive(index))
      break
    case TCard.industry:
      dispatch(setIndustryActive(index))
      break
    default:
  }
}

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
    game: {id},
  } = useSelector<GlobalState, GlobalState>(s => s, shallowEqual)
  const {translate, onPanGestureEvent, touchY, mult} = useCardTranslate(!!isBoard)
  const onPanHandlerStateChange = (event: PanGestureHandlerStateChangeEvent) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      if (Math.abs(event.nativeEvent.translationY) >= MAX_TRANSLATE) {
        if (!isBoard) actionCallbacks(type, dispatch, id, index)
        else if (activePolitics !== undefined)
          dispatch(reqPlayAction({type: Action.politics, card: type as BoardCard, gameId: id, cardIndex: index}))
      } else Animated.spring(touchY, {toValue: 0, useNativeDriver: false}).start()
    }
  }
  useEffect(() => {
    touchY.setValue(0)
    // eslint-disable-next-line
  }, [clearFlag])
  const rootStyle = {width, height}

  return (
    <PanGestureHandler
      onGestureEvent={onPanGestureEvent}
      onHandlerStateChange={onPanHandlerStateChange}
      activeOffsetY={mult}
      failOffsetY={isBoard ? [0, 30] : [-30, 0]}
      failOffsetX={0}>
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
