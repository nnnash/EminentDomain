import {ActionType} from 'typesafe-actions'

import * as lobby from './lobby'

const actions = {
  ...lobby,
}

export type RootAction = ActionType<typeof actions>
export default actions
