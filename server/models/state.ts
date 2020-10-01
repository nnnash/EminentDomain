import {TState} from '@types'
import {getGame} from './game'

const game = getGame('test', 'first', '23oidj1923jd')

export const State: TState = {
  games: {[game.id]: game},
}
