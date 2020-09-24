import {combineReducers} from 'redux'

import {lobby} from './lobby'

const reducersMap = {
  lobby,
}

export type GlobalState = {[K in keyof typeof reducersMap]: ReturnType<typeof reducersMap[K]>}

export default combineReducers(reducersMap)
