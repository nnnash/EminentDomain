import React from 'react'
import {View, Text, ScrollView} from 'react-native'
import {useSelector, shallowEqual} from 'react-redux'
import EStyle from 'react-native-extended-stylesheet'

import {Card as TCard} from '@types'
import {GlobalState} from '@reducers/index'
import {GameState} from '@reducers/game'
import Card from './Card'

const styles = EStyle.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    minWidth: '100%',
  },
  card: {
    borderWidth: 0,
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: 0,
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 8,
    shadowColor: 'white',
    shadowOpacity: 1,
    shadowRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, .15)',
    padding: 2,
  },
  badgeText: {
    color: '$textColor',
    fontSize: 12,
  },
})

const Board: React.FC<{}> = () => {
  const {cards} = useSelector<GlobalState, GameState>(state => state.game, shallowEqual)

  return (
    <ScrollView horizontal style={{overflow: 'visible'}}>
      <View style={styles.container}>
        {Object.entries(cards).map(([card, amount]) => (
          <View style={styles.card} key={`deck-${card}`}>
            <Card type={card as TCard} isBoard />
            <View style={styles.badge}>
              <Text style={styles.badgeText}>× {amount}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  )
}

export default Board
