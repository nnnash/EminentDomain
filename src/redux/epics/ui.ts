import {isActionOf} from 'typesafe-actions'
import {filter, map} from 'rxjs/operators'

import {Action} from '@types'
import {confirmCleanup, setIndustryActive, setOptionsModalOpen} from '@actions/ui'
import {reqPlayAction, reqPlayCleanup, reqPlayRole} from '@actions/game'
import {canProduceAmount, canSellAmount} from '@common/actionsAlowed'
import {getRange} from '@clientUtils'
import {CustomEpic} from './types'

export const setIndustryActiveEpic: CustomEpic = (action$, store) =>
  action$.pipe(
    filter(isActionOf(setIndustryActive)),
    map(({payload: {isAction, cardIndex, type}}) => {
      const {game, user} = store.value
      const player = game.players[user.id]
      const availableProduce = canProduceAmount(player)
      const availableSell = canSellAmount(player)
      const canProduce = type === Action.produce || !!availableProduce
      const canTrade = type === Action.sell || !!availableSell
      if (!type && canProduce && canTrade) return setOptionsModalOpen({open: true, industryChoose: true})
      const typeDefined = type || (canTrade ? Action.sell : Action.produce)
      if (isAction)
        return reqPlayAction({
          gameId: game.id,
          cardIndex: cardIndex || 0,
          type: typeDefined,
        })
      const availableSpots = typeDefined === Action.produce ? availableProduce : availableSell
      if (availableSpots === 1) return reqPlayRole({gameId: game.id, amount: 1, type: typeDefined})
      const isLeader = game.rolePlayer === game.activePlayer
      const {typeCards, planetSymbols, ...range} = getRange(game, user.id, typeDefined, isLeader)
      if (!typeCards) {
        return reqPlayRole({
          amount: Math.min(planetSymbols + Number(isLeader), availableSpots),
          gameId: game.id,
          type: typeDefined,
        })
      }
      if (range.to <= range.from)
        return reqPlayRole({
          amount: range.to,
          gameId: game.id,
          type: typeDefined,
        })
      return setOptionsModalOpen({open: true, range, action: typeDefined})
    }),
  )

export const confirmCleanupEpic: CustomEpic = (action$, store) =>
  action$.pipe(
    filter(isActionOf(confirmCleanup)),
    map(() => reqPlayCleanup({cards: store.value.ui.cardsToClean, gameId: store.value.game.id})),
  )
