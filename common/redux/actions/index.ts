import {ActionType, createAction} from 'typesafe-actions'
import {NavigationContainerRef} from '@react-navigation/native'

import * as game from './game'
import * as lobby from './lobby'
import * as ui from './ui'
import * as user from './user'

export const init = createAction('INIT')<NavigationContainerRef>()

const actions = {
  init,
  ...game,
  ...lobby,
  ...ui,
  ...user,
}

export type RootAction = ActionType<typeof actions>
export default actions
