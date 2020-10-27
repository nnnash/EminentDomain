import React, {useRef} from 'react'
import {Animated} from 'react-native'
import EStyle from 'react-native-extended-stylesheet'
import {PanGestureHandler, PanGestureHandlerStateChangeEvent, State} from 'react-native-gesture-handler'

import {Card as TCard} from '@types'
import CardContent from './CardContent'

const styles = EStyle.create({
  root: {
    borderRadius: '$cardCorner',
  },
})

const MAX_TRANSLATE = 100
interface CardProps {
  type: TCard
  isBoard?: boolean
  height: number
  width: number
}
const PannedCard: React.FC<CardProps> = ({type, width, height}) => {
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
      if (event.nativeEvent.translationY <= -MAX_TRANSLATE) {
        console.log('event', event)
      } else Animated.spring(touchY, {toValue: 0, useNativeDriver: false}).start()
    }
  }
  const rootStyle = {
    width,
    height,
  }

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
        <CardContent type={type} width={width} />
      </Animated.View>
    </PanGestureHandler>
  )
}

export default PannedCard
