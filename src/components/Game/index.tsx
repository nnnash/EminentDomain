import React from 'react'
import {Text} from 'react-native'
import {RouteProp} from '@react-navigation/native'

import PageWrapper from '../common/PageWrapper'
import {RootStackParamList} from '../../types'

const Game = () => {
  return (
    <PageWrapper>
      <Text>it is a game</Text>
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
