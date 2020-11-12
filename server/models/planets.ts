import {nativeMath, shuffle} from 'random-js'
import {times, omit} from 'lodash'

import {ExploredPlanet, Game, OccupiedPlanet, Planet, PlanetType, Resource} from '@types'
import planets from '../planets'

export const createPlanet = ({
  action,
  cardCapacity = false,
  cost,
  points = 2,
  resources = [],
  type = PlanetType.fertile,
}: Partial<Planet>): Planet => ({
  action,
  cardCapacity,
  cost: cost || {
    warfare: 2,
    colonize: 2,
  },
  points,
  resources,
  type,
})

export const getStartPlanets = (): Array<Planet> =>
  shuffle(nativeMath, [
    ...times(2, () => createPlanet({type: PlanetType.advanced, resources: [Resource.coal]})),
    ...times(2, () => createPlanet({type: PlanetType.metal, resources: [Resource.iron]})),
    createPlanet({resources: [Resource.water]}),
    createPlanet({resources: [Resource.wheat]}),
  ])

export const getPlanetsDeck = (): Array<Planet> => shuffle(nativeMath, [...planets])

export const getAddedPlanet = (planet: Planet): ExploredPlanet => ({
  ...planet,
  colonies: 0,
})

export const setPlanetOccupied = (planet: ExploredPlanet): OccupiedPlanet => ({
  ...omit(planet, 'colonies'),
  production: planet.resources.map(type => ({type, produced: false})),
})

export const pickPlanet = (game: Game, amount: number, planetIndex: number) => {
  const planetsToSelect = game.planetsDeck.slice(0, amount)
  game.planetsDeck = game.planetsDeck.slice(amount)
  return planetsToSelect[planetIndex]
}
