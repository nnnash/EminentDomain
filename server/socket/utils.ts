import {getType} from 'typesafe-actions'
import {RootAction} from '@actions/index'

export const createReducer = <T>(ac: (arg: T) => RootAction, func: (payload: T) => void) => ({
  [getType(ac)]: func,
})
