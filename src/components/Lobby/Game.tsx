import React, {useState} from 'react'
import {Text, StyleSheet, TouchableOpacity} from 'react-native'
import {useDispatch} from 'react-redux'

import {GameShort} from '@types'
import Modal from './Modal'
import {useUser} from '../../utils'
import {rejoinGame} from '@actions/lobby'

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
  const dispatch = useDispatch()
  const [modalOpen, setModalOpen] = useState(false)
  const user = useUser()
  const onPress = () => {
    if (game.players.includes(user.id)) dispatch(rejoinGame.request({gameId: game.id, playerId: user.id}))
    else setModalOpen(true)
  }
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Text style={styles.name}>{game.name}</Text>
      <Text style={styles.players}>Players number: {game.players.length}</Text>
      <Modal isOpen={modalOpen} setOpen={setModalOpen} gameName={game.name} gameId={game.id} />
    </TouchableOpacity>
  )
}

export default Game
