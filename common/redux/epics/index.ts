import {combineEpics} from 'redux-observable'
import {isActionOf} from 'typesafe-actions'
import {filter, tap, ignoreElements} from 'rxjs/operators'

import {init} from '@actions/index'
import {CustomEpic} from './types'
import * as lobby from './lobby'

const initEpic: CustomEpic = (action$, store, {setNav}) =>
  action$.pipe(
    filter(isActionOf(init)),
    tap(({payload: nav}) => setNav(nav)),
    ignoreElements(),
  )

const epics = [{initEpic}, lobby].reduce((acc, epic: {}) => acc.concat(Object.values(epic)), [])

export default combineEpics(...epics)
