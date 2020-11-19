import React from 'react'
import {View, Text, TouchableOpacity} from 'react-native'
import {useSelector, shallowEqual, useDispatch} from 'react-redux'

import {Action} from '@types'
import {GlobalState} from '@reducers/index'
import {setIndustryActive} from '@actions/ui'
import Icon from '../Icons/Icon'
import {reqPlayAction} from '@actions/game'
import styles from './styles'

const ICON_WIDTH = 180
const Confirm: React.FC<{}> = () => {
  const {
    ui: {activeIndustry, optionsModalIndustry},
    game,
  } = useSelector<GlobalState, GlobalState>(s => s, shallowEqual)
  const dispatch = useDispatch()
  if (!optionsModalIndustry || !activeIndustry || activeIndustry.type) return null

  return (
    <View>
      <Text style={styles.title}>Select action type</Text>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <TouchableOpacity
          onPress={() => {
            activeIndustry.isAction
              ? dispatch(
                  reqPlayAction({type: Action.produce, cardIndex: activeIndustry.cardIndex || 0, gameId: game.id}),
                )
              : dispatch(setIndustryActive({isAction: false, type: Action.produce}))
          }}>
          <Icon width={ICON_WIDTH} action={Action.produce} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            activeIndustry.isAction
              ? dispatch(reqPlayAction({type: Action.sell, cardIndex: activeIndustry.cardIndex || 0, gameId: game.id}))
              : dispatch(setIndustryActive({isAction: false, type: Action.sell}))
          }}>
          <Icon width={ICON_WIDTH} action={Action.sell} />
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default Confirm
