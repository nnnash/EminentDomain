import React from 'react'
import {Text, StyleSheet, View} from 'react-native'
import {Player} from '@types'

interface PlayerProps {
  player: Player
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
    flexGrow: 1,
  },
  name: {
    color: 'white',
    textTransform: 'uppercase',
    textShadowColor: 'rgb(190,253,255)',
    textShadowRadius: 2,
    textAlign: 'center',
  },
})

const PlayerTile: React.FC<PlayerProps> = ({player}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.name}>{player.name}</Text>
    </View>
  )
}

export default PlayerTile
