import {isActionOf} from 'typesafe-actions'
import {filter, map} from 'rxjs/operators'

import {Action, Phase} from '@types'
import {CustomEpic} from './types'
import {sendGame} from '@actions/game'
import {clearUi, setColonizeActive, setOptionsModalOpen} from '@actions/ui'
import {getRange} from '../../utils'
import {getCardByAction, getPlanetColonizeCost} from '../../../common/utils'

export const gameReceivedEpic: CustomEpic = (action$, store) =>
  action$.pipe(
    filter(isActionOf(sendGame)),
    map(({payload: game}) => {
      const user = store.value.user
      if (game.roleType && game.rolePlayer) {
        if (game.playersPhase === Phase.role && game.rolePlayer === user.id) {
          const player = game.players[user.id]
          if (
            game.roleType === Action.colonize &&
            player.planets.explored.filter(pl => pl.colonies < getPlanetColonizeCost(pl, player)).length > 1
          )
            return setColonizeActive({isLeader: false, isAction: false})
          else
            return setOptionsModalOpen({
              open: true,
              action: game.roleType,
              range: getRange(game, user.id, getCardByAction(game.roleType), false),
              planetIndex:
                game.roleType === Action.colonize
                  ? player.planets.explored.findIndex(pl => pl.colonies < getPlanetColonizeCost(pl, player))
                  : undefined,
            })
        }
      }
      return clearUi()
    }),
  )
