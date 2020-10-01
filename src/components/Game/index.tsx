import React, {useEffect} from 'react'
import {Text} from 'react-native'
import {RouteProp} from '@react-navigation/native'
import {StackScreenProps} from '@react-navigation/stack'
import {useDispatch, useSelector, shallowEqual} from 'react-redux'

import {getGame} from '@actions/game'
import PageWrapper from '../common/PageWrapper'
import {RootStackParamList} from '../../types'
import {GlobalState} from '@reducers/index'
import {GameState} from '@reducers/game'

const Game: React.FC<StackScreenProps<RootStackParamList, 'Game'>> = ({route}) => {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(getGame.request(route.params.id))
  }, [dispatch, route.params.id])
  const game = useSelector<GlobalState, GameState>(state => state.game, shallowEqual)

  return (
    <PageWrapper>
      {Object.values(game.players).map((player, ind) => (
        <Text key={ind}>{JSON.stringify(player)}</Text>
      ))}
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
