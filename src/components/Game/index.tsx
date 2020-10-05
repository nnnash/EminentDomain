import React, {useEffect} from 'react'
import {View} from 'react-native'
import {RouteProp} from '@react-navigation/native'
import {StackScreenProps} from '@react-navigation/stack'
import {shallowEqual, useDispatch, useSelector} from 'react-redux'
import EStyle from 'react-native-extended-stylesheet'

import {GameStage} from '@types'
import {getGame, startGame} from '@actions/game'
import {leaveGame} from '@actions/lobby'
import {GlobalState} from '@reducers/index'
import {GameState} from '@reducers/game'
import PageWrapper from '../common/PageWrapper'
import Button from '../common/Button'
import {RootStackParamList} from '../../types'
import {useUser} from '../../utils'
import Players from './Players'

const styles = EStyle.create({
  section: {
    padding: 20,
    paddingBottom: 0,
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
      <View style={styles.section}>
        <Players players={Object.values(game.players)} />
      </View>
      {game.stage === GameStage.new && (
        <View style={styles.section}>
          <Button title="Start game" onClick={() => dispatch(startGame.request(game.id))} />
        </View>
      )}
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
