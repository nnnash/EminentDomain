import React, {useState} from 'react'
import {useDispatch} from 'react-redux'
import {StyleSheet, View, Text, SafeAreaView, Modal as RNModal, TextInput} from 'react-native'

import Button from '../common/Button'
import {createGame} from '@actions/lobby'

const styles = StyleSheet.create({
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
    color: 'white',
    textTransform: 'uppercase',
    textShadowColor: 'white',
    fontSize: 30,
    fontWeight: '900',
    textShadowRadius: 15,
    marginBottom: 20,
  },
  label: {
    color: 'white',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 4,
    marginBottom: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    color: 'white',
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
}

const Modal: React.FC<ModalProps> = ({isOpen, setOpen}) => {
  const dispatch = useDispatch()
  const [game, setGame] = useState('')
  const [player, setPlayer] = useState('')

  return (
    <RNModal animationType="slide" visible={isOpen} transparent>
      <SafeAreaView style={styles.container}>
        <View style={styles.modal}>
          <Text style={styles.title}>New game</Text>
          <Text style={styles.label}>Game name</Text>
          <TextInput style={styles.input} onChangeText={val => setGame(val)} />
          <Text style={styles.label}>Player name</Text>
          <TextInput style={styles.input} onChangeText={val => setPlayer(val)} />
          <View style={styles.buttons}>
            <Button title="Cancel" onClick={() => setOpen(false)} />
            <Button
              title="Create"
              onClick={() => {
                setOpen(false)
                dispatch(createGame.request({gameName: game, playerName: player}))
              }}
            />
          </View>
        </View>
      </SafeAreaView>
    </RNModal>
  )
}

export default Modal
