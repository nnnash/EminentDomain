import {v4} from 'uuid'
import {nativeMath, pick, shuffle} from 'random-js'

import {Action, Card, Game, GameStatus, Phase, Planet, Player} from '@types'
import {
  createPlayer,
  playCleanup,
  playColonize,
  playEnvoyAction,
  playEnvoyRole,
  playIndustry,
  playPoliticsAction,
  playWarfare,
} from './player'
import {getPlanetsDeck, getStartPlanets, pickPlanet} from './planets'
import {ActionPayload, RolePayload} from '@actions/game'
import {getCardByAction} from '../../common/utils'
import {takeCards} from './decks'
import {canRepeatRole} from '../../common/actionsAlowed'

export const createGame = (gameName: string, hostName: string, hostId: string): Game => {
  const startPlanets = getStartPlanets()
  const player = createPlayer(hostName, hostId, startPlanets.pop() as Planet)
  return {
    status: GameStatus.new,
    name: gameName,
    id: v4(),
    players: {
      [player.id]: player,
    },
    startPlanets,
    planetsDeck: getPlanetsDeck(),
    cards: {
      [Card.warfare]: 15,
      [Card.colonize]: 18,
      [Card.industry]: 15,
      [Card.envoy]: 18,
    },
    activePlayer: player.id,
    playersPhase: Phase.action,
  }
}

export const addPlayer = (game: Game, player: Player) => {
  game.players = {
    ...game.players,
    [player.id]: player,
  }
  game.cards = {
    [Card.warfare]: game.cards[Card.warfare] - 1,
    [Card.colonize]: game.cards[Card.colonize] - 2,
    [Card.industry]: game.cards[Card.industry] - 2,
    [Card.envoy]: game.cards[Card.envoy] - 2,
  }
}

export const startGame = (game: Game) => {
  game.status = GameStatus.inPlay
  const playersIds = Object.keys(game.players)
  game.activePlayer = pick(nativeMath, playersIds)
  game.playersOrder = shuffle(nativeMath, playersIds)
}

export const playAction = (game: Game, payload: ActionPayload) => {
  const activePlayer = game.players[game.activePlayer]
  switch (payload.type) {
    case Action.politics:
      playPoliticsAction(activePlayer, payload.card, payload.cardIndex)
      game.cards[payload.card] -= 1
      break
    case Action.envoy:
      playEnvoyAction(activePlayer, payload.cardIndex)
      break
    case Action.colonize:
      playColonize({player: activePlayer, ...payload})
      break
    case Action.warfare:
      playWarfare({player: activePlayer, ...payload})
      break
    case Action.produce:
    case Action.sell:
      playIndustry({player: activePlayer, cardIndex: payload.cardIndex, isProduction: payload.type === Action.produce})
      break
  }
  game.playersPhase = Phase.role
  game.rolePlayer = game.activePlayer
}

export const playRole = (game: Game, payload: RolePayload) => {
  if (!game.rolePlayer) return
  const rolePlayer = game.players[game.rolePlayer]
  if (!rolePlayer) return
  const isLeader = game.activePlayer === game.rolePlayer
  if (!isLeader && payload.amount === 0) {
    takeCards(rolePlayer.cards, 1)
  } else {
    switch (payload.type) {
      case Action.warfare:
        playWarfare({player: rolePlayer, fighterAmount: payload.amount, planetIndex: payload.planetIndex, isLeader})
        break
      case Action.colonize:
        playColonize({player: rolePlayer, coloniesAmount: payload.amount, planetIndex: payload.planetIndex, isLeader})
        break
      case Action.produce:
      case Action.sell:
        playIndustry({
          amount: payload.amount,
          player: rolePlayer,
          isProduction: payload.type === Action.produce,
          isLeader,
        })
        break
      case Action.envoy:
        console.log('payload', payload)
        playEnvoyRole(
          rolePlayer,
          pickPlanet(game, payload.amount - Number(!isLeader), payload.planetIndex),
          payload.amount,
          isLeader,
        )
    }
  }
  if (isLeader) game.cards[getCardByAction(payload.type) as Exclude<Card, Card.politics>]--
  if (!game.playersOrder) return
  const activePlayerIndex = game.playersOrder.findIndex(item => item === game.activePlayer)
  const roleOrder = game.playersOrder.slice(activePlayerIndex).concat(game.playersOrder.slice(0, activePlayerIndex))
  const roleExecutor = roleOrder.findIndex(item => item === game.rolePlayer)
  const nextPlayer = roleOrder.slice(roleExecutor + 1).find(playerId => {
    const player = game.players[playerId]
    const canPlay = canRepeatRole(player, payload.type, game)
    if (!canPlay) takeCards(player.cards, 1)
    return canPlay
  })
  if (nextPlayer) {
    game.rolePlayer = nextPlayer
    game.roleType = payload.type
  } else {
    game.playersPhase = Phase.cleanup
    delete game.rolePlayer
    delete game.roleType
  }
}

const checkForEnd = ({cards, playersOrder}: Game) =>
  Object.values(cards).filter(amount => !amount).length === ((playersOrder || []).length === 4 ? 2 : 1)
const getResourcesAndFighters = (player: Player) =>
  player.spaceships +
  player.planets.occupied.reduce<number>((acc, item) => acc + item.production.filter(pr => pr.produced).length, 0)
const getWinner = ({players}: Game) =>
  Object.values(players).reduce<Array<Player>>((acc, item) => {
    if (!acc.length) return [item]
    const currentWinner = acc[0]
    if (currentWinner.points < item.points) return [item]
    if (currentWinner.points === item.points) {
      const currentTokens = getResourcesAndFighters(currentWinner)
      const itemTokens = getResourcesAndFighters(item)
      if (currentTokens < itemTokens) return [item]
      if (currentTokens === itemTokens) return [...acc, item]
    }
    return acc
  }, [])

export const playCleanUp = (game: Game, payload: Array<number>) => {
  const activePlayer = game.players[game.activePlayer]
  playCleanup(activePlayer, payload)
  if (!game.playersOrder) return
  const nextPlayerIndex = (game.playersOrder.indexOf(game.activePlayer) + 1) % game.playersOrder.length
  if (!nextPlayerIndex && checkForEnd(game)) {
    game.winners = getWinner(game)
    game.status = GameStatus.ended
  } else {
    game.activePlayer = game.playersOrder[nextPlayerIndex]
    const player = game.players[game.activePlayer]
    game.playersPhase = player.cards.hand.length ? Phase.action : Phase.role
  }
}
