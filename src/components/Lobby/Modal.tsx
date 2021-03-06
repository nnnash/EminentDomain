import React, {useState} from 'react'
import {useDispatch} from 'react-redux'
import {View, Text, TextInput} from 'react-native'
import EStyle from 'react-native-extended-stylesheet'

import {Game} from '@types'
import {reqCreateGame, reqJoinGame} from '@actions/lobby'
import {useUser} from '@clientUtils'
import Button from '../common/Button'
import CommonModal from '../common/Modal'

const styles = EStyle.create({
  title: {
    textAlign: 'center',
    color: '$textColor',
    textTransform: 'uppercase',
    textShadowColor: 'white',
    fontSize: 20,
    fontWeight: '900',
    textShadowRadius: 15,
    marginBottom: 20,
  },
  label: {
    color: '$textColor',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 4,
    marginBottom: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    color: '$textColor',
    padding: 10,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
})

interface ModalProps {
  isOpen: boolean
  setOpen: (arg: boolean) => void
  gameId?: Game['id']
  gameName?: string
}

const Modal: React.FC<ModalProps> = ({isOpen, setOpen, gameName, gameId}) => {
  const dispatch = useDispatch()
  const [game, setGame] = useState('')
  const [player, setPlayer] = useState('')
  const user = useUser()

  return (
    <CommonModal animationType="slide" visible={isOpen} transparent>
      <Text style={styles.title}>{!gameName ? 'New game' : `Join to "${gameName}"`}</Text>
      {!gameId && (
        <>
          <Text style={styles.label}>Game name</Text>
          <TextInput style={styles.input} onChangeText={val => setGame(val)} />
        </>
      )}
      <Text style={styles.label}>Player name</Text>
      <TextInput style={styles.input} onChangeText={val => setPlayer(val)} />
      <View style={styles.buttons}>
        <Button title="Cancel" onClick={() => setOpen(false)} />
        {!gameId ? (
          <Button
            title="Create"
            onClick={() => {
              if (!game || !player) return
              setOpen(false)
              dispatch(reqCreateGame({gameName: game, playerName: player, playerId: user.id}))
            }}
          />
        ) : (
          <Button
            title="Join"
            onClick={() => {
              if (!player) return
              setOpen(false)
              dispatch(reqJoinGame({gameId: gameId, playerName: player, playerId: user.id}))
            }}
          />
        )}
      </View>
    </CommonModal>
  )
}

export default Modal
