import React from 'react'
import {View, Text} from 'react-native'
import {useSelector, shallowEqual, useDispatch} from 'react-redux'

import {Action} from '@types'
import {GlobalState} from '@reducers/index'
import {reqPlayRole, RolePayload} from '@actions/game'
import {setColonizeActive, setOptionsModalOpen} from '@actions/ui'
import {getRange} from '../../../utils'
import Button from '../../common/Button'
import Icon from '../Icons/Icon'
import {getPlanetColonizeCost} from '../../../../common/utils'
import styles from './styles'

const IconAmount: React.FC<{amount: number; type: Action}> = ({amount, type}) => (
  <>
    {Array.from({length: amount}).map((_, ind) => (
      <Icon key={ind} action={type} style={{transform: [{translateY: 7}]}} />
    ))}
  </>
)

const Confirm: React.FC<{}> = () => {
  const {
    ui: {roleRepeat},
    game,
    user,
  } = useSelector<GlobalState, GlobalState>(s => s, shallowEqual)
  const dispatch = useDispatch()
  const player = game.players[user.id]
  if (!roleRepeat || !player) return null
  const {planetSymbols, typeCards} = getRange(game, user.id, roleRepeat, false)
  const onConfirm = () => {
    if (
      game.roleType === Action.colonize &&
      player.planets.explored.filter(pl => pl.colonies < getPlanetColonizeCost(pl, player)).length > 1
    )
      dispatch(setColonizeActive({isLeader: false, isAction: false}))
    else {
      const range = getRange(game, user.id, roleRepeat, false)
      if (range.to - Number(roleRepeat === Action.envoy) === 1)
        dispatch(
          reqPlayRole({
            type: roleRepeat,
            amount: range.to,
            gameId: game.id,
            planetIndex: roleRepeat === Action.warfare ? undefined : 0,
          } as RolePayload),
        )
      else
        dispatch(
          setOptionsModalOpen({
            open: true,
            action: game.roleType,
            range: getRange(
              game,
              user.id,
              roleRepeat,
              false,
              game.roleType === Action.colonize
                ? player.planets.explored.find(pl => pl.colonies < getPlanetColonizeCost(pl, player))
                : undefined,
            ),
            planetIndex:
              game.roleType === Action.colonize
                ? player.planets.explored.findIndex(pl => pl.colonies < getPlanetColonizeCost(pl, player))
                : undefined,
          }),
        )
    }
  }
  const onDecline = () => {
    dispatch(reqPlayRole({type: roleRepeat, gameId: game.id, amount: 0, planetIndex: 0}))
  }

  return (
    <View>
      <Text style={styles.title}>Repeat {roleRepeat} role?</Text>
      {!!typeCards && (
        <Text style={styles.text}>
          Cards: <IconAmount type={roleRepeat} amount={typeCards} />
        </Text>
      )}
      {!!planetSymbols && (
        <Text style={styles.text}>
          Planets: <IconAmount type={roleRepeat} amount={planetSymbols} />
        </Text>
      )}
      <Button title="Repeat" onClick={onConfirm} style={styles.button} />
      <Button title="Decline" onClick={onDecline} />
    </View>
  )
}

export default Confirm
