import {TState} from '@types'
import {getGame} from './game'

const game = getGame('test', 'first')

export const State: TState = {
  games: {[game.id]: game},
}
