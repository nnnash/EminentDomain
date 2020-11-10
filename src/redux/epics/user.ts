import {isActionOf} from 'typesafe-actions'
import {catchError, filter, switchMap, map} from 'rxjs/operators'
import {from, of} from 'rxjs'
import AsyncStorage from '@react-native-community/async-storage'
import {v4} from 'uuid'

import {init} from '@actions/index'
import {CustomEpic} from './types'
import {setUser} from '@actions/user'

const PLAYER_ID_KEY = 'playerId'

const setNewId = () => {
  const newId = v4()
  AsyncStorage.setItem(PLAYER_ID_KEY, newId)
  return newId
}

export const setUserEpic: CustomEpic = action$ =>
  action$.pipe(
    filter(isActionOf(init)),
    switchMap(() =>
      from(AsyncStorage.getItem(PLAYER_ID_KEY)).pipe(
        map(id => {
          if (id) return setUser(id)
          return setUser(setNewId())
        }),
        catchError(() => of(setUser(setNewId()))),
      ),
    ),
  )
