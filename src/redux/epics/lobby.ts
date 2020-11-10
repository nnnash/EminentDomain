import {isActionOf} from 'typesafe-actions'
import {catchError, filter, switchMap, map, tap, ignoreElements} from 'rxjs/operators'
import {from, of} from 'rxjs'

import {CustomEpic} from './types'
import {getGames, sendShortGameToJoin} from '@actions/lobby'

export const getGamesEpic: CustomEpic = (action$, store, {api}) =>
  action$.pipe(
    filter(isActionOf(getGames.request)),
    switchMap(() =>
      from(api.get('http://localhost:8000/games')).pipe(
        map(res => getGames.success(res.response)),
        catchError(err => {
          console.log(err)
          return of(getGames.failure())
        }),
      ),
    ),
  )

export const createOrJoinGameSuccessEpic: CustomEpic = (action$, store, {nav}) =>
  action$.pipe(
    filter(isActionOf(sendShortGameToJoin)),
    tap(({payload: {name, id}}) => {
      nav().navigate('Game', {name, id})
    }),
    ignoreElements(),
  )
