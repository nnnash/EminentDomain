import React from 'react'
import {View, Text, ImageBackground, Animated} from 'react-native'
import EStyle from 'react-native-extended-stylesheet'

import {Card as TCard} from '@types'
import Icon, {DoubleIcon} from './Icon'

const styles = EStyle.create({
  $borderRadius: 8,
  root: {
    borderWidth: 1,
    borderRadius: '$borderRadius',
    height: 200,
    width: 142,
  },
  bg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: '$borderRadius',
    flexDirection: 'row',
    overflow: 'hidden',
  },
  image: {
    borderRadius: '$borderRadius',
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
})

const cardProps = {
  [TCard.envoy]: {
    colors: ['#6C9648'],
    icons: [require('../../img/radar.png')],
  },
  [TCard.warfare]: {
    colors: ['#9B3844'],
    icons: [require('../../img/arm-target.png')],
  },
  [TCard.politics]: {
    colors: ['#6A6D4E'],
    icons: [require('../../img/temple.png')],
  },
  [TCard.industry]: {
    colors: ['#B49C36', '#4B2E79'],
    icons: [require('../../img/factory.png'), require('../../img/refresh.png')],
  },
  [TCard.colonize]: {
    colors: ['#BC8635'],
    icons: [require('../../img/planet-earth.png')],
  },
}

interface CardProps {
  type: TCard
  margin?: Animated.AnimatedDivision
  width?: number
  index?: number
}
const Card: React.FC<CardProps> = ({type, index, margin, width = 142}) => {
  const {colors, icons} = cardProps[type]
  const height = width * 1.4
  return (
    <Animated.View
      style={[
        styles.root,
        {
          width,
          height,
          marginLeft: index && !!margin ? margin : 0,
        },
      ]}>
      <View style={{...styles.bg, backgroundColor: colors[0]}}>
        {colors.length > 1 &&
          Array.from({length: 100}).map((_, ind) => (
            <View
              key={`grad-${ind}`}
              style={{
                height: '100%',
                width: '1%',
                backgroundColor: colors[1],
                opacity: ind / 100,
              }}
            />
          ))}
      </View>
      <ImageBackground source={require('../../img/card.png')} style={{flex: 1}} imageStyle={styles.image}>
        <View style={styles.titleContainer}>
          <View style={styles.smallIconContainer}>
            {icons.length === 1 ? (
              <Icon image={icons[0]} color={colors[0]} width={width / 2} />
            ) : (
              <DoubleIcon
                icon1={{color: colors[0], image: icons[0], width: width / 2}}
                icon2={{color: colors[1], image: icons[1], width: width / 2}}
              />
            )}
          </View>
          <Text style={[styles.title, {fontSize: width / 11}]}>{type}</Text>
        </View>
        <View style={styles.mainIconContainer}>
          {icons.length === 1 ? (
            <Icon image={icons[0]} size="big" color={colors[0]} width={width / 2} />
          ) : (
            <DoubleIcon
              icon1={{color: colors[0], image: icons[0], width: width / 2}}
              icon2={{color: colors[1], image: icons[1], width: width / 2}}
              middle
            />
          )}
        </View>
      </ImageBackground>
    </Animated.View>
  )
}

export default Card
