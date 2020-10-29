import {nativeMath, shuffle} from 'random-js'
import {times} from 'lodash'

import {ExploredPlanet, OccupiedPlanet, Planet, PlanetType, Resource} from '@types'

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

export const getAddedPlanet = (planet: Planet): ExploredPlanet => ({
  ...planet,
  colonies: 0,
})

export const setPlanetOccupied = ({colonies, ...planet}: ExploredPlanet): OccupiedPlanet => ({
  ...planet,
  production: planet.resources.map(type => ({type, produced: false})),
})
