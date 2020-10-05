import React, {useEffect} from 'react'
import {View} from 'react-native'
import {RouteProp} from '@react-navigation/native'
import {StackScreenProps} from '@react-navigation/stack'
import {useDispatch, useSelector, shallowEqual} from 'react-redux'
import EStyle from 'react-native-extended-stylesheet'

import {getGame} from '@actions/game'
import {leaveGame} from '@actions/lobby'
import {GlobalState} from '@reducers/index'
import {GameState} from '@reducers/game'
import PageWrapper from '../common/PageWrapper'
import {RootStackParamList} from '../../types'
import {useUser} from '../../utils'
import Players from './Player'

const styles = EStyle.create({
  players: {
    padding: 20,
  },
})

const Game: React.FC<StackScreenProps<RootStackParamList, 'Game'>> = ({route}) => {
  const dispatch = useDispatch()
  const user = useUser()
  useEffect(() => {
    dispatch(getGame.request(route.params.id))
    return () => {
      dispatch(leaveGame({gameId: route.params.id, playerId: user.id}))
    }
  }, [dispatch, route.params.id, user.id])
  const game = useSelector<GlobalState, GameState>(state => state.game, shallowEqual)

  return (
    <PageWrapper>
      <View style={styles.players}>
        <Players players={Object.values(game.players)} />
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
      textShadowColor: 'white',
      textShadowRadius: 10,
      fontWeight: '200' as const,
    },
    headerTintColor: 'white',
  }),
}

export default Game
