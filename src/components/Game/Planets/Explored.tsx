import React, {useState} from 'react'
import {Image, Text, TouchableOpacity, View, Animated} from 'react-native'
import {shallowEqual, useDispatch, useSelector} from 'react-redux'
import EStyle from 'react-native-extended-stylesheet'

import {Action, ExploredPlanet, Planet} from '@types'
import {GlobalState} from '@reducers/index'
import {getRange, useFadeInOut, usePlayer, useUser} from '@clientUtils'
import {reqPlayAction, reqPlayRole} from '@actions/game'
import {setOptionsModalOpen} from '@actions/ui'
import {getPlanetColonizeCost} from '@common/utils'
import {planetProps} from './planetConfigs'
import FighterIcon from '../Icons/FighterIcon'
import Icon from '../Icons/Icon'
import Info from './Info'

const styles = EStyle.create({
  $planetSize: 60,
  root: {
    flexDirection: 'row',
    marginTop: 20,
    marginRight: 30,
  },
  container: {
    marginLeft: 20,
    alignItems: 'center',
  },
  animatedBackground: {
    borderRadius: 8,
    position: 'absolute',
    height: '100%',
    width: '100%',
    backgroundColor: 'white',
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

interface ViewProps {
  planet: ExploredPlanet
  onClick?: () => void
  isActive: boolean
  onIconClick?: () => void
}
export const ExploredPlanetView: React.FC<ViewProps> = ({planet, onClick, isActive, onIconClick}) => {
  const player = usePlayer()
  const opacity = useFadeInOut(0.5, 0.1)
  return (
    <TouchableOpacity onPress={onClick} style={styles.container}>
      <Animated.View style={isActive ? [styles.animatedBackground, {opacity}] : null} />
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
      <TouchableOpacity onPress={onIconClick}>
        <Image source={planetProps[planet.type]} style={styles.image} />
      </TouchableOpacity>
    </TouchableOpacity>
  )
}

const Explored: React.FC<{}> = () => {
  const {
    game: {players, id, activePlayer, rolePlayer},
    ui: {activeColonize, activeWarfare},
  } = useSelector<GlobalState, GlobalState>(s => s, shallowEqual)
  const user = useUser()
  const dispatch = useDispatch()
  const player = players[user.id]
  const [openPlanet, setOpenPlanet] = useState<null | Planet>(null)
  const isLeader = activePlayer === rolePlayer

  if (!player) return null

  const onPlanetClick = (isActive: boolean, ind: number, planet: ExploredPlanet, isWarfareActive: boolean) => () => {
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
        if (getPlanetColonizeCost(planet, player) <= planet.colonies) {
          dispatch(reqPlayRole({type: Action.colonize, gameId: id, amount: 1, planetIndex: ind}))
        } else {
          const range = getRange({players}, user.id, Action.colonize, isLeader, planet)
          if (range.to === 1) {
            dispatch(reqPlayRole({type: Action.colonize, amount: 1, gameId: id, planetIndex: ind}))
          } else {
            dispatch(setOptionsModalOpen({action: Action.colonize, open: true, range, planetIndex: ind}))
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
  }

  return (
    <>
      <View style={styles.root}>
        {player.planets.explored.map((planet, ind) => {
          const isWarfareActive =
            (activeWarfare?.isLeader || activeWarfare?.isAction) && player.spaceships >= planet.cost.warfare
          const isColonizeActive =
            activeColonize &&
            (activeColonize.isAction || isLeader || planet.colonies < getPlanetColonizeCost(planet, player))
          const isActive = Boolean(isColonizeActive || isWarfareActive)
          return (
            <ExploredPlanetView
              key={`explored-planet-${ind}`}
              planet={planet}
              onClick={onPlanetClick(isActive, ind, planet, !!isWarfareActive)}
              isActive={isActive}
              onIconClick={() => setOpenPlanet(planet)}
            />
          )
        })}
      </View>
      <Info open={!!openPlanet} onClose={() => setOpenPlanet(null)} planet={openPlanet} />
    </>
  )
}

export default Explored
