import React from 'react'
import {ScrollView, StyleSheet, View} from 'react-native'

import Explored from './Explored'
import Occupied from './Occupied'

const styles = StyleSheet.create({
  root: {
    width: '100%',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    minWidth: '100%',
  },
})

export const Planets: React.FC<{}> = () => {
  return (
    <ScrollView horizontal style={styles.root}>
      <View style={styles.container}>
        <Explored />
        <Occupied />
      </View>
    </ScrollView>
  )
}

export default Planets
