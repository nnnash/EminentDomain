import {combineReducers} from 'redux'

import {lobby} from './lobby'
import {game} from './game'
import {user} from './user'
import {ui} from './ui'

const reducersMap = {
  game,
  lobby,
  ui,
  user,
}

export type GlobalState = {[K in keyof typeof reducersMap]: ReturnType<typeof reducersMap[K]>}

export default combineReducers(reducersMap)
