import {TState, GameStage} from '@types'

export const State: TState = {
  games: [
    {
      id: '1',
      name: 'test',
      stage: GameStage.new,
      players: {
        1: {
          capacity: 5,
          cards: {
            deck: [],
            hand: [],
            pile: [],
          },
          id: '1',
        },
      },
    },
    {
      id: '2',
      name: 'test2',
      stage: GameStage.new,
      players: {
        1: {
          capacity: 5,
          cards: {
            deck: [],
            hand: [],
            pile: [],
          },
          id: '1',
        },
      },
    },
    {
      id: '3',
      name: 'test3',
      stage: GameStage.new,
      players: {
        1: {
          capacity: 5,
          cards: {
            deck: [],
            hand: [],
            pile: [],
          },
          id: '1',
        },
      },
    },
  ],
}
