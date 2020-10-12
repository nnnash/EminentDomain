import React from 'react'
import {View, Text, ImageBackground} from 'react-native'
import EStyle from 'react-native-extended-stylesheet'

import {Card as TCard} from '@types'

const styles = EStyle.create({
  $borderRadius: 8,
  root: {
    borderWidth: 1,
    borderRadius: '$borderRadius',
    height: 200,
    width: 142,
  },
  image: {
    borderRadius: '$borderRadius',
  },
  titleContainer: {
    marginTop: 4,
    width: '100%',
  },
  title: {
    color: '$textColor',
    textAlign: 'center',
    textTransform: 'uppercase',
    textShadowColor: '$shadowColor',
    textShadowRadius: 15,
    fontSize: 12,
  },
})

const cardProps = {
  [TCard.envoy]: {
    color: ['#6C9648'],
    icon: ['radar'],
  },
  [TCard.warfare]: {
    color: ['#9B3844'],
    icon: ['arm-target'],
  },
  [TCard.politics]: {
    color: ['#6A6D4E'],
    icon: ['temple'],
  },
  [TCard.industry]: {
    color: ['#B49C36', '#4B2E79'],
    icon: ['factory', 'refresh'],
  },
  [TCard.colonization]: {
    color: ['#BC8635'],
    icon: ['planet-earth'],
  },
}

interface CardProps {
  type: TCard
}
const Card: React.FC<CardProps> = ({type}) => {
  return (
    <View style={styles.root}>
      <ImageBackground source={require('../../img/card.png')} style={{flex: 1}} imageStyle={styles.image}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{type}</Text>
        </View>
      </ImageBackground>
    </View>
  )
}

export default Card
