import React from 'react'
import {Text, View} from 'react-native'
import EStyle from 'react-native-extended-stylesheet'

import {Action, ExploredPlanet, OccupiedPlanet, Planet} from '@types'
import Button from '../../common/Button'
import Modal from '../../common/Modal'
import Icon from '../Icons/Icon'
import PointIcon from '../Icons/PointIcon'
import FighterIcon from '../Icons/FighterIcon'
import ResourceIcon from '../Icons/ResourceIcon'
import CapacityIcon from '../Icons/CapacityIcon'

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
  infoBlock: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 4,
    padding: 5,
    paddingTop: 15,
    marginTop: -10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
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

interface InfoProps {
  open: boolean
  onClose: () => void
  planet: Planet | null
}
const Info: React.FC<InfoProps> = ({open, onClose, planet}) => {
  const isOccupied = !!planet && getIsOccupied(planet)
  return (
    <Modal animationType="fade" visible={open} transparent>
      {!!planet && (
        <>
          <View style={styles.mainTitle}>
            <Title>{planet.type} planet</Title>
          </View>
          {!isOccupied && (
            <>
              <Title>Cost</Title>
              <View style={styles.infoBlock}>
                <Text style={styles.costValue}>
                  <FighterIcon /> {planet.cost.warfare}
                </Text>
                <Text style={styles.costValue}>
                  <Icon action={Action.colonize} /> {planet.cost.colonize}
                </Text>
              </View>
              {!!(planet as ExploredPlanet).colonies && (
                <>
                  <Title>Colonies placed</Title>
                  <View style={styles.infoBlock}>
                    <Txt>{(planet as ExploredPlanet).colonies}</Txt>
                  </View>
                </>
              )}
            </>
          )}
          <Title>Bonuses</Title>
          <View style={styles.infoBlock}>
            <PointIcon amount={planet.points} />
            {planet.resources.map((resource, ind) => (
              <ResourceIcon key={`resource-${ind}`} resource={resource} />
            ))}
            {!planet.cardCapacity && <CapacityIcon />}
          </View>
        </>
      )}
      <Button title="Close" onClick={() => onClose()} />
    </Modal>
  )
}

export default Info
