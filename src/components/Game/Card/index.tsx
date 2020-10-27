import React, {useRef} from 'react'
import {Animated, View} from 'react-native'
import EStyle from 'react-native-extended-stylesheet'
import {PanGestureHandler, PanGestureHandlerStateChangeEvent, State} from 'react-native-gesture-handler'

import {Card as TCard} from '@types'
import CardContent from './CardContent'
import {useYourTurn} from '../../../utils'

const styles = EStyle.create({
  root: {
    borderWidth: 1,
    borderRadius: 8,
  },
  dum: {
    position: 'absolute',
    top: -1,
    bottom: -1,
    left: -1,
    right: -1,
    borderWidth: 1,
    borderRadius: 8,
  },
})

const MAX_TRANSLATE = 100
interface CardProps {
  type: TCard
  margin?: Animated.AnimatedDivision
  index?: number
  isBoard?: boolean
}
const Card: React.FC<CardProps> = ({type, index, margin, isBoard}) => {
  const width = isBoard ? 90 : 142
  const height = width * 1.4

  const touchY = useRef(new Animated.Value(0)).current
  const onPanGestureEvent = Animated.event([{nativeEvent: {translationY: touchY}}], {
    useNativeDriver: false,
  })
  const translate = touchY.interpolate({
    inputRange: [-1000, -MAX_TRANSLATE, 10, 1000],
    outputRange: [-MAX_TRANSLATE, -MAX_TRANSLATE, 10, 10],
  })
  const onPanHandlerStateChange = (event: PanGestureHandlerStateChangeEvent) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      if (event.nativeEvent.translationY <= -100) {
        console.log('event', event)
      } else Animated.spring(touchY, {toValue: 0, useNativeDriver: false}).start()
    }
  }
  const rootStyle = {
    width,
    height,
    marginLeft: index && !!margin ? margin : 0,
  }
  const isActive = useYourTurn()
  if (!isActive)
    return (
      <View style={[styles.root, rootStyle]}>
        <CardContent type={type} width={width} />
      </View>
    )

  return (
    <PanGestureHandler
      onGestureEvent={onPanGestureEvent}
      onHandlerStateChange={onPanHandlerStateChange}
      activeOffsetY={-1}
      failOffsetY={[-30, 0]}
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
        {isBoard && (
          <Animated.View
            style={[
              styles.dum,
              {
                transform: [{translateY: Animated.multiply(translate, new Animated.Value(-1))}],
              },
            ]}>
            <CardContent type={type} width={width} />
          </Animated.View>
        )}
        <CardContent type={type} width={width} />
      </Animated.View>
    </PanGestureHandler>
  )
}

export default Card
