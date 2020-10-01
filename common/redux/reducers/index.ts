import {combineReducers} from 'redux'

import {lobby} from './lobby'
import {game} from './game'

const reducersMap = {
  game,
  lobby,
}

export type GlobalState = {[K in keyof typeof reducersMap]: ReturnType<typeof reducersMap[K]>}

export default combineReducers(reducersMap)
