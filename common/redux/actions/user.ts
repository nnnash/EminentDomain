import {createAction} from 'typesafe-actions'

export const setUser = createAction('SET_USER')<string>()
