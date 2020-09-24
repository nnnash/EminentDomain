import {Epic} from 'redux-observable'
import {ajax} from 'rxjs/ajax'

import {RootAction} from '../actions/index'
import {GlobalState} from '../reducers'

export type CustomEpic = Epic<RootAction, RootAction, GlobalState, {api: typeof ajax}>
