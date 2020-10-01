import {createReducer} from 'typesafe-actions'

import {RootAction} from '@actions/index'
import {setUser} from '@actions/user'

export interface UserState {
  id: string
}
export const initialUserState: UserState = {
  id: '',
}

export const user = createReducer<UserState, RootAction>(initialUserState).handleAction(
  setUser,
  (state, {payload: id}): UserState => ({...state, id}),
)
