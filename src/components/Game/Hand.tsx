import React from 'react'
import {View, ScrollView} from 'react-native'
import {useSelector, shallowEqual} from 'react-redux'
import EStyle from 'react-native-extended-stylesheet'

import {GlobalState} from '@reducers/index'
import {GameState} from '@reducers/game'
import {useUser} from '../../utils'
import Card from './Card'

const styles = EStyle.create({
  root: {
    flexDirection: 'row',
    marginTop: 20,
  },
  card: {
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 4,
    padding: 10,
    height: 200,
  },
})

const Hand: React.FC<{}> = () => {
  const {players} = useSelector<GlobalState, GameState>(state => state.game, shallowEqual)
  const user = useUser()
  const player = players[user.id]
  if (!player) return null

  return (
    <ScrollView horizontal>
      <View style={styles.root}>
        {player.cards.hand.map((card, ind) => (
          <Card type={card} key={`player-card-${ind}`} />
        ))}
      </View>
    </ScrollView>
  )
}

export default Hand
