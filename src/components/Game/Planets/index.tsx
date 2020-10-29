import React from 'react'
import {ScrollView, StyleSheet, View} from 'react-native'

import Explored from './Explored'
import Occupied from './Occupied'

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    minWidth: '100%',
  },
})

export const Planets: React.FC<{}> = () => {
  return (
    <ScrollView horizontal style={{width: '100%'}}>
      <View style={styles.root}>
        <Explored />
        <Occupied />
      </View>
    </ScrollView>
  )
}

export default Planets
