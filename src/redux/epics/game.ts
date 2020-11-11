import {isActionOf} from 'typesafe-actions'
import {filter, map} from 'rxjs/operators'

import {Action, Card, Phase} from '@types'
import {CustomEpic} from './types'
import {sendGame, playCardAction, reqPlayAction, playCardRole, reqPlayRole} from '@actions/game'
import {
  clearUi,
  setColonizeActive,
  setEnvoyActive,
  setIndustryActive,
  setOptionsModalOpen,
  setPoliticsActive,
  setWarfareActive,
} from '@actions/ui'
import {getRange} from '../../utils'
import {getCardByAction, getPlanetColonizeCost} from '../../../common/utils'
import {canPlayAttack} from '../../../common/actionsAlowed'

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

export const playCardActionEpic: CustomEpic = (action$, store) =>
  action$.pipe(
    filter(isActionOf(playCardAction)),
    map(({payload: {cardType, cardIndex}}) => {
      const {game} = store.value
      const player = game.players[game.activePlayer]
      return {cardIndex, cardType, game, player}
    }),
    filter(({player}) => !!player),
    map(({cardType, cardIndex, game, player}) => {
      switch (cardType) {
        case Card.politics:
          return setPoliticsActive(cardIndex)
        case Card.envoy:
          return reqPlayAction({type: Action.envoy, gameId: game.id, cardIndex})
        case Card.colonize:
          return player.planets.explored.length === 1
            ? reqPlayAction({type: Action.colonize, cardIndex, gameId: game.id, planetIndex: 0})
            : setColonizeActive({cardIndex, isAction: true})
        case Card.warfare:
          return canPlayAttack(player)
            ? setWarfareActive({cardIndex, isAction: true})
            : reqPlayAction({type: Action.warfare, gameId: game.id, cardIndex})
        case Card.industry:
          return setIndustryActive({isAction: true, cardIndex})
      }
    }),
  )

export const playCardRoleEpic: CustomEpic = (action$, store) =>
  action$.pipe(
    filter(isActionOf(playCardRole)),
    map(({payload: cardType}) => {
      const {game} = store.value
      const player = game.players[game.activePlayer]
      return {cardType, game, player}
    }),
    filter(({player}) => !!player),
    map(({player, game, cardType}) => {
      if (cardType === Card.industry) {
        return setIndustryActive({isAction: false, isLeader: true})
      }
      const {typeCards, planetSymbols, ...range} = getRange(game, player.id, cardType, true)
      switch (cardType) {
        case Card.colonize:
          if (player.planets.explored.length === 1) {
            const planet = player.planets.explored[0]
            return planet.colonies >= planet.cost.colonize
              ? reqPlayRole({type: Action.colonize, gameId: game.id, planetIndex: 0, amount: 1})
              : setOptionsModalOpen({
                  open: true,
                  range: {
                    from: range.from,
                    to: Math.min(range.to, getPlanetColonizeCost(planet, player) - planet.colonies),
                  },
                  action: Action.colonize,
                  planetIndex: 0,
                })
          } else return setColonizeActive({isAction: false, isLeader: true})
        case Card.warfare:
          if (canPlayAttack(player)) return setWarfareActive({isAction: false, isLeader: true})
          else {
            return typeCards
              ? setOptionsModalOpen({open: true, range, action: Action.warfare})
              : reqPlayRole({type: Action.warfare, gameId: game.id, amount: 1 + planetSymbols})
          }
        case Card.envoy:
          if (typeCards) return setOptionsModalOpen({open: true, action: Action.envoy, range})
          else
            return planetSymbols
              ? setEnvoyActive({amount: planetSymbols + 1})
              : reqPlayRole({type: Action.envoy, amount: 1, gameId: game.id, planetIndex: 0})
      }
    }),
  )
