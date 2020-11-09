import React from 'react'
import {Text, View} from 'react-native'
import {shallowEqual, useSelector, useDispatch} from 'react-redux'
import EStyle from 'react-native-extended-stylesheet'

import {GameStatus, Phase} from '@types'
import {GlobalState} from '@reducers/index'
import {GameState} from '@reducers/game'
import {useYourTurn} from '../../utils'
import Button from '../common/Button'
import {confirmCleanup} from '@actions/ui'

const styles = EStyle.create({
  root: {
    padding: 20,
    paddingBottom: 0,
  },
  turnText: {
    color: '$textColor',
    fontWeight: 'bold',
    fontSize: 20,
    textAlign: 'center',
  },
})

const CleanupPhase: React.FC<{}> = () => {
  const dispatch = useDispatch()
  return <Button title="Confirm cleanup" onClick={() => dispatch(confirmCleanup())} />
}

const ActionsPanel: React.FC<{}> = () => {
  const game = useSelector<GlobalState, GameState>(state => state.game, shallowEqual)
  const playersTurn = useYourTurn()
  if (!game.id) return null

  const getPhaseComponent = (phase: Phase) => {
    return {
      [Phase.cleanup]: playersTurn ? (
        <CleanupPhase />
      ) : (
        <Text style={styles.turnText}>
          {playersTurn ? 'Your' : `${game.players[game.activePlayer].name}'s`} turn ({game.playersPhase})
        </Text>
      ),
      [Phase.role]: (
        <Text style={styles.turnText}>
          {playersTurn ? 'Your' : `${game.players[game.activePlayer].name}'s`} turn ({game.playersPhase})
        </Text>
      ),
      [Phase.action]: (
        <Text style={styles.turnText}>
          {playersTurn ? 'Your' : `${game.players[game.activePlayer].name}'s`} turn ({game.playersPhase})
        </Text>
      ),
    }[phase]
  }

  return (
    <View style={styles.root}>
      {game.status === GameStatus.new && <Text style={styles.turnText}>Game not started yet</Text>}
      {game.status === GameStatus.inPlay && getPhaseComponent(game.playersPhase)}
      {game.status === GameStatus.ended && <Text style={styles.turnText}>Game over</Text>}
    </View>
  )
}

export default ActionsPanel
