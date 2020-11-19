import React from 'react'
import {Text, View} from 'react-native'
import {useSelector, shallowEqual, useDispatch} from 'react-redux'

import {Phase} from '@types'
import {GlobalState} from '@reducers/index'
import {reqSkipAction} from '@actions/game'
import Button from '../../common/Button'
import styles from './styles'

const ActionPhase: React.FC<{}> = () => {
  const {game, user, ui} = useSelector<GlobalState, GlobalState>(s => s, shallowEqual)
  const dispatch = useDispatch()
  if (game.playersPhase !== Phase.action || game.activePlayer !== user.id || ui.optionsModalIndustry) return null

  const onSkip = () => {
    dispatch(reqSkipAction({gameId: game.id}))
  }

  return (
    <View>
      <Text style={styles.title}>Action phase</Text>
      <Button title="Skip action" onClick={onSkip} />
    </View>
  )
}

export default ActionPhase
