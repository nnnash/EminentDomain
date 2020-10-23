import React, {useState} from 'react'
import {Text, TouchableOpacity, View} from 'react-native'
import EStyle from 'react-native-extended-stylesheet'

import {Action, Card as TCard} from '@types'
import {cardProps} from '../cardConfigs'
import Button from '../../common/Button'
import Modal from '../../common/Modal'
import Icon from '../Icons/Icon'
import PointIcon from '../Icons/PointIcon'
import FighterIcon from '../Icons/FighterIcon'

const styles = EStyle.create({
  info: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
    padding: 2,
  },
  infoText: {
    textAlign: 'center',
    color: '$textColor',
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
  iconWrapper: {
    alignItems: 'center',
    margin: 10,
  },
  infoBlock: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 4,
    padding: 5,
    paddingTop: 15,
    marginTop: -10,
    marginBottom: 10,
  },
})

const Txt: React.FC<{}> = ({children}) => <Text style={styles.text}>{children}</Text>
const Title: React.FC<{}> = ({children}) => <Text style={styles.title}>{children}</Text>

const infoContent = {
  [Action.envoy]: {
    icon: <Icon action={Action.envoy} />,
    action: <Txt>Draw 2 cards</Txt>,
    role: (
      <Txt>
        Look at <Icon action={Action.envoy} /> - 1 planet cards, keep 1
      </Txt>
    ),
    leader: (
      <Txt>
        + <Icon action={Action.envoy} />
      </Txt>
    ),
  },
  [Action.warfare]: {
    icon: <Icon action={Action.warfare} />,
    action: (
      <Txt>
        Attack 1 planet OR collect 1 <FighterIcon />
      </Txt>
    ),
    role: (
      <Txt>
        Collect 1 <FighterIcon /> per <Icon action={Action.warfare} />
      </Txt>
    ),
    leader: <Txt>May attack 1 planet instead</Txt>,
  },
  [Action.colonize]: {
    icon: <Icon action={Action.colonize} />,
    action: <Txt>Settle 1 planet OR +1 colony</Txt>,
    role: (
      <Txt>
        +1 colony per <Icon action={Action.colonize} />
      </Txt>
    ),
    leader: <Txt>May settle 1 planet instead</Txt>,
  },
  [Action.politics]: {
    icon: <Icon action={Action.politics} />,
    action: <Txt>Remove this card from the game. Take any 1 Role card from the stacks into your hand.</Txt>,
  },
  [Action.produce]: {
    icon: <Icon action={Action.produce} />,
    action: <Txt>Produce 1 resource</Txt>,
    role: (
      <Txt>
        Produce 1 resource per <Icon action={Action.produce} />
      </Txt>
    ),
  },
  [Action.sell]: {
    icon: <Icon action={Action.sell} />,
    action: (
      <Txt>
        Trade 1 resource for <PointIcon />
      </Txt>
    ),
    role: (
      <Txt>
        Trade 1 resource per <Icon action={Action.sell} /> for Point each
      </Txt>
    ),
  },
}

interface InfoProps {
  type: TCard
}
const Info: React.FC<InfoProps> = ({type}) => {
  const {actions} = cardProps[type]
  const [open, setOpen] = useState(false)

  return (
    <>
      <TouchableOpacity style={styles.info} onPress={() => setOpen(true)}>
        <Text style={styles.infoText}>Info</Text>
      </TouchableOpacity>
      <Modal animationType="fade" visible={open} transparent>
        {actions.map(a => {
          const action = infoContent[a]
          return (
            <View key={`action-${a}-info`}>
              <View style={styles.iconWrapper}>
                <Title>
                  {a} {action.icon}
                </Title>
              </View>
              <Title>Action</Title>
              <View style={styles.infoBlock}>{action.action}</View>
              {'role' in action && (
                <>
                  <Title>Role</Title>
                  <View style={styles.infoBlock}>
                    {action.role}
                    {'leader' in action && (
                      <View>
                        <Txt>
                          <Text style={{color: 'yellow'}}>Leader:</Text> {action.leader}
                        </Txt>
                      </View>
                    )}
                  </View>
                </>
              )}
            </View>
          )
        })}
        <Button title="Close" onClick={() => setOpen(false)} />
      </Modal>
    </>
  )
}

export default Info
