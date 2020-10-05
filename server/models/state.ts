import {TState} from '@types'
import {createGame} from './game'

const game = createGame('test', 'first', '23oidj1923jd')

export const State: TState = {
  games: {[game.id]: game},
}
