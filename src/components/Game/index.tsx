import React, {useEffect} from 'react'
import {Button as RNButton, Text, View} from 'react-native'
import {RouteProp} from '@react-navigation/native'
import {StackScreenProps} from '@react-navigation/stack'
import {shallowEqual, useDispatch, useSelector} from 'react-redux'
import EStyle from 'react-native-extended-stylesheet'

import {GameStatus} from '@types'
import {reqGetGame, reqStartGame} from '@actions/game'
import {reqLeaveGame} from '@actions/lobby'
import {GlobalState} from '@reducers/index'
import {GameState} from '@reducers/game'
import PageWrapper from '../common/PageWrapper'
import {RootStackParamList} from '../../types'
import {useUser, useYourTurn} from '../../utils'

import Players from './Players'
import Board from './Board'
import Hand from './Hand'
import Fighters from './Fighters'
import Planets from './Planets'
import OptionsModal from './OptionsModal'

const styles = EStyle.create({
  root: {
    height: '100%',
    justifyContent: 'space-between',
  },
  section: {
    padding: 20,
    paddingBottom: 0,
  },
  turnText: {
    color: '$textColor',
    fontWeight: 'bold',
    fontSize: 20,
    textAlign: 'center',
  },
  fighters: {
    borderColor: 'white',
    borderRadius: 8,
    padding: 4,
  },
  fightersText: {
    color: '$textColor',
    fontSize: 20,
    fontWeight: 'bold',
  },
})

const StartGameBtn = () => {
  const dispatch = useDispatch()
  const game = useSelector<GlobalState, GameState>(state => state.game, shallowEqual)
  if (!game.id || Object.keys(game.players).length < 2 || game.status !== GameStatus.new) return null

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
  const playersTurn = useYourTurn()
  if (!game.id) return null

  return (
    <PageWrapper scrollable={false}>
      <View style={styles.root}>
        {game.status === GameStatus.inPlay && (
          <View style={styles.section}>
            <Text style={styles.turnText}>
              {playersTurn ? 'Your' : `${game.players[game.activePlayer].name}'s`} turn ({game.playersPhase})
            </Text>
          </View>
        )}
        <View style={styles.section}>
          <Players players={Object.values(game.players)} />
        </View>
        <View style={styles.section}>
          <Board />
        </View>
        <View style={styles.playerSection}>
          <Planets />
          <Fighters />
          <Hand />
        </View>
      </View>
      <OptionsModal />
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
