import {shallowEqual, useSelector} from 'react-redux'

import {GlobalState} from '@reducers/index'
import {UserState} from '@reducers/user'
import {GameState} from '@reducers/game'
import {Action, ExploredPlanet, Game, GameStatus} from '@types'
import {getCardByAction, getPlanetColonizeCost, getPlanetEmpower} from '../common/utils'
import {canProduceAmount, canSellAmount} from '../common/actionsAlowed'

export const useUser = () => {
  return useSelector<GlobalState, UserState>(state => state.user, shallowEqual)
}

export const usePlayer = () => {
  const {game, user} = useSelector<GlobalState, GlobalState>(s => s, shallowEqual)
  return game.players[user.id]
}

export const useYourTurn = () => {
  const user = useUser()
  const {activePlayer, status} = useSelector<GlobalState, GameState>(state => state.game, shallowEqual)
  return status === GameStatus.inPlay && user.id === activePlayer
}

export const getRange = (
  {players}: Pick<Game, 'players'>,
  userId: UserState['id'],
  type: Action,
  isLeader: boolean,
  planet?: ExploredPlanet,
) => {
  const player = players[userId]
  const typeCards = player.cards.hand.filter(c => c === getCardByAction(type)).length
  const planetSymbols = type === Action.colonize ? 0 : getPlanetEmpower(player, type)
  let maxAvailable = planetSymbols + Number(isLeader) + typeCards
  switch (type) {
    case Action.produce:
      maxAvailable = canProduceAmount(player)
      break
    case Action.sell:
      maxAvailable = canSellAmount(player)
      break
    case Action.colonize:
      if (planet) maxAvailable = getPlanetColonizeCost(planet, player) - planet.colonies
      break
  }
  return {
    from: planetSymbols + Number(isLeader),
    to: Math.min(planetSymbols + Number(isLeader) + typeCards, maxAvailable),
    typeCards,
    planetSymbols,
  }
}
