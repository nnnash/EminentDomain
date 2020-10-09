import React, {useEffect} from 'react'
import {Button as RNButton, View} from 'react-native'
import {RouteProp} from '@react-navigation/native'
import {StackScreenProps} from '@react-navigation/stack'
import {shallowEqual, useDispatch, useSelector} from 'react-redux'
import EStyle from 'react-native-extended-stylesheet'

import {GameStage} from '@types'
import {reqGetGame, reqStartGame} from '@actions/game'
import {reqLeaveGame} from '@actions/lobby'
import {GlobalState} from '@reducers/index'
import {GameState} from '@reducers/game'
import PageWrapper from '../common/PageWrapper'
import {RootStackParamList} from '../../types'
import {useUser} from '../../utils'

import Players from './Players'
import Board from './Board'
import Hand from './Hand'

const styles = EStyle.create({
  root: {
    height: '100%',
    justifyContent: 'space-between',
  },
  section: {
    padding: 20,
    paddingBottom: 0,
  },
  playerSection: {},
})

const StartGameBtn = () => {
  const dispatch = useDispatch()
  const game = useSelector<GlobalState, GameState>(state => state.game, shallowEqual)
  if (!game.id || Object.keys(game.players).length < 2 || game.stage !== GameStage.new) return null

  return <RNButton title="Start game" onPress={() => dispatch(reqStartGame(game.id))} color="white" />
}

const Game: React.FC<StackScreenProps<RootStackParamList, 'Game'>> = ({route}) => {
  const dispatch = useDispatch()
  const user = useUser()
  useEffect(() => {
    dispatch(reqGetGame(route.params.id))
    return () => {
      dispatch(reqLeaveGame({gameId: route.params.id, playerId: user.id}))
    }
  }, [dispatch, route.params.id, user.id])
  const game = useSelector<GlobalState, GameState>(state => state.game, shallowEqual)
  if (!game.id) return null

  return (
    <PageWrapper scrollable={false}>
      <View style={styles.root}>
        <View style={styles.section}>
          <Players players={Object.values(game.players)} />
        </View>
        <View style={styles.section}>
          <Board />
        </View>
        <View style={styles.playerSection}>
          <Hand />
        </View>
      </View>
    </PageWrapper>
  )
}

export const routeProps = {
  component: Game,
  options: ({route}: {route: RouteProp<RootStackParamList, 'Game'>}) => ({
    headerTransparent: true,
    title: route.params.name,
    headerTitleStyle: {
      color: 'white',
      textTransform: 'uppercase' as const,
      textShadowColor: 'rgb(190,253,255)',
      textShadowRadius: 6,
    },
    headerBackTitleStyle: {
      color: 'white',
    },
    headerTintColor: 'white',
    headerRight: () => <StartGameBtn />,
  }),
}

export default Game
