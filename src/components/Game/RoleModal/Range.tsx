import React from 'react'
import {View, Text, TouchableOpacity} from 'react-native'
import {useSelector, shallowEqual, useDispatch} from 'react-redux'

import {GlobalState} from '@reducers/index'
import styles from './styles'
import {getRange} from '@clientUtils'
import {Action} from '@types'
import Icon from '../Icons/Icon'
import {reqPlayRole, RolePayload} from '@actions/game'
import {setEnvoyActive} from '@actions/ui'

const IconAmount: React.FC<{amount: number; type: Action}> = ({amount, type}) => (
  <>
    {Array.from({length: amount}).map((_, ind) => (
      <Icon key={ind} action={type} style={{transform: [{translateY: 7}]}} />
    ))}
  </>
)

const Range: React.FC<{}> = () => {
  const dispatch = useDispatch()
  const {
    ui: {optionsModalRole, optionsModalRange, optionsModalPlanet},
    game,
    user,
  } = useSelector<GlobalState, GlobalState>(s => s, shallowEqual)
  if (!optionsModalRole || !optionsModalRange) return null
  const isLeader = game.rolePlayer === game.activePlayer
  const {planetSymbols, typeCards} = getRange(game, user.id, optionsModalRole, isLeader)
  const availableCards = typeCards + Number(isLeader)

  return (
    <View>
      <Text style={styles.title}>Select {optionsModalRole} role amount?</Text>
      {!!availableCards && (
        <Text style={styles.text}>
          Cards: <IconAmount type={optionsModalRole} amount={availableCards} />
        </Text>
      )}
      {!!planetSymbols && (
        <Text style={styles.text}>
          Planets: <IconAmount type={optionsModalRole} amount={planetSymbols} />
        </Text>
      )}
      <View style={{flexDirection: 'row'}}>
        {Array.from({length: optionsModalRange.to}).map((_, ind) =>
          ind + 1 >=
          (optionsModalRole === Action.envoy && !isLeader
            ? Math.max(optionsModalRange.from, 2)
            : optionsModalRange.from) ? (
            <TouchableOpacity
              key={`options-modal-range-${ind}`}
              onPress={() => {
                const amount = ind + 1
                if (optionsModalRole === Action.envoy) {
                  if (amount === 2 - Number(isLeader))
                    dispatch(reqPlayRole({type: Action.envoy, amount, gameId: game.id, planetIndex: 0}))
                  else dispatch(setEnvoyActive({amount}))
                } else {
                  dispatch(
                    reqPlayRole({
                      type: optionsModalRole as RolePayload['type'],
                      amount,
                      gameId: game.id,
                      planetIndex: optionsModalPlanet as number,
                    }),
                  )
                }
              }}>
              <Icon action={optionsModalRole} width={120} />
            </TouchableOpacity>
          ) : (
            <Icon key={`options-modal-range-${ind}`} action={optionsModalRole} width={120} style={{opacity: 0.5}} />
          ),
        )}
      </View>
    </View>
  )
}

export default Range
