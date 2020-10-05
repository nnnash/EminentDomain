import React from 'react'
import {SafeAreaView, ScrollView, ImageBackground, View} from 'react-native'
import {useHeaderHeight} from '@react-navigation/stack'
import EStyle from 'react-native-extended-stylesheet'

const style = EStyle.create({
  header: {
    borderBottomColor: 'white',
    borderBottomWidth: 1,
    shadowColor: 'white',
    shadowOffset: {
      height: 2,
      width: 0,
    },
    shadowOpacity: 1,
  },
})

const PageWrapper: React.FC<{}> = ({children}) => {
  const headerHeight = useHeaderHeight()
  return (
    <ImageBackground source={require('../../img/ed.jpg')} style={{flex: 1}}>
      <View style={{height: headerHeight, ...(headerHeight ? style.header : null)}} />
      <SafeAreaView style={{marginBottom: headerHeight}}>
        <ScrollView contentInsetAdjustmentBehavior="automatic">{children}</ScrollView>
      </SafeAreaView>
    </ImageBackground>
  )
}

export default PageWrapper
