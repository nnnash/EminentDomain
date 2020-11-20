import {isActionOf} from 'typesafe-actions'
import {filter, map} from 'rxjs/operators'

import {Action, Card, Phase} from '@types'
import {CustomEpic} from './types'
import {sendGame, playCardAction, reqPlayAction, playCardRole, reqPlayRole, RolePayload} from '@actions/game'
import {
  clearUi,
  setColonizeActive,
  setEnvoyActive,
  setIndustryActive,
  setOptionsModalOpen,
  setPoliticsActive,
  setRoleRepeat,
  setWarfareActive,
} from '@actions/ui'
import {getRange} from '../../utils'
import {canPlayAttack} from '@common/actionsAlowed'
import {cardProps} from '@common/cardProps'

export const gameReceivedEpic: CustomEpic = (action$, store) =>
  action$.pipe(
    filter(isActionOf(sendGame)),
    map(({payload: game}) => {
      const user = store.value.user
      if (
        game.roleType &&
        game.rolePlayer &&
        game.playersPhase === Phase.role &&
        game.rolePlayer === user.id &&
        game.activePlayer !== game.rolePlayer
      ) {
        return setRoleRepeat(game.roleType as RolePayload['type'])
        // if (game.playersPhase === Phase.role && game.rolePlayer === user.id) {
        //   const player = game.players[user.id]
        //   if (
        //     game.roleType === Action.colonize &&
        //     player.planets.explored.filter(pl => pl.colonies < getPlanetColonizeCost(pl, player)).length > 1
        //   )
        //     return setColonizeActive({isLeader: false, isAction: false})
        //   else
        //     return setOptionsModalOpen({
        //       open: true,
        //       action: game.roleType,
        //       range: getRange(game, user.id, game.roleType, false),
        //       planetIndex:
        //         game.roleType === Action.colonize
        //           ? player.planets.explored.findIndex(pl => pl.colonies < getPlanetColonizeCost(pl, player))
        //           : undefined,
        //     })
        // }
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
      const {typeCards, planetSymbols, ...range} = getRange(
        game,
        player.id,
        cardProps[cardType].actions[0],
        true,
        player.planets.explored.length === 1 ? player.planets.explored[0] : undefined,
      )
      switch (cardType) {
        case Card.colonize:
          if (player.planets.explored.length === 1) {
            const planet = player.planets.explored[0]
            if (planet.colonies >= planet.cost.colonize)
              return reqPlayRole({type: Action.colonize, gameId: game.id, planetIndex: 0, amount: 1})
            return range.to <= range.from
              ? reqPlayRole({type: Action.colonize, gameId: game.id, amount: range.to, planetIndex: 0})
              : setOptionsModalOpen({open: true, range, action: Action.colonize, planetIndex: 0})
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
