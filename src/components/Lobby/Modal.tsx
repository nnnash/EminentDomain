import React, {useState} from 'react'
import {useDispatch} from 'react-redux'
import {View, Text, SafeAreaView, Modal as RNModal, TextInput} from 'react-native'
import EStyle from 'react-native-extended-stylesheet'

import Button from '../common/Button'
import {createGame, joinGame} from '@actions/lobby'
import {useUser} from '../../utils'
import {Game} from '@types'

const styles = EStyle.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 6,
    padding: 20,
    width: 300,
  },
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
    <RNModal animationType="slide" visible={isOpen} transparent>
      <SafeAreaView style={styles.container}>
        <View style={styles.modal}>
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
                  setOpen(false)
                  dispatch(createGame.request({gameName: game, playerName: player, playerId: user.id}))
                }}
              />
            ) : (
              <Button
                title="Join"
                onClick={() => {
                  setOpen(false)
                  dispatch(joinGame.request({gameId: gameId, playerName: player, playerId: user.id}))
                }}
              />
            )}
          </View>
        </View>
      </SafeAreaView>
    </RNModal>
  )
}

export default Modal
