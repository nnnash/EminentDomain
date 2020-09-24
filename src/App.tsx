import 'react-native-gesture-handler'
import React from 'react'
import {Provider} from 'react-redux'
import {NavigationContainer} from '@react-navigation/native'
import {createStackNavigator} from '@react-navigation/stack'

import store from './store'
import {RootStackParamList} from './types'
import {routeProps as lobbyRouteProps} from './components/Lobby'
import {routeProps as gameRouteProps} from './components/Game'

const {Navigator, Screen} = createStackNavigator<RootStackParamList>()

const App = () => {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Navigator>
          <Screen name="Lobby" {...lobbyRouteProps} />
          <Screen name="Game" {...gameRouteProps} />
        </Navigator>
      </NavigationContainer>
    </Provider>
  )
}

export default App
