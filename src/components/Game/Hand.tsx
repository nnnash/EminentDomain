import React, {useRef, useState} from 'react'
import {Animated} from 'react-native'
import {shallowEqual, useSelector} from 'react-redux'
import EStyle from 'react-native-extended-stylesheet'
import {PinchGestureHandler, PinchGestureHandlerStateChangeEvent, State} from 'react-native-gesture-handler'

import {GlobalState} from '@reducers/index'
import {GameState} from '@reducers/game'
import {useUser} from '../../utils'
import Card from './Card'

const styles = EStyle.create({
  root: {
    flexDirection: 'row',
    marginTop: 10,
  },
})

const MIN_MARGIN = -110
const Hand: React.FC<{}> = () => {
  const {players} = useSelector<GlobalState, GameState>(state => state.game, shallowEqual)
  const user = useUser()
  const player = players[user.id]
  const baseScale = useRef(new Animated.Value(1)).current
  const pinchScale = useRef(new Animated.Value(1)).current
  const scale = Animated.multiply(baseScale, pinchScale)
  const initMargin = useRef(new Animated.Value(-66)).current
  const [lastScale, setLastScale] = useState(1)
  const margin = Animated.divide(initMargin, scale).interpolate({
    inputRange: [-1000, MIN_MARGIN, 0],
    outputRange: [MIN_MARGIN, MIN_MARGIN, 0],
  })
  const onPinchGestureEvent = Animated.event([{nativeEvent: {scale: pinchScale}}], {
    useNativeDriver: false,
  })
  const onPinchHandlerStateChange = (event: PinchGestureHandlerStateChangeEvent) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      pinchScale.setValue(lastScale)
      setLastScale(event.nativeEvent.scale)
      baseScale.setValue(event.nativeEvent.scale)
    }
  }

  if (!player) return null

  return (
    <PinchGestureHandler onGestureEvent={onPinchGestureEvent} onHandlerStateChange={onPinchHandlerStateChange}>
      <Animated.ScrollView horizontal style={{overflow: 'visible'}}>
        <Animated.View style={styles.root}>
          {player.cards.hand.map((card, ind) => (
            <Card type={card} key={`player-card-${ind}`} index={ind} margin={margin} />
          ))}
        </Animated.View>
      </Animated.ScrollView>
    </PinchGestureHandler>
  )
}

export default Hand
