import {Action, Game, Player} from '@types'
import {getEmpower} from './utils'

enum PlayType {
  action = 'action',
  role = 'role',
  repeat = 'repeat',
}

const getIndustryAmount = ({occupied}: Player['planets'], isSell: boolean) =>
  occupied.reduce((acc, planet) => {
    planet.production.forEach(pr => pr.produced === isSell && acc++)
    return acc
  }, 0)
export const canProduceAmount = ({planets}: Player) => getIndustryAmount(planets, false)
export const canSellAmount = ({planets}: Player) => getIndustryAmount(planets, true)

export const canAddColonies = ({planets}: Player) =>
  planets.explored.some(planet => {
    if (planet.colonies < planet.cost.colonize) return true
  })
export const canPlayColonize = ({planets}: Player) => !!planets.explored.length

export const canPlayAttack = ({planets, spaceships}: Player) =>
  spaceships && !!planets.explored.find(p => p.cost.warfare <= spaceships)

export const canEnvoy = (game: Game) => !!game.planetsDeck.length

export const canPlayRole = (player: Player, game: Game, type: Action, playType: PlayType) => {
  switch (type) {
    case Action.envoy:
      return canEnvoy(game)
    case Action.produce:
      return !!canProduceAmount(player)
    case Action.sell:
      return !!canSellAmount(player)
    case Action.warfare:
      return true
    case Action.colonize:
      return playType !== PlayType.repeat ? canPlayColonize(player) : canAddColonies(player)
  }
}

export const canRepeatRole = (player: Player, type: Action, game: Game) => {
  const empowerAmount = getEmpower(player, type)
  return (
    !!empowerAmount && (type !== Action.envoy || empowerAmount > 1) && canPlayRole(player, game, type, PlayType.repeat)
  )
}
