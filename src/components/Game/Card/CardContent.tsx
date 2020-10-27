import React from 'react'
import {View, Text, ImageBackground} from 'react-native'
import EStyle from 'react-native-extended-stylesheet'

import {Card as TCard} from '@types'
import Icon, {DoubleIcon} from '../Icons/Icon'
import Info from './Info'
import {cardProps, actionProps} from '../cardConfigs'

const styles = EStyle.create({
  bg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: '$cardCorner',
    flexDirection: 'row',
    overflow: 'hidden',
  },
  image: {
    borderRadius: '$cardCorner - 2',
  },
  imageComp: {
    borderRadius: '$cardCorner',
    width: '100%',
    flex: 1,
    borderWidth: 1,
  },
  titleContainer: {
    marginTop: '3%',
    width: '100%',
  },
  smallIconContainer: {
    position: 'absolute',
    left: '3%',
    top: 0,
  },
  title: {
    color: '$textColor',
    textAlign: 'center',
    textTransform: 'uppercase',
    textShadowColor: '$shadowColor',
    textShadowRadius: 15,
  },
  mainIconContainer: {
    marginTop: '16%',
    height: '40%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoContainer: {
    marginTop: '10%',
    flexGrow: 1,
    justifyContent: 'center',
    padding: 10,
  },
})

interface CardProps {
  type: TCard
  width: number
}
const CardContent: React.FC<CardProps> = ({type, width}) => {
  const {actions} = cardProps[type]
  const actionConfigs = actions.map(a => actionProps[a])
  const baseIconWidth = width / 2

  return (
    <>
      <View style={{...styles.bg, backgroundColor: actionConfigs[0].color}}>
        {actions.length > 1 &&
          Array.from({length: 100}).map((_, ind) => (
            <View
              key={`grad-${ind}`}
              style={{
                height: '100%',
                width: '1%',
                backgroundColor: actionConfigs[1].color,
                opacity: ind / 100,
              }}
            />
          ))}
      </View>
      <ImageBackground source={require('../../../img/card.png')} imageStyle={styles.image} style={styles.imageComp}>
        <View style={styles.titleContainer}>
          <View style={styles.smallIconContainer}>
            {actions.length === 1 ? (
              <Icon action={actions[0]} width={baseIconWidth} />
            ) : (
              <DoubleIcon
                icon1={{action: actions[0], width: baseIconWidth}}
                icon2={{action: actions[1], width: baseIconWidth}}
              />
            )}
          </View>
          <Text style={[styles.title, {fontSize: width / 11}]}>{type}</Text>
        </View>
        <View style={styles.mainIconContainer}>
          {actions.length === 1 ? (
            <Icon action={actions[0]} size="big" width={baseIconWidth} />
          ) : (
            <DoubleIcon
              icon1={{action: actions[0], width: baseIconWidth}}
              icon2={{action: actions[1], width: baseIconWidth}}
              middle
            />
          )}
        </View>
        <View style={styles.infoContainer}>
          <Info type={type} />
        </View>
      </ImageBackground>
    </>
  )
}

export default CardContent
