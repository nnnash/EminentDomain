import {createStore, applyMiddleware} from 'redux'
import {createEpicMiddleware} from 'redux-observable'
import {ajax} from 'rxjs/ajax'
import {composeWithDevTools} from 'redux-devtools-extension'
import createSocketIoMiddleware from 'redux-socket.io'
import io from 'socket.io-client'

import epics from '../common/redux/epics'
import reducers from '../common/redux/reducers/index'

const composeEnhancers = composeWithDevTools({})

const location = process.env.HOST || 'http://localhost:8000'

const socket = io(location)
const socketIoMiddleware = createSocketIoMiddleware(socket, 'socket/')

const epicMiddleware = createEpicMiddleware({
  dependencies: {
    api: ajax,
  },
})

const store = createStore(reducers, composeEnhancers(applyMiddleware(socketIoMiddleware, epicMiddleware)))
epicMiddleware.run(epics)

export default store
