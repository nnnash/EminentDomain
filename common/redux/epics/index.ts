import {combineEpics} from 'redux-observable'

import * as lobby from './lobby'

const epics = [lobby].reduce((acc, epic: {}) => acc.concat(Object.values(epic)), [])

export default combineEpics(...epics)
