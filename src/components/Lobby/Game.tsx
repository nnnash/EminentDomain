import React from 'react'
import {Text, StyleSheet, TouchableOpacity} from 'react-native'
import {useNavigation} from '@react-navigation/native'

import {GameShort} from '@types'

interface GameProps {
  game: GameShort
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255, 255, 255, .05)',
    borderRadius: 4,
    borderColor: 'white',
    borderWidth: 1,
    padding: 10,
    shadowColor: 'white',
    shadowOpacity: 1,
    shadowRadius: 6,
    marginTop: 20,
    width: '47%',
  },
  name: {
    color: 'white',
    textTransform: 'uppercase',
    textShadowColor: 'rgb(190,253,255)',
    textShadowRadius: 2,
    textAlign: 'center',
  },
  players: {
    color: 'white',
    marginTop: 5,
  },
})

const Game: React.FC<GameProps> = ({game}) => {
  const {navigate} = useNavigation()
  return (
    <TouchableOpacity style={styles.container} onPress={() => navigate('Game', {name: game.name, id: game.id})}>
      <Text style={styles.name}>{game.name}</Text>
      <Text style={styles.players}>Players number: {game.players}</Text>
    </TouchableOpacity>
  )
}

export default Game
