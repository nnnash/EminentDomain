import React from 'react'
import {Animated, Text, TouchableOpacity, View} from 'react-native'
import {shallowEqual, useDispatch, useSelector} from 'react-redux'
import EStyle from 'react-native-extended-stylesheet'

import {GlobalState} from '@reducers/index'
import FighterIcon from './Icons/FighterIcon'
import PointIcon from './Icons/PointIcon'
import {reqPlayAction, reqPlayRole} from '@actions/game'
import {Action} from '@types'
import {setOptionsModalOpen} from '@actions/ui'
import {getRange, useFadeInOut} from '@clientUtils'

const styles = EStyle.create({
  root: {
    paddingTop: 8,
    paddingBottom: 4,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  token: {
    padding: 4,
  },
  animatedBackground: {
    borderRadius: 8,
    position: 'absolute',
    height: '100%',
    width: '100%',
    backgroundColor: 'white',
  },
  tokenText: {
    color: '$textColor',
    fontSize: 20,
    fontWeight: 'bold',
  },
})

const Fighters: React.FC<{}> = () => {
  const {
    game,
    user: {id: userId},
    ui: {activeWarfare},
  } = useSelector<GlobalState, GlobalState>(s => s, shallowEqual)
  const {players, id: gameId} = game
  const dispatch = useDispatch()
  const opacity = useFadeInOut(0.5, 0.1)
  const isActive = activeWarfare?.isAction || activeWarfare?.isLeader
  const onPress = () => {
    if (!isActive) return
    if (activeWarfare?.isAction)
      dispatch(reqPlayAction({type: Action.warfare, cardIndex: activeWarfare.cardIndex || 0, gameId}))
    else {
      const {from, to} = getRange(game, userId, Action.warfare, true)
      if (from === to) dispatch(reqPlayRole({type: Action.warfare, amount: to, gameId}))
      else
        dispatch(
          setOptionsModalOpen({
            action: Action.warfare,
            open: true,
            range: getRange(game, userId, Action.warfare, true),
          }),
        )
    }
  }

  return (
    <TouchableOpacity style={{alignItems: 'center'}} onPress={onPress}>
      <Animated.View style={isActive ? [styles.animatedBackground, {opacity}] : null} />
      <Text style={styles.token}>
        <FighterIcon style={{transform: [{translateY: 5}, {translateX: 5}]}} />
        <Text style={styles.tokenText}> × {players[userId].spaceships}</Text>
      </Text>
    </TouchableOpacity>
  )
}

export const Points: React.FC<{amount: number}> = ({amount}) => {
  return (
    <View style={{alignItems: 'center'}}>
      <Text style={styles.token}>
        <PointIcon style={{transform: [{translateY: 5}, {translateX: 5}]}} />
        <Text style={styles.tokenText}> × {amount}</Text>
      </Text>
    </View>
  )
}

const UserPoints: React.FC<{}> = () => {
  const {
    game: {players},
    user: {id: userId},
  } = useSelector<GlobalState, GlobalState>(s => s, shallowEqual)

  return <Points amount={players[userId].points} />
}

const PlayerTokens: React.FC<{}> = () => (
  <View style={styles.root}>
    <Fighters />
    <UserPoints />
  </View>
)

export default PlayerTokens
