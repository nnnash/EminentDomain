import React from 'react'
import {Text, TouchableHighlight, View} from 'react-native'
import {shallowEqual, useDispatch, useSelector} from 'react-redux'
import EStyle from 'react-native-extended-stylesheet'

import {GlobalState} from '@reducers/index'
import FighterIcon from './Icons/FighterIcon'
import PointIcon from './Icons/PointIcon'
import {reqPlayAction} from '@actions/game'
import {Action} from '@types'

const styles = EStyle.create({
  root: {
    paddingTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  token: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 4,
    borderColor: 'transparent',
  },
  active: {
    borderColor: 'white',
  },
  tokenText: {
    color: '$textColor',
    fontSize: 20,
    fontWeight: 'bold',
  },
})

const Fighters: React.FC<{}> = () => {
  const {
    game: {players, id: gameId},
    user: {id: userId},
    ui: {activeWarfare},
  } = useSelector<GlobalState, GlobalState>(s => s, shallowEqual)
  const dispatch = useDispatch()
  const isActive = activeWarfare !== undefined
  const onPress = () => {
    if (!isActive) return
    dispatch(reqPlayAction({type: Action.warfare, cardIndex: activeWarfare || 0, gameId}))
  }

  return (
    <TouchableHighlight style={{alignItems: 'center'}} onPress={onPress}>
      <Text style={[styles.token, isActive ? styles.active : null]}>
        <FighterIcon style={{transform: [{translateY: 5}, {translateX: 5}]}} />
        <Text style={styles.tokenText}> × {players[userId].spaceships}</Text>
      </Text>
    </TouchableHighlight>
  )
}

const Points: React.FC<{}> = () => {
  const {
    game: {players},
    user: {id: userId},
  } = useSelector<GlobalState, GlobalState>(s => s, shallowEqual)

  return (
    <View style={{alignItems: 'center'}}>
      <Text style={styles.token}>
        <PointIcon style={{transform: [{translateY: 5}, {translateX: 5}]}} />
        <Text style={styles.tokenText}> × {players[userId].points}</Text>
      </Text>
    </View>
  )
}

const PlayerTokens: React.FC<{}> = () => (
  <View style={styles.root}>
    <Fighters />
    <Points />
  </View>
)

export default PlayerTokens
