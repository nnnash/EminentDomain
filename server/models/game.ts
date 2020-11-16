import {v4} from 'uuid'
import {nativeMath, shuffle} from 'random-js'

import {Action, BoardCard, Card, Game, GameStatus, Phase, Planet, Player} from '@types'
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
    lastAction: `You created the game ${gameName}`,
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
  game.lastAction = `${player.name} has joined`
}

export const startGame = (game: Game) => {
  game.status = GameStatus.inPlay
  const playersIds = Object.keys(game.players)
  game.playersOrder = shuffle(nativeMath, playersIds)
  game.activePlayer = game.playersOrder[0]
  game.lastAction = 'Game started'
}

export const skipAction = (game: Game) => {
  game.playersPhase = Phase.role
  game.rolePlayer = game.activePlayer
  const activePlayer = game.players[game.activePlayer]
  game.lastAction = `${activePlayer.name} skipped action phase`
}

export const playAction = (game: Game, payload: ActionPayload) => {
  const activePlayer = game.players[game.activePlayer]
  let lastAction = `${activePlayer.name} played ${payload.type} action`
  switch (payload.type) {
    case Action.politics:
      playPoliticsAction(activePlayer, payload.card, payload.cardIndex)
      game.cards[payload.card] -= 1
      lastAction += ` (took ${payload.card} card)`
      break
    case Action.envoy:
      playEnvoyAction(activePlayer, payload.cardIndex)
      break
    case Action.colonize:
      lastAction += ` (${playColonize({player: activePlayer, ...payload})})`
      break
    case Action.warfare:
      lastAction += ` (${playWarfare({player: activePlayer, ...payload})})`
      break
    case Action.produce:
    case Action.sell:
      lastAction += ` (${playIndustry({
        player: activePlayer,
        cardIndex: payload.cardIndex,
        isProduction: payload.type === Action.produce,
      })})`
      break
  }
  game.playersPhase = Phase.role
  game.rolePlayer = game.activePlayer
  game.lastAction = lastAction
  console.log(
    activePlayer.name,
    'action',
    Object.values(activePlayer.cards).reduce<number>((acc, item) => acc + item.length, 0) +
      activePlayer.planets.explored.reduce<number>((acc, item) => acc + item.colonies, 0),
  )
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
  if (nextPlayerIndex === 0 && checkForEnd(game)) {
    const winners = getWinner(game)
    game.status = GameStatus.ended
    game.lastAction = `The winner${winners.length > 1 ? 's are' : ' is'} ${winners.map(p => p.name).join(', ')}`
  } else {
    game.activePlayer = game.playersOrder[nextPlayerIndex]
    const player = game.players[game.activePlayer]
    game.playersPhase = player.cards.hand.length ? Phase.action : Phase.role
    game.lastAction = `${activePlayer.name} has completed his turn`
  }
  console.log(
    activePlayer.name,
    'cleanup',
    Object.values(activePlayer.cards).reduce<number>((acc, item) => acc + item.length, 0) +
      activePlayer.planets.explored.reduce<number>((acc, item) => acc + item.colonies, 0),
  )
  console.log('------------------------------------------------------------------')
}

const getNextRolePlayer = (game: Game, type: Action, isLeader: boolean) => {
  const currentBoardDeckSize = game.cards[getCardByAction(type) as BoardCard]
  if (isLeader && currentBoardDeckSize > 0) game.cards[getCardByAction(type) as BoardCard]--
  if (!game.playersOrder) return
  const activePlayerIndex = game.playersOrder.findIndex(item => item === game.activePlayer)
  const roleOrder = game.playersOrder.slice(activePlayerIndex).concat(game.playersOrder.slice(0, activePlayerIndex))
  const roleExecutor = roleOrder.findIndex(item => item === game.rolePlayer)
  return roleOrder.slice(roleExecutor + 1).find(playerId => {
    const player = game.players[playerId]
    const canPlay = canRepeatRole(player, type, game)
    if (!canPlay) takeCards(player.cards, 1)
    return canPlay
  })
}
export const playRole = (game: Game, payload: RolePayload) => {
  if (!game.rolePlayer) return
  const rolePlayer = game.players[game.rolePlayer]
  if (!rolePlayer) return
  const isLeader = game.activePlayer === game.rolePlayer
  let lastAction: string
  if (!isLeader && payload.amount === 0) {
    takeCards(rolePlayer.cards, 1)
    lastAction = `${rolePlayer.name} didn't repeat the ${payload.type} role`
  } else {
    lastAction = `${rolePlayer.name} ${isLeader ? 'played' : 'repeated'} ${payload.type} role`
    switch (payload.type) {
      case Action.warfare:
        lastAction += ` (${playWarfare({
          player: rolePlayer,
          fighterAmount: payload.amount,
          planetIndex: payload.planetIndex,
          isLeader,
        })})`
        break
      case Action.colonize:
        lastAction += ` (${playColonize({
          player: rolePlayer,
          coloniesAmount: payload.amount,
          planetIndex: payload.planetIndex,
          isLeader,
        })})`
        break
      case Action.produce:
      case Action.sell:
        lastAction += ` (${playIndustry({
          amount: payload.amount,
          player: rolePlayer,
          isProduction: payload.type === Action.produce,
          isLeader,
        })})`
        break
      case Action.envoy:
        playEnvoyRole(
          rolePlayer,
          pickPlanet(game, payload.amount - Number(!isLeader), payload.planetIndex),
          payload.amount,
          isLeader,
        )
        lastAction += ` (picked one from ${payload.amount - Number(!isLeader)} planet(s)`
    }
  }
  game.lastAction = lastAction
  const nextPlayer = getNextRolePlayer(game, payload.type, isLeader)
  if (nextPlayer) {
    game.rolePlayer = nextPlayer
    game.roleType = payload.type
  } else {
    const activePlayer = game.players[game.activePlayer]
    if (!activePlayer.cards.hand.length) {
      playCleanUp(game, [])
    } else {
      game.playersPhase = Phase.cleanup
      delete game.rolePlayer
      delete game.roleType
    }
  }
  console.log(
    rolePlayer.name,
    'role',
    Object.values(rolePlayer.cards).reduce<number>((acc, item) => acc + item.length, 0) +
      rolePlayer.planets.explored.reduce<number>((acc, item) => acc + item.colonies, 0),
  )
}
