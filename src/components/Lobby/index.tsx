import React, {useState} from 'react'
import {useSelector, shallowEqual} from 'react-redux'
import {StyleSheet, View, Text} from 'react-native'

import {GlobalState} from '@reducers/index'
import {LobbyState} from '@reducers/lobby'
import PageWrapper from '../common/PageWrapper'
import Button from '../common/Button'
import Game from './Game'
import Modal from './Modal'

const styles = StyleSheet.create({
  header: {
    marginTop: 40,
    width: '100%',
  },
  text: {
    textAlign: 'center',
    color: 'white',
    textTransform: 'uppercase',
    textShadowColor: 'rgb(190,253,255)',
  },
  eminent: {
    fontSize: 40,
    fontWeight: '900',
    textShadowRadius: 15,
    letterSpacing: -1,
  },
  domain: {
    fontSize: 30,
    fontWeight: '300',
    textShadowRadius: 6,
    letterSpacing: 12,
    marginLeft: 10,
  },
  gamesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    margin: 20,
  },
  buttonContainer: {
    flexDirection: 'row-reverse',
    marginTop: 20,
    marginLeft: 20,
  },
})

const Lobby = () => {
  const {games} = useSelector<GlobalState, LobbyState>(state => state.lobby, shallowEqual)
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <PageWrapper>
      <View style={styles.header}>
        <Text style={[styles.eminent, styles.text]}>eminent</Text>
        <Text style={[styles.domain, styles.text]}>domain</Text>
      </View>
      <View style={styles.buttonContainer}>
        <Button title="+ New game" onClick={() => setModalOpen(true)} />
      </View>
      <View style={styles.gamesContainer}>
        {games.map((game, ind) => (
          <Game key={`game-${ind}`} game={game} />
        ))}
      </View>
      <Modal isOpen={modalOpen} setOpen={setModalOpen} />
    </PageWrapper>
  )
}

export const routeProps = {
  component: Lobby,
  options: {
    headerShown: false,
  },
}

export default Lobby
