import {isActionOf} from 'typesafe-actions'
import {filter, map} from 'rxjs/operators'

import {CustomEpic} from './types'
import {sendGame} from '@actions/game'
import {clearUi} from '@actions/ui'

export const gameReceivedEpic: CustomEpic = action$ =>
  action$.pipe(
    filter(isActionOf(sendGame)),
    map(() => clearUi()),
  )
