import React from 'react'
import {ScrollView, ImageBackground, View} from 'react-native'
import {useHeaderHeight} from '@react-navigation/stack'
import EStyle from 'react-native-extended-stylesheet'
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context'

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
  safeView: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    marginBottom: 10,
  },
})

interface PageWrapperProps {
  scrollable?: boolean
}
const PageWrapper: React.FC<PageWrapperProps> = ({children, scrollable = true}) => {
  const headerHeight = useHeaderHeight()
  const {top, bottom} = useSafeAreaInsets()
  return (
    <ImageBackground source={require('../../img/ed.jpg')} style={{flex: 1}}>
      <SafeAreaView style={{...style.safeView, marginBottom: bottom}}>
        <View style={{height: top, ...(headerHeight ? style.header : null)}} />
        {scrollable ? (
          <ScrollView contentInsetAdjustmentBehavior="automatic">{children}</ScrollView>
        ) : (
          <View style={style.content}>{children}</View>
        )}
      </SafeAreaView>
    </ImageBackground>
  )
}

export default PageWrapper
