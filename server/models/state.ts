import {TState} from '@types'
import {createGame} from './game'

const game = createGame('test', 'first', '23oidj1923jd')
const game2 = createGame('test', 'second', '23oidj1923jdd')
const game3 = createGame('test', 'third', '23oidj1923jdadf')
const game4 = createGame('test', 'fourth', '23oidj1923jd[jdk')

export const State: TState = {
  games: {[game.id]: game, [game2.id]: game2, [game3.id]: game3, [game4.id]: game4},
}
