import {isActionOf} from 'typesafe-actions'
import {filter, map} from 'rxjs/operators'

import {CustomEpic} from './types'
import {confirmCleanup, setIndustryActive, setOptionsModalOpen} from '@actions/ui'
import {reqPlayAction, reqPlayCleanup, reqPlayRole} from '@actions/game'
import {Action, Card} from '@types'

export const setIndustryActiveEpic: CustomEpic = (action$, store) =>
  action$.pipe(
    filter(isActionOf(setIndustryActive)),
    map(({payload: {isAction, cardIndex}}) => {
      const {game, user} = store.value
      const player = game.players[user.id]
      const canProduce = player.planets.occupied.find(({production}) => !!production.find(p => !p.produced))
      const canTrade = player.planets.occupied.find(({production}) => !!production.find(p => p.produced))
      if (canProduce && canTrade) return setOptionsModalOpen({open: true, industryChoose: true})
      if (isAction)
        return reqPlayAction({
          gameId: game.id,
          cardIndex: cardIndex || 0,
          type: canTrade ? Action.sell : Action.produce,
        })
      const availableSpots = player.planets.occupied.reduce<number>(
        (acc, planet) => acc + planet.production.filter(pr => pr.produced === !canProduce).length,
        0,
      )
      if (availableSpots === 1)
        return reqPlayRole({gameId: game.id, amount: 1, type: canTrade ? Action.sell : Action.produce})
      const typeCards = player.cards.hand.filter(c => c === Card.industry).length
      const planetHelpers = player.planets.occupied.filter(
        p => p.action === (canProduce ? Action.produce : Action.sell),
      ).length
      return setOptionsModalOpen({
        open: true,
        range: {from: 1 + planetHelpers, to: 1 + planetHelpers + typeCards},
        action: canProduce ? Action.produce : Action.sell,
      })
    }),
  )

export const confirmCleanupEpic: CustomEpic = (action$, store) =>
  action$.pipe(
    filter(isActionOf(confirmCleanup)),
    map(() => reqPlayCleanup({cards: store.value.ui.cardsToClean, gameId: store.value.game.id})),
  )
