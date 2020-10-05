export enum Card {
  attack = 'attack',
  colonization = 'colonization',
  search = 'search',
  industry = 'industry',
  politics = 'politics',
}

export enum Action {
  attack = 'attack',
  colonization = 'colonization',
  search = 'search',
  produce = 'produce',
  sell = 'sell',
}

export enum PlayerStatus {
  in = 'in',
  away = 'away',
}

export enum PlanetType {
  prestige = 'prestige',
  metal = 'metal',
  developed = 'developed',
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
    attack: number
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
}

export enum GameStage {
  new = 'new',
  inPlay = 'inPlay',
  ended = 'ended',
}

export interface GameBase {
  id: string
  name: string
  stage: GameStage
}
export interface Game extends GameBase {
  players: {
    [key: string]: Player
  }
  startPlanets: Array<Planet>
  cards: Record<Exclude<Card, Card.politics>, number>
  activePlayer: Player['id']
}
export interface GameShort extends GameBase {
  players: Array<Player['id']>
}

export interface TState {
  games: {[key: string]: Game}
}
