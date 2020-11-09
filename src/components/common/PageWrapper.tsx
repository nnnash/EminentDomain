import React from 'react'
import {ScrollView, ImageBackground, View} from 'react-native'
import {useHeaderHeight} from '@react-navigation/stack'
import EStyle from 'react-native-extended-stylesheet'
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context'
import {memoize} from 'lodash'

const getStyle = memoize((dif: number) =>
  EStyle.create({
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
      height: '100%',
    },
    scrollContent: {
      minHeight: `100% - ${dif}`,
    },
  }),
)

interface PageWrapperProps {
  scrollable?: boolean
}
const PageWrapper: React.FC<PageWrapperProps> = ({children, scrollable = true}) => {
  const headerHeight = useHeaderHeight()
  const {top, bottom} = useSafeAreaInsets()
  const style = getStyle(headerHeight + bottom)
  return (
    <ImageBackground source={require('../../img/ed.jpg')} style={{flex: 1}}>
      <SafeAreaView style={{...style.safeView, marginBottom: bottom}}>
        <View style={{height: headerHeight - top, ...(headerHeight ? style.header : null)}} />
        {scrollable ? (
          <ScrollView contentInsetAdjustmentBehavior="automatic" style={style.scrollContent}>
            {children}
          </ScrollView>
        ) : (
          <View style={style.content}>{children}</View>
        )}
      </SafeAreaView>
    </ImageBackground>
  )
}

export default PageWrapper
