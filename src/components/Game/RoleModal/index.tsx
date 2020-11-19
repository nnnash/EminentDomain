import React, {useRef, useState} from 'react'
import {useSelector, shallowEqual} from 'react-redux'
import {Animated} from 'react-native'
import EStyle from 'react-native-extended-stylesheet'
import {PanGestureHandler, PanGestureHandlerStateChangeEvent, State} from 'react-native-gesture-handler'

import {GameStatus, Phase} from '@types'
import {GlobalState} from '@reducers/index'
import Confirm from './Confirm'
import Range from './Range'
import IndustrySelect from './IndustrySelect'
import Cleanup from './Cleanup'
import ActionPhase from './SkipAction'

const styles = EStyle.create({
  root: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 8,
  },
})

const usePan = () => {
  const pan = useRef(new Animated.ValueXY()).current
  const touch = useRef(new Animated.ValueXY()).current
  const [lastInitial, setLastInitial] = useState({x: 0, y: 0})
  const onPanGestureEvent = Animated.event([{nativeEvent: {translationY: touch.y, translationX: touch.x}}], {
    useNativeDriver: true,
  })
  const onPanHandlerStateChange = (event: PanGestureHandlerStateChangeEvent) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      const newInitial = {
        x: event.nativeEvent.translationX + lastInitial.x,
        y: event.nativeEvent.translationY + lastInitial.y,
      }
      pan.setValue(newInitial)
      touch.setValue({x: 0, y: 0})
      setLastInitial(newInitial)
    }
  }
  return {pan, touch, onPanHandlerStateChange, onPanGestureEvent}
}

const RoleModal: React.FC<{}> = () => {
  const {pan, touch, onPanGestureEvent, onPanHandlerStateChange} = usePan()
  const {
    ui: {optionsModalOpen},
    game,
    user,
  } = useSelector<GlobalState, GlobalState>(s => s, shallowEqual)
  const isOpen =
    game.status === GameStatus.inPlay &&
    ((game.playersPhase !== Phase.role && game.activePlayer === user.id) || optionsModalOpen)
  if (!isOpen) return null
  return (
    <PanGestureHandler onGestureEvent={onPanGestureEvent} onHandlerStateChange={onPanHandlerStateChange}>
      <Animated.View
        style={[
          styles.root,
          {
            transform: [{translateY: Animated.add(pan.y, touch.y)}, {translateX: Animated.add(pan.x, touch.x)}],
          },
        ]}>
        <Confirm />
        <IndustrySelect />
        <Range />
        <Cleanup />
        <ActionPhase />
      </Animated.View>
    </PanGestureHandler>
  )
}

export default RoleModal
