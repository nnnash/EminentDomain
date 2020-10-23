import React, {useState} from 'react'
import {Image, ScrollView, Text, View, TouchableOpacity} from 'react-native'
import {shallowEqual, useSelector} from 'react-redux'
import EStyle from 'react-native-extended-stylesheet'

import {Action, Planet} from '@types'
import {GlobalState} from '@reducers/index'
import {GameState} from '@reducers/game'
import {useUser} from '../../../utils'
import {planetProps} from './planetConfigs'
import FighterIcon from '../Icons/FighterIcon'
import Icon from '../Icons/Icon'
import Info from './Info'

const styles = EStyle.create({
  $planetSize: 60,
  root: {
    flexDirection: 'row',
    marginTop: 20,
  },
  container: {
    marginLeft: 20,
    alignItems: 'center',
  },
  image: {
    height: '$planetSize',
    width: '$planetSize',
    shadowColor: 'black',
    shadowOpacity: 1,
    shadowOffset: {
      height: -1,
    },
    shadowRadius: 4,
  },
  costs: {
    alignItems: 'center',
  },
  costValue: {
    color: '$textColor',
    fontSize: 18,
    fontWeight: 'bold',
    shadowColor: 'white',
    shadowOpacity: 1,
    shadowOffset: {
      height: -1,
    },
    shadowRadius: 4,
  },
  colonies: {
    color: '#bc4a2d',
  },
})

const Explored: React.FC<{}> = () => {
  const {players} = useSelector<GlobalState, GameState>(state => state.game, shallowEqual)
  const user = useUser()
  const player = players[user.id]
  const [openPlanet, setOpenPlanet] = useState<null | Planet>(null)

  if (!player) return null

  return (
    <ScrollView horizontal>
      <View style={styles.root}>
        {player.planets.explored.map((planet, ind) => (
          <View key={`explored-planet-${ind}`} style={styles.container}>
            <View style={styles.costs}>
              <Text style={styles.costValue}>
                <FighterIcon /> {planet.cost.warfare}
              </Text>
              <Text style={styles.costValue}>
                <Icon action={Action.colonize} /> {planet.cost.colonize}
                {!!planet.colonies && <Text style={styles.colonies}>{planet.colonies}</Text>}
              </Text>
            </View>
            <TouchableOpacity onPress={() => setOpenPlanet(planet)}>
              <Image source={planetProps[planet.type]} style={styles.image} />
            </TouchableOpacity>
          </View>
        ))}
      </View>
      <Info open={!!openPlanet} onClose={() => setOpenPlanet(null)} planet={openPlanet} />
    </ScrollView>
  )
}

export default Explored
