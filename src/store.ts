import {createStore, applyMiddleware} from 'redux'
import {createEpicMiddleware} from 'redux-observable'
import {NavigationContainerRef} from '@react-navigation/native'
import {ajax} from 'rxjs/ajax'
import {composeWithDevTools} from 'redux-devtools-extension'
import createSocketIoMiddleware from 'redux-socket.io'
import io from 'socket.io-client'

import epics from './redux/epics'
import reducers from './redux/reducers/index'

const composeEnhancers = composeWithDevTools({})

const location = process.env.HOST || 'http://localhost:8000'

const socket = io(location)
const socketIoMiddleware = createSocketIoMiddleware(socket, 'socket/')

const navContainer = {
  nav: {} as NavigationContainerRef,
  setNav(nav: NavigationContainerRef) {
    Object.assign(this, {nav})
  },
}

const epicMiddleware = createEpicMiddleware({
  dependencies: {
    api: ajax,
    setNav(nav: NavigationContainerRef) {
      navContainer.setNav(nav)
    },
    nav(): NavigationContainerRef {
      return navContainer.nav
    },
  },
})

const store = createStore(reducers, composeEnhancers(applyMiddleware(socketIoMiddleware, epicMiddleware)))
epicMiddleware.run(epics)

export default store
