import React from 'react'
import {Text, View} from 'react-native'
import {shallowEqual, useSelector} from 'react-redux'
import EStyle from 'react-native-extended-stylesheet'

import {GameStatus} from '@types'
import {GlobalState} from '@reducers/index'
import {GameState} from '@reducers/game'
import {useYourTurn} from '../../utils'

const styles = EStyle.create({
  root: {
    padding: 10,
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

const ActionsPanel: React.FC<{}> = () => {
  const game = useSelector<GlobalState, GameState>(state => state.game, shallowEqual)
  const playersTurn = useYourTurn()
  if (!game.id) return null

  const activePlayer = game.players[game.activePlayer].name
  const turnText = `${playersTurn ? 'Your' : `${activePlayer}'s`} turn (${game.playersPhase})`

  return (
    <View style={styles.root}>
      {game.status === GameStatus.new && <Text style={styles.turnText}>Game not started yet</Text>}
      {game.status === GameStatus.inPlay && <Text style={styles.turnText}>{turnText}</Text>}
      {game.status === GameStatus.ended && <Text style={styles.turnText}>Game over</Text>}
      <Text style={styles.lastAction}>{game.lastAction}</Text>
    </View>
  )
}

export default ActionsPanel
