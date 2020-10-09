import React from 'react'
import {Text, View} from 'react-native'
import EStyle from 'react-native-extended-stylesheet'

import {Player} from '@types'

const styles = EStyle.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tile: {
    backgroundColor: 'rgba(255, 255, 255, .05)',
    borderRadius: 4,
    borderColor: 'white',
    borderWidth: 1,
    padding: 10,
    shadowColor: 'white',
    shadowOpacity: 1,
    shadowRadius: 6,
    flexGrow: 1,
    marginRight: 20,
  },
  'tile:last-child': {
    marginRight: 0,
  },
  name: {
    color: '$textColor',
    textTransform: 'uppercase',
    textShadowColor: '$shadowColor',
    textShadowRadius: 2,
    textAlign: 'center',
  },
  amount: {
    flexDirection: 'row',
  },
  amountText: {
    color: '$textColor',
  },
})

interface AmountProps {
  amount: number
}
const Amount: React.FC<AmountProps> = ({children, amount}) => (
  <View style={styles.amount}>
    {children}
    <Text style={styles.amountText}> × {amount}</Text>
  </View>
)

interface PlayersProps {
  players: Array<Player>
}
const Players: React.FC<PlayersProps> = ({players}) => (
  <View style={styles.container}>
    {players.map((player, ind) => (
      <View key={`player-${player.id}`} style={EStyle.child(styles, 'tile', ind, players.length)}>
        <Text style={styles.name}>{player.name}</Text>
        <Amount amount={player.points}>
          <Text style={styles.amountText}>Points</Text>
        </Amount>
        <Amount amount={player.spaceships}>
          <Text style={styles.amountText}>Spaceships</Text>
        </Amount>
        <Amount amount={player.planets.explored.length}>
          <Text style={styles.amountText}>Explored</Text>
        </Amount>
        <Amount amount={player.planets.occupied.length}>
          <Text style={styles.amountText}>Occupied</Text>
        </Amount>
      </View>
    ))}
  </View>
)

export default Players