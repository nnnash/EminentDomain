import React from 'react'
import {Text, View} from 'react-native'
import {useSelector, shallowEqual, useDispatch} from 'react-redux'

import {Phase} from '@types'
import {GlobalState} from '@reducers/index'
import {confirmCleanup} from '@actions/ui'
import Button from '../../common/Button'
import styles from './styles'

const Cleanup: React.FC<{}> = () => {
  const {game, user} = useSelector<GlobalState, GlobalState>(s => s, shallowEqual)
  const dispatch = useDispatch()
  if (game.playersPhase !== Phase.cleanup || game.activePlayer !== user.id) return null

  const onConfirm = () => {
    dispatch(confirmCleanup())
  }

  return (
    <View>
      <Text style={styles.title}>Cleanup phase</Text>
      <Button title="Confirm cleanup" onClick={onConfirm} />
    </View>
  )
}

export default Cleanup
