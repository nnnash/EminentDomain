export enum Card {
  warfare = 'warfare',
  colonize = 'colonize',
  envoy = 'envoy',
  industry = 'industry',
  politics = 'politics',
}

export type BoardCard = Exclude<Card, 'politics'>

export enum Action {
  warfare = 'warfare',
  colonize = 'colonize',
  envoy = 'envoy',
  produce = 'produce',
  sell = 'sell',
  politics = 'politics',
}

export enum PlayerStatus {
  in = 'in',
  away = 'away',
}

export enum PlanetType {
  prestige = 'prestige',
  metal = 'metal',
  advanced = 'advanced',
  fertile = 'fertile',
  utopia = 'utopia',
}

export enum Resource {
  water = 'water',
  wheat = 'wheat',
  coal = 'coal',
  iron = 'iron',
}

export interface Planet {
  cost: {
    warfare: number
    colonize: number
  }
  type: PlanetType
  points: number
  action?: Action
  resources: Array<Resource>
  cardCapacity: boolean
}

export interface ExploredPlanet extends Planet {
  colonies: number
}

export interface OccupiedPlanet extends Planet {
  production: Array<{type: Resource; produced: boolean}>
}

export interface Player {
  id: string
  name: string
  status: PlayerStatus
  cards: {
    hand: Array<Card>
    pile: Array<Card>
    deck: Array<Card>
  }
  capacity: number
  points: number
  planets: {
    occupied: Array<OccupiedPlanet>
    explored: Array<ExploredPlanet>
  }
  spaceships: number
  coloniesDiscount: number
}

export enum GameStatus {
  new = 'new',
  inPlay = 'inPlay',
  ended = 'ended',
}

export enum Phase {
  action = 'action',
  role = 'role',
  cleanup = 'cleanup',
}

export interface GameBase {
  id: string
  name: string
  status: GameStatus
}
export interface Game extends GameBase {
  players: {
    [key: string]: Player
  }
  startPlanets: Array<Planet>
  planetsDeck: Array<Planet>
  cards: Record<Exclude<Card, Card.politics>, number>
  activePlayer: Player['id']
  playersPhase: Phase
  rolePlayer?: Player['id']
  roleType?: Action
  playersOrder?: Array<Player['id']>
  winners?: Array<Player>
}
export interface GameShort extends GameBase {
  players: Array<Player['id']>
}

export interface TState {
  games: {[key: string]: Game}
}
