import {isActionOf} from 'typesafe-actions'
import {filter, map} from 'rxjs/operators'

import {CustomEpic} from './types'
import {setIndustryActive, setOptionsModalOpen} from '@actions/ui'
import {reqPlayAction} from '@actions/game'
import {Action} from '@types'

export const setIndustryActiveEpic: CustomEpic = (action$, store) =>
  action$.pipe(
    filter(isActionOf(setIndustryActive)),
    filter(({payload: cardIndex}) => cardIndex !== undefined),
    map(() => {
      const {game, user, ui} = store.value
      const player = game.players[user.id]
      const canProduce = player.planets.occupied.find(({production}) => !!production.find(p => !p.produced))
      const canTrade = player.planets.occupied.find(({production}) => !!production.find(p => p.produced))
      if (canProduce && canTrade) return setOptionsModalOpen({open: true, industryChoose: true})
      return reqPlayAction({
        gameId: game.id,
        cardIndex: ui.activeIndustry || 0,
        type: canTrade ? Action.sell : Action.produce,
      })
    }),
  )
