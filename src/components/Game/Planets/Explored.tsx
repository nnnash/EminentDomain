import React, {useState} from 'react'
import {Image, Text, TouchableOpacity, View} from 'react-native'
import {shallowEqual, useDispatch, useSelector} from 'react-redux'
import EStyle from 'react-native-extended-stylesheet'

import {Action, Planet} from '@types'
import {GlobalState} from '@reducers/index'
import {useUser} from '../../../utils'
import {planetProps} from './planetConfigs'
import FighterIcon from '../Icons/FighterIcon'
import Icon from '../Icons/Icon'
import Info from './Info'
import {reqPlayAction} from '@actions/game'

const styles = EStyle.create({
  $planetSize: 60,
  root: {
    flexDirection: 'row',
    marginTop: 20,
  },
  active: {
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 8,
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
  const {
    game: {players, id},
    ui: {activeColonize, activeWarfare},
  } = useSelector<GlobalState, GlobalState>(s => s, shallowEqual)
  const user = useUser()
  const dispatch = useDispatch()
  const player = players[user.id]
  const [openPlanet, setOpenPlanet] = useState<null | Planet>(null)

  if (!player) return null

  return (
    <>
      <View style={styles.root}>
        {player.planets.explored.map((planet, ind) => {
          const isWarfareActive = activeWarfare !== undefined && player.spaceships >= planet.cost.warfare
          const isActive = activeColonize !== undefined || isWarfareActive
          return (
            <TouchableOpacity
              onPress={() => {
                if (!isActive) return
                if (activeColonize !== undefined) {
                  dispatch(
                    reqPlayAction({type: Action.colonize, cardIndex: activeColonize, gameId: id, planetIndex: ind}),
                  )
                } else if (isWarfareActive) {
                  dispatch(
                    reqPlayAction({
                      type: Action.warfare,
                      cardIndex: activeWarfare as number,
                      gameId: id,
                      planetIndex: ind,
                    }),
                  )
                }
              }}
              key={`explored-planet-${ind}`}
              style={[styles.container, isActive ? styles.active : null]}>
              <View style={styles.costs}>
                <Text style={styles.costValue}>
                  <FighterIcon /> {planet.cost.warfare}
                </Text>
                <Text style={styles.costValue}>
                  <Icon action={Action.colonize} /> {planet.cost.colonize}
                  {!!planet.colonies && (
                    <Text>
                      (<Text style={styles.colonies}>{planet.colonies}</Text>)
                    </Text>
                  )}
                </Text>
              </View>
              <TouchableOpacity onPress={() => setOpenPlanet(planet)}>
                <Image source={planetProps[planet.type]} style={styles.image} />
              </TouchableOpacity>
            </TouchableOpacity>
          )
        })}
      </View>
      <Info open={!!openPlanet} onClose={() => setOpenPlanet(null)} planet={openPlanet} />
    </>
  )
}

export default Explored
