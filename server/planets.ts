import {nativeMath, pick} from 'random-js'
import {Action, Planet, PlanetType, Resource} from '@types'

const createPlanet = (
  type: PlanetType,
  points: number,
  warfare: number,
  colonize: number,
  params?: {a?: Action; r1?: Resource; r2?: Resource; c?: boolean},
): Planet => ({
  action: params && params.a,
  points,
  type,
  resources: params ? ([params.r1, params.r2].filter(Boolean) as Array<Resource>) : [],
  cardCapacity: !!(params && params.c),
  cost: {warfare, colonize},
})

const getRandRes = () => pick(nativeMath, Object.values(Resource))

export default [
  createPlanet(PlanetType.metal, 4, 6, 3, {a: Action.envoy}),
  createPlanet(PlanetType.advanced, 2, 5, 4, {r1: Resource.coal, c: true}),
  createPlanet(PlanetType.prestige, 6, 5, 6),
  createPlanet(PlanetType.prestige, 6, 7, 4),
  createPlanet(PlanetType.prestige, 6, 6, 5),
  createPlanet(PlanetType.metal, 2, 4, 5, {r1: Resource.iron, c: true}),
  createPlanet(PlanetType.utopia, 2, 6, 5, {a: Action.colonize, r1: getRandRes()}),
  createPlanet(PlanetType.metal, 4, 6, 3, {a: Action.warfare}),
  createPlanet(PlanetType.advanced, 4, 6, 3, {a: Action.sell}),
  createPlanet(PlanetType.utopia, 2, 6, 5, {a: Action.sell, r1: getRandRes()}),
  createPlanet(PlanetType.fertile, 3, 5, 4, {a: Action.colonize, r1: Resource.water}),
  createPlanet(PlanetType.metal, 3, 5, 4, {a: Action.warfare, r1: Resource.iron}),
  createPlanet(PlanetType.fertile, 3, 4, 5, {a: Action.colonize, r1: Resource.wheat}),
  createPlanet(PlanetType.fertile, 2, 5, 4, {r1: Resource.water, c: true}),
  createPlanet(PlanetType.fertile, 3, 5, 4, {a: Action.produce, r1: Resource.water}),
  createPlanet(PlanetType.advanced, 4, 6, 3, {r1: Resource.coal}),
  createPlanet(PlanetType.metal, 3, 4, 5, {a: Action.warfare, r1: Resource.iron}),
  createPlanet(PlanetType.utopia, 2, 6, 5, {a: Action.produce, r1: getRandRes()}),
  createPlanet(PlanetType.advanced, 3, 5, 4, {a: Action.sell, r1: Resource.coal}),
  createPlanet(PlanetType.fertile, 3, 4, 5, {a: Action.produce, r1: Resource.wheat}),
  createPlanet(PlanetType.metal, 5, 6, 3),
  createPlanet(PlanetType.metal, 3, 5, 4, {c: true}),
  createPlanet(PlanetType.utopia, 2, 6, 5, {a: Action.envoy, r1: getRandRes()}),
  createPlanet(PlanetType.advanced, 2, 4, 5, {r1: Resource.coal, c: true}),
  createPlanet(PlanetType.fertile, 2, 6, 3, {a: Action.colonize, r1: Resource.wheat, r2: Resource.water}),
  createPlanet(PlanetType.utopia, 2, 6, 5, {a: Action.warfare, r1: getRandRes()}),
  createPlanet(PlanetType.fertile, 2, 4, 5, {r1: Resource.wheat, c: true}),
  createPlanet(PlanetType.advanced, 3, 4, 5, {a: Action.sell, r1: Resource.coal}),
  createPlanet(PlanetType.fertile, 3, 6, 3, {r1: Resource.wheat, r2: Resource.water}),
  createPlanet(PlanetType.metal, 3, 4, 5, {a: Action.envoy, r1: Resource.iron}),
  createPlanet(PlanetType.fertile, 2, 6, 3, {a: Action.produce, r1: Resource.wheat, r2: Resource.water}),
  createPlanet(PlanetType.metal, 3, 5, 4, {a: Action.envoy, r1: Resource.iron}),
]
