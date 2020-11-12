import React from 'react'
import {Text, View} from 'react-native'
import {shallowEqual, useSelector, useDispatch} from 'react-redux'
import EStyle from 'react-native-extended-stylesheet'

import {GameStatus, Phase} from '@types'
import {GlobalState} from '@reducers/index'
import {GameState} from '@reducers/game'
import {useUser, useYourTurn} from '../../utils'
import Button from '../common/Button'
import {confirmCleanup} from '@actions/ui'
import {reqSkipAction} from '@actions/game'

const styles = EStyle.create({
  root: {
    padding: 20,
    paddingBottom: 0,
    marginBottom: 10,
  },
  turnText: {
    color: '$textColor',
    fontWeight: 'bold',
    fontSize: 20,
    textAlign: 'center',
  },
  lastAction: {
    color: '$textColor',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
  },
})

const CleanupPhase: React.FC<{}> = () => {
  const dispatch = useDispatch()
  return <Button title="Confirm cleanup" onClick={() => dispatch(confirmCleanup())} />
}

const ActionsPanel: React.FC<{}> = () => {
  const game = useSelector<GlobalState, GameState>(state => state.game, shallowEqual)
  const playersTurn = useYourTurn()
  const user = useUser()
  const dispatch = useDispatch()
  if (!game.id) return null

  const getPhaseComponent = (phase: Phase) => {
    const activePlayer = game.players[game.activePlayer].name
    const turnText = `${playersTurn ? 'Your' : `${activePlayer}'s`} turn (${game.playersPhase})`
    return {
      [Phase.cleanup]: playersTurn ? <CleanupPhase /> : <Text style={styles.turnText}>{turnText}</Text>,
      [Phase.role]: (
        <Text style={styles.turnText}>
          {turnText}
          {!!game.rolePlayer &&
            game.activePlayer !== game.rolePlayer &&
            (game.rolePlayer !== user.id ? ` (${game.players[game.rolePlayer].name}'s repeat)` : ' (Your repeat)')}
        </Text>
      ),
      [Phase.action]: (
        <>
          <Text style={styles.turnText}>{turnText}</Text>
          {game.activePlayer === user.id && (
            <Button title="Skip" onClick={() => dispatch(reqSkipAction({gameId: game.id}))} />
          )}
        </>
      ),
    }[phase]
  }

  return (
    <View style={styles.root}>
      {game.status === GameStatus.new && <Text style={styles.turnText}>Game not started yet</Text>}
      {game.status === GameStatus.inPlay && getPhaseComponent(game.playersPhase)}
      {game.status === GameStatus.ended && <Text style={styles.turnText}>Game over</Text>}
      <Text style={styles.lastAction}>{game.lastAction}</Text>
    </View>
  )
}

export default ActionsPanel
