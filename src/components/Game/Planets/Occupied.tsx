import React, {useState} from 'react'
import {Image, TouchableOpacity, View} from 'react-native'
import {shallowEqual, useSelector} from 'react-redux'
import EStyle from 'react-native-extended-stylesheet'

import {Planet} from '@types'
import {GlobalState} from '@reducers/index'
import {useUser} from '@clientUtils'
import {planetProps} from './planetConfigs'
import ResourceIcon from '../Icons/ResourceIcon'
import Icon from '../Icons/Icon'
import Info from './Info'

const styles = EStyle.create({
  $planetSize: 60,
  root: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginTop: 20,
  },
  active: {
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 8,
  },
  container: {
    marginRight: 20,
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
  resources: {
    alignItems: 'center',
  },
  action: {
    position: 'absolute',
    right: 0,
    bottom: 36,
  },
})

const Occupied: React.FC<{}> = () => {
  const {
    game: {players},
  } = useSelector<GlobalState, GlobalState>(s => s, shallowEqual)
  const user = useUser()
  const player = players[user.id]
  const [openPlanet, setOpenPlanet] = useState<null | Planet>(null)

  if (!player) return null

  return (
    <>
      <View style={styles.root}>
        {player.planets.occupied.map((planet, ind) => {
          return (
            <View key={`occupied-planet-${ind}`} style={styles.container}>
              <View style={styles.resources}>
                {planet.production.map((res, index) => (
                  <ResourceIcon
                    resource={res.type}
                    key={`planet-${ind}-resource-${index}`}
                    style={{opacity: res.produced ? 1 : 0.4}}
                  />
                ))}
              </View>
              <TouchableOpacity onPress={() => setOpenPlanet(planet)}>
                <Image source={planetProps[planet.type]} style={styles.image} />
              </TouchableOpacity>
              {!!planet.action && <Icon style={styles.action} action={planet.action} />}
            </View>
          )
        })}
      </View>
      <Info open={!!openPlanet} onClose={() => setOpenPlanet(null)} planet={openPlanet} />
    </>
  )
}

export default Occupied
