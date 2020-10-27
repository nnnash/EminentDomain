import 'react-native-gesture-handler'
import React, {useRef, useEffect} from 'react'
import {Provider, useDispatch} from 'react-redux'
import {NavigationContainer, NavigationContainerRef} from '@react-navigation/native'
import {createStackNavigator} from '@react-navigation/stack'
import {StatusBar} from 'react-native'
import EStyle from 'react-native-extended-stylesheet'
import {SafeAreaProvider} from 'react-native-safe-area-context'

import {init} from '@actions/index'
import store from './store'
import {RootStackParamList} from './types'
import {routeProps as lobbyRouteProps} from './components/Lobby'
import {routeProps as gameRouteProps} from './components/Game'

const {Navigator, Screen} = createStackNavigator<RootStackParamList>()

const Nav = () => {
  const navRef = useRef<NavigationContainerRef | null>(null)
  const dispatch = useDispatch()
  useEffect(() => {
    if (navRef.current) dispatch(init(navRef.current))
  }, [dispatch, navRef])
  return (
    <NavigationContainer ref={navRef}>
      <Navigator>
        <Screen name="Lobby" {...lobbyRouteProps} />
        <Screen name="Game" {...gameRouteProps} />
      </Navigator>
    </NavigationContainer>
  )
}

EStyle.build({
  $textColor: 'white',
  $shadowColor: 'rgb(190,253,255)',
  $cardCorner: 8,
})

const App = () => {
  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <StatusBar barStyle="light-content" />
        <Nav />
      </Provider>
    </SafeAreaProvider>
  )
}

export default App
