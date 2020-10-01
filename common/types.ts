export enum Card {
  attack = 'attack',
  colonization = 'colonization',
  search = 'search',
  industry = 'industry',
  politics = 'politics',
}

export interface Player {
  id: string
  name: string
  cards: {
    hand: Array<Card>
    pile: Array<Card>
    deck: Array<Card>
  }
  capacity: number
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
}
export interface GameShort extends GameBase {
  players: Array<Player['id']>
}

export interface TState {
  games: {[key: string]: Game}
}
