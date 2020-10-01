import 'react-native-gesture-handler'
import React, {useRef, useEffect} from 'react'
import {Provider, useDispatch} from 'react-redux'
import {NavigationContainer, NavigationContainerRef} from '@react-navigation/native'
import {createStackNavigator} from '@react-navigation/stack'
import {StatusBar} from 'react-native'

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

const App = () => {
  return (
    <Provider store={store}>
      <StatusBar barStyle="light-content" />
      <Nav />
    </Provider>
  )
}

export default App
