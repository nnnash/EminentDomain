import React from 'react'
import {View, Text} from 'react-native'
import {useSelector, shallowEqual} from 'react-redux'

import {GlobalState} from '@reducers/index'
import {GameState} from '@reducers/game'

const Board: React.FC<{}> = () => {
  const {cards} = useSelector<GlobalState, GameState>(state => state.game, shallowEqual)

  return (
    <View>
      {Object.entries(cards).map(([card, amount]) => (
        <View style={{borderWidth: 1, borderColor: 'white'}} key={`deck-${card}`}>
          <Text>{card}</Text>
          <Text>{amount}</Text>
        </View>
      ))}
    </View>
  )
}

export default Board
