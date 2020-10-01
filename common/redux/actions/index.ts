import {ActionType, createAction} from 'typesafe-actions'
import {NavigationContainerRef} from '@react-navigation/native'

import * as lobby from './lobby'
import * as game from './game'

export const init = createAction('INIT')<NavigationContainerRef>()

const actions = {
  init,
  ...game,
  ...lobby,
}

export type RootAction = ActionType<typeof actions>
export default actions
