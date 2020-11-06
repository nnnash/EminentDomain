import React, {useState} from 'react'
import {Image, Text, TouchableOpacity, View} from 'react-native'
import {shallowEqual, useDispatch, useSelector} from 'react-redux'
import EStyle from 'react-native-extended-stylesheet'

import {Action, Card, Planet} from '@types'
import {GlobalState} from '@reducers/index'
import {useUser} from '../../../utils'
import {planetProps} from './planetConfigs'
import FighterIcon from '../Icons/FighterIcon'
import Icon from '../Icons/Icon'
import Info from './Info'
import {reqPlayAction, reqPlayRole} from '@actions/game'
import {setOptionsModalOpen} from '@actions/ui'
import {getPlanetColonizeCost} from '../../../../common/utils'

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
    game: {players, id, activePlayer},
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
          const isWarfareActive =
            (activeWarfare?.isLeader || activeWarfare?.isAction) && player.spaceships >= planet.cost.warfare
          const isActive = activeColonize || isWarfareActive
          return (
            <TouchableOpacity
              onPress={() => {
                if (!isActive) return
                if (activeColonize) {
                  if (activeColonize.isAction) {
                    dispatch(
                      reqPlayAction({
                        type: Action.colonize,
                        cardIndex: activeColonize.cardIndex || 0,
                        gameId: id,
                        planetIndex: ind,
                      }),
                    )
                  } else {
                    const isLeader = activePlayer === user.id
                    if (getPlanetColonizeCost(planet, player) <= planet.colonies) {
                      dispatch(reqPlayRole({type: Action.colonize, gameId: id, amount: 1, planetIndex: ind}))
                    } else {
                      const colonizeCards = player.cards.hand.filter(c => c === Card.colonize).length
                      if (!colonizeCards) {
                        dispatch(
                          reqPlayRole({type: Action.colonize, amount: Number(isLeader), gameId: id, planetIndex: ind}),
                        )
                      } else {
                        dispatch(
                          setOptionsModalOpen({
                            action: Action.colonize,
                            open: true,
                            range: {
                              from: Number(isLeader),
                              to: Math.min(colonizeCards + Number(isLeader), getPlanetColonizeCost(planet, player)),
                            },
                            planetIndex: ind,
                          }),
                        )
                      }
                    }
                  }
                } else if (isWarfareActive) {
                  if (activeWarfare?.isAction) {
                    dispatch(
                      reqPlayAction({
                        type: Action.warfare,
                        cardIndex: activeWarfare.cardIndex || 0,
                        gameId: id,
                        planetIndex: ind,
                      }),
                    )
                  } else {
                    dispatch(
                      reqPlayRole({
                        type: Action.warfare,
                        planetIndex: ind,
                        gameId: id,
                        amount: 1,
                      }),
                    )
                  }
                }
              }}
              key={`explored-planet-${ind}`}
              style={[styles.container, isActive ? styles.active : null]}>
              <View style={styles.costs}>
                <Text style={styles.costValue}>
                  <FighterIcon /> {planet.cost.warfare}
                </Text>
                <Text style={styles.costValue}>
                  <Icon action={Action.colonize} /> {getPlanetColonizeCost(planet, player)}
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
