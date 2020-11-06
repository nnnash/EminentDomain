import React from 'react'
import {Text, View} from 'react-native'
import EStyle from 'react-native-extended-stylesheet'

import {Action, ExploredPlanet, OccupiedPlanet, Planet, Resource} from '@types'
import Button from '../../common/Button'
import Modal from '../../common/Modal'
import ModalInfoBlock from '../../common/ModalInfoBlock'
import Icon from '../Icons/Icon'
import PointIcon from '../Icons/PointIcon'
import FighterIcon from '../Icons/FighterIcon'
import ResourceIcon from '../Icons/ResourceIcon'
import CapacityIcon from '../Icons/CapacityIcon'
import {getPlanetColonizeCost} from '../../../../common/utils'
import {usePlayer} from '../../../utils'

const styles = EStyle.create({
  mainTitle: {
    alignItems: 'center',
    marginBottom: 10,
  },
  text: {
    color: '$textColor',
    lineHeight: 28,
  },
  title: {
    lineHeight: 20,
    color: '$textColor',
    textTransform: 'uppercase',
    textShadowColor: 'white',
    fontSize: 16,
    fontWeight: '600',
    textShadowRadius: 15,
  },
  costValue: {
    color: '$textColor',
    fontSize: 26,
    fontWeight: 'bold',
    shadowColor: 'white',
    shadowOpacity: 1,
    shadowOffset: {
      height: -1,
    },
    shadowRadius: 4,
  },
})

const Txt: React.FC<{}> = ({children}) => <Text style={styles.text}>{children}</Text>
const Title: React.FC<{}> = ({children}) => <Text style={styles.title}>{children}</Text>

const getIsOccupied = (planet: Planet): planet is OccupiedPlanet => 'production' in planet

const ResourceProduction: React.FC<{title: string; resources: Array<Resource>}> = ({title, resources}) => (
  <ModalInfoBlock title={title}>
    {resources.map((type, ind) => (
      <ResourceIcon key={`${title}-resource-${ind}`} resource={type} />
    ))}
  </ModalInfoBlock>
)

interface InfoProps {
  open: boolean
  onClose: () => void
  planet: Planet | null
}
const Info: React.FC<InfoProps> = ({open, onClose, planet}) => {
  const player = usePlayer()
  const isOccupied = !!planet && getIsOccupied(planet)
  let free: Array<Resource> = [],
    placed: Array<Resource> = []
  if (isOccupied) {
    ;({free, placed} = (planet as OccupiedPlanet).production.reduce<{free: Array<Resource>; placed: Array<Resource>}>(
      (acc, item) => {
        if (item.produced) acc.placed.push(item.type)
        else acc.free.push(item.type)
        return acc
      },
      {free: [], placed: []},
    ))
  }
  return (
    <Modal animationType="fade" visible={open}>
      {!!planet && (
        <>
          <View style={styles.mainTitle}>
            <Title>{planet.type} planet</Title>
          </View>
          {!isOccupied ? (
            <>
              <ModalInfoBlock title="Cost">
                <Text style={styles.costValue}>
                  <FighterIcon /> {planet.cost.warfare}
                </Text>
                <Text style={styles.costValue}>
                  <Icon action={Action.colonize} /> {getPlanetColonizeCost(planet, player)}
                </Text>
              </ModalInfoBlock>
              {!!(planet as ExploredPlanet).colonies && (
                <ModalInfoBlock title="Colonies placed">
                  <Txt>{(planet as ExploredPlanet).colonies}</Txt>
                </ModalInfoBlock>
              )}
            </>
          ) : (
            <>
              {!!free.length && <ResourceProduction title="Available resources" resources={free} />}
              {!!placed.length && <ResourceProduction title="Produced resources" resources={placed} />}
            </>
          )}
          <ModalInfoBlock title="Bonuses">
            <PointIcon amount={planet.points} />
            {planet.resources.map((resource, ind) => (
              <ResourceIcon key={`resource-${ind}`} resource={resource} />
            ))}
            {planet.cardCapacity && <CapacityIcon />}
            {!!planet.action && <Icon action={planet.action} />}
          </ModalInfoBlock>
        </>
      )}
      <Button title="Close" onClick={() => onClose()} />
    </Modal>
  )
}

export default Info
