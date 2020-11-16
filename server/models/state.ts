import {TState} from '@types'
import {readFileSync} from 'fs'
import {join} from 'path'

const defaultState: TState = {
  games: {},
}

let state
try {
  state = JSON.parse(readFileSync(join(__dirname, '../../..', 'state.json'), 'utf8')) as TState
} catch (e) {
  state = defaultState
}

export const State = state
